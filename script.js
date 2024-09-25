function calculateCosts() {
    // Prices per GB per month (example rates as of September 2021)
    const prices = {
        standard: 0.023,
        standardIA: 0.0125,
        oneZoneIA: 0.01,
        glacierIR: 0.004,
        glacierFR: 0.0036,
        glacierDA: 0.00099,
        intelligentTiering: {
            frequentAccess: 0.023,
            infrequentAccess: 0.0125,
            archiveInstantAccess: 0.004,
            archiveAccess: 0.0036,
            deepArchiveAccess: 0.00099,
            monitoring: 0.0025 // per 1,000 objects per month
        }
    };

    // Request costs per 1,000 requests
    const requestCosts = {
        standard: {
            put: 0.005,
            get: 0.0004
        },
        standardIA: {
            put: 0.01,
            get: 0.01
        },
        oneZoneIA: {
            put: 0.01,
            get: 0.01
        },
        glacierIR: {
            put: 0.06,
            get: 0.003
        },
        glacierFR: {
            put: 0.06,
            get: 0.01
        },
        glacierDA: {
            put: 0.06,
            get: 0.10
        },
        intelligentTiering: {
            put: 0.005,
            get: 0.0004
        }
    };

    // Retrieval costs per GB
    const retrievalCosts = {
        standard: 0,
        standardIA: 0.01,
        oneZoneIA: 0.01,
        glacierIR: 0.003,
        glacierFR: 0.01, // For Standard Retrievals
        glacierDA: 0.02, // For Standard Retrievals
        intelligentTiering: {
            frequentAccess: 0,
            infrequentAccess: 0,
            archiveInstantAccess: 0.003,
            archiveAccess: 0.01,
            deepArchiveAccess: 0.02
        }
    };

    // Helper function to convert TB to GB using decimal conversion (1 TB = 1,000 GB)
    function convertToGB(size, unit) {
        unit = unit.trim().toUpperCase();
        if (unit === "TB") {
            return size * 1000; // AWS uses decimal units
        }
        return size; // If unit is GB
    }

    let totalMonthlyCost = 0;

    // Function to calculate costs for a specific tier
    function calculateTierCost(tierId, pricePerGB, requestCost, retrievalCostPerGB) {
        const size = parseFloat(document.getElementById(`${tierId}-size`).value) || 0;
        const sizeUnit = document.getElementById(`${tierId}-size-unit`).value;
        const storageSizeGB = convertToGB(size, sizeUnit);

        const putRequests = parseFloat(document.getElementById(`${tierId}-put-requests`).value) || 0;
        const getRequests = parseFloat(document.getElementById(`${tierId}-get-requests`).value) || 0;

        const retrieval = parseFloat(document.getElementById(`${tierId}-retrieval`).value) || 0;
        const retrievalUnit = document.getElementById(`${tierId}-retrieval-unit`).value;
        const retrievalGB = convertToGB(retrieval, retrievalUnit);

        const storageCost = storageSizeGB * pricePerGB;
        const requestCostTotal = ((putRequests / 1000) * requestCost.put) + ((getRequests / 1000) * requestCost.get);
        const retrievalCost = retrievalGB * retrievalCostPerGB;

        const totalCost = storageCost + requestCostTotal + retrievalCost;
        document.getElementById(`${tierId}-cost`).innerText = `$${totalCost.toFixed(2)}`;

        return totalCost;
    }

    // S3 Standard
    totalMonthlyCost += calculateTierCost('standard', prices.standard, requestCosts.standard, retrievalCosts.standard);

    // S3 Standard-IA
    totalMonthlyCost += calculateTierCost('standard-ia', prices.standardIA, requestCosts.standardIA, retrievalCosts.standardIA);

    // S3 One Zone-IA
    totalMonthlyCost += calculateTierCost('onezone-ia', prices.oneZoneIA, requestCosts.oneZoneIA, retrievalCosts.oneZoneIA);

    // S3 Glacier Instant Retrieval
    totalMonthlyCost += calculateTierCost('glacier-ir', prices.glacierIR, requestCosts.glacierIR, retrievalCosts.glacierIR);

    // S3 Glacier Flexible Retrieval
    totalMonthlyCost += calculateTierCost('glacier-fr', prices.glacierFR, requestCosts.glacierFR, retrievalCosts.glacierFR);

    // S3 Glacier Deep Archive
    totalMonthlyCost += calculateTierCost('glacier-da', prices.glacierDA, requestCosts.glacierDA, retrievalCosts.glacierDA);

    // S3 Intelligent-Tiering
    {
        const tierId = 'intelligent-tiering';
        const size = parseFloat(document.getElementById(`${tierId}-size`).value) || 0;
        const sizeUnit = document.getElementById(`${tierId}-size-unit`).value;
        const storageSizeGB = convertToGB(size, sizeUnit);

        const putRequests = parseFloat(document.getElementById(`${tierId}-put-requests`).value) || 0;
        const getRequests = parseFloat(document.getElementById(`${tierId}-get-requests`).value) || 0;

        const retrieval = parseFloat(document.getElementById(`${tierId}-retrieval`).value) || 0;
        const retrievalUnit = document.getElementById(`${tierId}-retrieval-unit`).value;
        const retrievalGB = convertToGB(retrieval, retrievalUnit);

        // Assume 80% data in Frequent Access, 20% in Infrequent Access
        const frequentAccessSizeGB = storageSizeGB * 0.8;
        const infrequentAccessSizeGB = storageSizeGB * 0.2;

        const storageCost = (frequentAccessSizeGB * prices.intelligentTiering.frequentAccess) +
                            (infrequentAccessSizeGB * prices.intelligentTiering.infrequentAccess);

        const requestCost = ((putRequests / 1000) * requestCosts.intelligentTiering.put) +
                            ((getRequests / 1000) * requestCosts.intelligentTiering.get);
        // Assume all retrievals are from Infrequent Access Tier
        const retrievalCost = retrievalGB * retrievalCosts.intelligentTiering.infrequentAccess;

        // Monitoring cost: Assuming 1,000 objects per GB
        const numberOfObjects = storageSizeGB * 1000;
        const monitoringCost = (numberOfObjects / 1000) * prices.intelligentTiering.monitoring;

        const totalCost = storageCost + requestCost + retrievalCost + monitoringCost;
        document.getElementById(`${tierId}-cost`).innerText = `$${totalCost.toFixed(2)}`;

        totalMonthlyCost += totalCost;
    }
    // Update Total Monthly Cost
    document.getElementById('total-monthly-cost').innerText = `$${totalMonthlyCost.toFixed(2)}`;
}
