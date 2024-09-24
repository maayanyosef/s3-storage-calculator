function analyzeBucket() {
    const accessKeyId = document.getElementById("accessKeyId").value;
    const secretAccessKey = document.getElementById("secretAccessKey").value;
    const sessionToken = document.getElementById("sessionToken").value;
    const bucketName = document.getElementById("bucketName").value;
    const region = document.getElementById("region").value || 'us-east-1';

    if (!accessKeyId || !secretAccessKey || !bucketName || !region) {
        alert("Please provide all the required credentials, bucket name, and region.");
        return;
    }

    // Configure AWS SDK with credentials
    AWS.config.update({
        region: region,
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
        sessionToken: sessionToken || undefined
    });

    const s3 = new AWS.S3();

    const params = {
        Bucket: bucketName
    };

    // Use listObjectsV2 for larger buckets
    let allObjects = [];
    let totalObjects = 0;
    let processedObjects = 0;

    function listAllObjects(marker) {
        if (marker) {
            params.ContinuationToken = marker;
        }

        s3.listObjectsV2(params, function(err, data) {
            if (err) {
                document.getElementById('bucketContents').innerText = 'Error: ' + err.message;
            } else {
                allObjects = allObjects.concat(data.Contents);
                if (data.IsTruncated) {
                    listAllObjects(data.NextContinuationToken);
                } else {
                    totalObjects = allObjects.length;
                    processObjects(allObjects);
                }
            }
        });
    }

    listAllObjects();

    function updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        const percentage = ((processedObjects / totalObjects) * 100).toFixed(2);
        progressBar.style.width = percentage + '%';
        progressBar.innerText = percentage + '%';
    }

    function processObjects(objects) {
        let output = `Objects in bucket:\n\n`;
        let totalCurrentCost = 0;
        let totalRecommendedCost = 0;

        // Pricing per GB per month (approximate, may vary by region)
        const pricing = {
            'STANDARD': 0.023, // S3 Standard
            'STANDARD_IA': 0.0125, // S3 Standard-IA
            'GLACIER': 0.0036, // S3 Glacier Flexible Retrieval
            'DEEP_ARCHIVE': 0.00099 // S3 Glacier Deep Archive
        };

        // Build a map for storage class names
        const storageClassNames = {
            'STANDARD': 'S3 Standard',
            'STANDARD_IA': 'S3 Standard-IA',
            'GLACIER': 'S3 Glacier Flexible Retrieval',
            'DEEP_ARCHIVE': 'S3 Glacier Deep Archive'
        };

        // Lifecycle policy rules grouped by prefix
        let lifecycleRules = {};

        // Map to keep track of prefixes and their recommendations
        let prefixRecommendations = {};

        let requests = objects.map(obj => {
            return new Promise((resolve, reject) => {
                const headParams = {
                    Bucket: bucketName,
                    Key: obj.Key,
                    Expires: 60 // URL expires in 60 seconds
                };

                // Skip folders (zero-byte objects ending in a slash)
                if (obj.Size === 0 && obj.Key.endsWith('/')) {
                    processedObjects++;
                    updateProgressBar();
                    resolve(null);
                    return;
                }

                // Generate a presigned URL for headObject operation to get metadata
                const presignedUrl = s3.getSignedUrl('headObject', headParams);

                // Fetch metadata via the presigned URL
                fetch(presignedUrl, {
                    method: 'HEAD'
                }).then(response => {
                    processedObjects++;
                    updateProgressBar();

                    if (response.ok) {
                        const size = response.headers.get('Content-Length');
                        const lastModifiedHeader = response.headers.get('Last-Modified');
                        const storageClass = response.headers.get('x-amz-storage-class') || 'STANDARD';

                        if (!size || !lastModifiedHeader) {
                            resolve();
                            return;
                        }

                        const lastModified = new Date(lastModifiedHeader);
                        const sizeInBytes = parseInt(size, 10);
                        const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);

                        const currentCost = sizeInGB * (pricing[storageClass] || pricing['STANDARD']);
                        totalCurrentCost += currentCost;

                        // output += `Object Key: ${obj.Key}\n`;
                        // output += `Size: ${(sizeInGB).toFixed(6)} GB\n`;
                        // output += `Last Modified: ${lastModified.toDateString()}\n`;
                        // output += `Current Storage Class: ${storageClassNames[storageClass] || storageClass}\n`;

                        // Suggest Lifecycle Policy
                        const suggestion = suggestLifecyclePolicy(sizeInGB, lastModified, storageClass);
                        // output += suggestion.recommendation + "\n";
                        totalRecommendedCost += suggestion.recommendedCost;

                        // Extract prefix (folder path)
                        const prefix = obj.Key.substring(0, obj.Key.lastIndexOf('/') + 1);

                        // Collect lifecycle rules by prefix
                        const ruleId = suggestion.lifecycleRuleId;
                        if (ruleId && prefix) {
                            const key = `${ruleId}:${prefix}`;
                            if (!lifecycleRules[key]) {
                                lifecycleRules[key] = {
                                    ID: `${ruleId} for ${prefix}`,
                                    Filter: {
                                        Prefix: prefix  // Apply rule based on object key prefix
                                    },
                                    // Status: "Enabled",
                                    Transitions: suggestion.transitions
                                };
                                console.log("Lifecycle Rule: ", lifecycleRules[key]);
                            }
                        }

                        // output += "-------------------------------------\n";
                        document.getElementById('bucketContents').innerText = output;
                        resolve(); // Resolve the promise after processing
                    } else {
                        resolve(); // Continue even if there is an error
                    }
                }).catch(err => {
                    console.error('Error fetching metadata:', err);
                    resolve(); // Continue even if there is an error
                });
            });
        });

        Promise.all(requests).then(() => {
            const totalSavings = totalCurrentCost - totalRecommendedCost;
            output += `\nTotal Current Monthly Cost: $${totalCurrentCost.toFixed(6)}\n`;
            output += `Total Recommended Monthly Cost: $${totalRecommendedCost.toFixed(6)}\n`;
            output += `Estimated Monthly Savings: $${totalSavings.toFixed(6)}\n`;

            document.getElementById('bucketContents').innerText = output;

            // Check if lifecycleRules is populated
            console.log("Lifecycle Rules Object: ", lifecycleRules);
            if (Object.keys(lifecycleRules).length > 0) {
                // Generate Lifecycle Policy
                const lifecyclePolicy = {
                    Rules: Object.values(lifecycleRules)
                };
                console.log("Generated Lifecycle Policy: ", lifecyclePolicy);

                // Properly format and display the lifecycle policy in the textarea
                document.getElementById('policyArea').value = JSON.stringify(lifecyclePolicy, null, 4);
            } else {
                document.getElementById('policyArea').value = 'No lifecycle rules generated';
            }

            // Reset Progress Bar
            document.getElementById('progressBar').style.width = '100%';
            document.getElementById('progressBar').innerText = '100%';
        });
    }

    // Function to suggest lifecycle policy based on size and last modified date
    function suggestLifecyclePolicy(sizeInGB, lastModified, currentStorageClass) {
        const now = new Date();
        const ageInDays = Math.floor((now - lastModified) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

        let recommendation = "Recommendation: ";
        let recommendedStorageClass = currentStorageClass;
        let transitions = [];
        let lifecycleRuleId = null;

        if (ageInDays > 180) {
            recommendedStorageClass = 'DEEP_ARCHIVE';
            recommendation += "Move to S3 Glacier Deep Archive.";
            transitions.push({
                Days: 180,
                StorageClass: 'DEEP_ARCHIVE'
            });
            lifecycleRuleId = "Transition to Glacier Deep Archive after 180 days";
        } else if (ageInDays > 90) {
            recommendedStorageClass = 'GLACIER';
            recommendation += "Move to S3 Glacier Flexible Retrieval.";
            transitions.push({
                Days: 90,
                StorageClass: 'GLACIER'
            });
            lifecycleRuleId = "Transition to Glacier after 90 days";
        } else if (ageInDays > 30) {
            recommendedStorageClass = 'STANDARD_IA';
            recommendation += "Move to S3 Standard-IA.";
            transitions.push({
                Days: 30,
                StorageClass: 'STANDARD_IA'
            });
            lifecycleRuleId = "Transition to Standard-IA after 30 days";
        } else {
            recommendedStorageClass = 'STANDARD';
            recommendation += "Keep in S3 Standard.";
        }

        const pricing = {
            'STANDARD': 0.023,
            'STANDARD_IA': 0.0125,
            'GLACIER': 0.0036,
            'DEEP_ARCHIVE': 0.00099
        };

        const currentPricing = pricing[currentStorageClass] || pricing['STANDARD'];
        const recommendedPricing = pricing[recommendedStorageClass];

        const currentCost = sizeInGB * currentPricing;
        const recommendedCost = sizeInGB * recommendedPricing;

        return {
            recommendation: recommendation,
            recommendedCost: recommendedCost,
            transitions: transitions,
            lifecycleRuleId: lifecycleRuleId
        };
    }
}
