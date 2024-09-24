function calculateCosts() {
    // Prices per GB per month (example rates as of my knowledge cutoff in September 2021)
    const prices = {
        standard: 0.023,
        standardIA: 0.0125,
        oneZoneIA: 0.01,
        glacierIR: 0.004,
        glacierFR: 0.0036,
        glacierDA: 0.00099,
        intelligentTiering: {
            frequentAccess: 0.023,
            monitoring: 0.0025 // per 1,000 objects
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
        glacierIR: 0.03,
        glacierFR: 0.01,
        glacierDA: 0.02,
        intelligentTiering: 0.01 // Assuming infrequent access retrieval
    };

    // Helper function to convert TB to GB
    function convertToGB(size, unit) {
        if (unit === "TB") {
            return size * 1024; // 1 TB = 1024 GB
        }
        return size; // If unit is GB
    }

    let totalMonthlyCost = 0;

    // S3 Standard
    {
        const size = parseFloat(document.getElementById('standard-size').value) || 0;
        const sizeUnit = document.getElementById('standard-size-unit').value;
        const storageSizeGB = convertToGB(size, sizeUnit);

        const putRequests = parseFloat(document.getElementById('standard-put-requests').value) || 0;
        const getRequests = parseFloat(document.getElementById('standard-get-requests').value) || 0;

        const retrieval = parseFloat(document.getElementById('standard-retrieval').value) || 0;
        const retrievalUnit = document.getElementById('standard-retrieval-unit').value;
        const retrievalGB = convertToGB(retrieval, retrievalUnit);

        const storageCost = storageSizeGB * prices.standard;
        const requestCost = ((putRequests / 1000) * requestCosts.standard.put) + ((getRequests / 1000) * requestCosts.standard.get);
        const retrievalCost = retrievalGB * retrievalCosts.standard;

        const totalCost = storageCost + requestCost + retrievalCost;
        document.getElementById('standard-cost').innerText = `$${totalCost.toFixed(2)}`;

        totalMonthlyCost += totalCost;
    }

    // S3 Standard-IA
    {
        const size = parseFloat(document.getElementById('standard-ia-size').value) || 0;
        const sizeUnit = document.getElementById('standard-ia-size-unit').value;
        const storageSizeGB = convertToGB(size, sizeUnit);

        const putRequests = parseFloat(document.getElementById('standard-ia-put-requests').value) || 0;
        const getRequests = parseFloat(document.getElementById('standard-ia-get-requests').value) || 0;

        const retrieval = parseFloat(document.getElementById('standard-ia-retrieval').value) || 0;
        const retrievalUnit = document.getElementById('standard-ia-retrieval-unit').value;
        const retrievalGB = convertToGB(retrieval, retrievalUnit);

        const storageCost = storageSizeGB * prices.standardIA;
        const requestCost = ((putRequests / 1000) * requestCosts.standardIA.put) + ((getRequests / 1000) * requestCosts.standardIA.get);
        const retrievalCost = retrievalGB * retrievalCosts.standardIA;

        const totalCost = storageCost + requestCost + retrievalCost;
        document.getElementById('standard-ia-cost').innerText = `$${totalCost.toFixed(2)}`;

        totalMonthlyCost += totalCost;
    }

    // S3 One Zone-IA
    {
        const size = parseFloat(document.getElementById('onezone-ia-size').value) || 0;
        const sizeUnit = document.getElementById('onezone-ia-size-unit').value;
        const storageSizeGB = convertToGB(size, sizeUnit);

        const putRequests = parseFloat(document.getElementById('onezone-ia-put-requests').value) || 0;
        const getRequests = parseFloat(document.getElementById('onezone-ia-get-requests').value) || 0;

        const retrieval = parseFloat(document.getElementById('onezone-ia-retrieval').value) || 0;
        const retrievalUnit = document.getElementById('onezone-ia-retrieval-unit').value;
        const retrievalGB = convertToGB(retrieval, retrievalUnit);

        const storageCost = storageSizeGB * prices.oneZoneIA;
        const requestCost = ((putRequests / 1000) * requestCosts.oneZoneIA.put) + ((getRequests / 1000) * requestCosts.oneZoneIA.get);
        const retrievalCost = retrievalGB * retrievalCosts.oneZoneIA;

        const totalCost = storageCost + requestCost + retrievalCost;
        document.getElementById('onezone-ia-cost').innerText = `$${totalCost.toFixed(2)}`;

        totalMonthlyCost += totalCost;
    }

    // S3 Glacier Instant Retrieval
    {
        const size = parseFloat(document.getElementById('glacier-ir-size').value) || 0;
        const sizeUnit = document.getElementById('glacier-ir-size-unit').value;
        const storageSizeGB = convertToGB(size, sizeUnit);

        const putRequests = parseFloat(document.getElementById('glacier-ir-put-requests').value) || 0;
        const getRequests = parseFloat(document.getElementById('glacier-ir-get-requests').value) || 0;

        const retrieval = parseFloat(document.getElementById('glacier-ir-retrieval').value) || 0;
        const retrievalUnit = document.getElementById('glacier-ir-retrieval-unit').value;
        const retrievalGB = convertToGB(retrieval, retrievalUnit);

        const storageCost = storageSizeGB * prices.glacierIR;
        const requestCost = ((putRequests / 1000) * requestCosts.glacierIR.put) + ((getRequests / 1000) * requestCosts.glacierIR.get);
        const retrievalCost = retrievalGB * retrievalCosts.glacierIR;

        const totalCost = storageCost + requestCost + retrievalCost;
        document.getElementById('glacier-ir-cost').innerText = `$${totalCost.toFixed(2)}`;

        totalMonthlyCost += totalCost;
    }

    // S3 Glacier Flexible Retrieval
    {
        const size = parseFloat(document.getElementById('glacier-fr-size').value) || 0;
        const sizeUnit = document.getElementById('glacier-fr-size-unit').value;
        const storageSizeGB = convertToGB(size, sizeUnit);

        const putRequests = parseFloat(document.getElementById('glacier-fr-put-requests').value) || 0;
        const getRequests = parseFloat(document.getElementById('glacier-fr-get-requests').value) || 0;

        const retrieval = parseFloat(document.getElementById('glacier-fr-retrieval').value) || 0;
        const retrievalUnit = document.getElementById('glacier-fr-retrieval-unit').value;
        const retrievalGB = convertToGB(retrieval, retrievalUnit);

        const storageCost = storageSizeGB * prices.glacierFR;
        const requestCost = ((putRequests / 1000) * requestCosts.glacierFR.put) + ((getRequests / 1000) * requestCosts.glacierFR.get);
        const retrievalCost = retrievalGB * retrievalCosts.glacierFR;

        const totalCost = storageCost + requestCost + retrievalCost;
        document.getElementById('glacier-fr-cost').innerText = `$${totalCost.toFixed(2)}`;

        totalMonthlyCost += totalCost;
    }

    // S3 Glacier Deep Archive
    {
        const size = parseFloat(document.getElementById('glacier-da-size').value) || 0;
        const sizeUnit = document.getElementById('glacier-da-size-unit').value;
        const storageSizeGB = convertToGB(size, sizeUnit);

        const putRequests = parseFloat(document.getElementById('glacier-da-put-requests').value) || 0;
        const getRequests = parseFloat(document.getElementById('glacier-da-get-requests').value) || 0;

        const retrieval = parseFloat(document.getElementById('glacier-da-retrieval').value) || 0;
        const retrievalUnit = document.getElementById('glacier-da-retrieval-unit').value;
        const retrievalGB = convertToGB(retrieval, retrievalUnit);

        const storageCost = storageSizeGB * prices.glacierDA;
        const requestCost = ((putRequests / 1000) * requestCosts.glacierDA.put) + ((getRequests / 1000) * requestCosts.glacierDA.get);
        const retrievalCost = retrievalGB * retrievalCosts.glacierDA;

        const totalCost = storageCost + requestCost + retrievalCost;
        document.getElementById('glacier-da-cost').innerText = `$${totalCost.toFixed(2)}`;

        totalMonthlyCost += totalCost;
    }

    // S3 Intelligent-Tiering
    {
        const size = parseFloat(document.getElementById('intelligent-tiering-size').value) || 0;
        const sizeUnit = document.getElementById('intelligent-tiering-size-unit').value;
        const storageSizeGB = convertToGB(size, sizeUnit);

        const putRequests = parseFloat(document.getElementById('intelligent-tiering-put-requests').value) || 0;
        const getRequests = parseFloat(document.getElementById('intelligent-tiering-get-requests').value) || 0;

        const retrieval = parseFloat(document.getElementById('intelligent-tiering-retrieval').value) || 0;
        const retrievalUnit = document.getElementById('intelligent-tiering-retrieval-unit').value;
        const retrievalGB = convertToGB(retrieval, retrievalUnit);

        // Assume all data is in Frequent Access for simplicity
        const storageCost = storageSizeGB * prices.intelligentTiering.frequentAccess;

        const requestCost = ((putRequests / 1000) * requestCosts.intelligentTiering.put) + ((getRequests / 1000) * requestCosts.intelligentTiering.get);
        const retrievalCost = retrievalGB * retrievalCosts.intelligentTiering;

        // Monitoring cost: Assuming 1,024 objects per GB
        const numberOfObjects = storageSizeGB * 1024;
        const monitoringCost = (numberOfObjects / 1000) * prices.intelligentTiering.monitoring;

        const totalCost = storageCost + requestCost + retrievalCost + monitoringCost;
        document.getElementById('intelligent-tiering-cost').innerText = `$${totalCost.toFixed(2)}`;

        totalMonthlyCost += totalCost;
    }

    // Update Total Monthly Cost
    document.getElementById('total-monthly-cost').innerText = `$${totalMonthlyCost.toFixed(2)}`;
}
