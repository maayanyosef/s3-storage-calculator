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

    // Helper function to convert TB to GB using decimal conversion (1 TB = 1,000 GB)
    function convertToGB(size, unit) {
        unit = unit.trim().toUpperCase();
        if (unit === "TB") {
            return size * 1000; // AWS uses decimal units
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

    // Continue similar calculations for other storage tiers (One Zone-IA, Glacier IR, Glacier FR, Glacier DA, Intelligent-Tiering)
    // ...

    // Update Total Monthly Cost
    document.getElementById('total-monthly-cost').innerText = `$${totalMonthlyCost.toFixed(2)}`;
}
