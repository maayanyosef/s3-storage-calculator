// Global variable to store the selected region
let selectedRegion = 'us-east-1'; // Default region

// Global variable to store the pricing data
let pricingData = {};

// Function to load pricing data from YAML file
function loadPricingData() {
    fetch('pricingData.yaml')
        .then(response => response.text())
        .then(data => {
            pricingData = jsyaml.load(data);
            // Enable the Calculate button
            document.getElementById('calculateButton').disabled = false;
        })
        .catch(error => {
            console.error('Error loading pricing data:', error);
            alert('Failed to load pricing data. Please try again later.');
        });
}

// Call loadPricingData when the page loads
window.onload = function () {
    loadPricingData();
    // Initialize Tippy.js tooltips
    tippy('[data-tippy-content]', {
        animation: 'scale',
        theme: 'light-border',
        delay: [100, 100],
    });
};

// Function to update the selected region
function updateRegion() {
    const regionSelect = document.getElementById('regionSelect');
    selectedRegion = regionSelect.value;

    // Update the note about the pricing region
    const regionNames = {
        'us-east-1': 'US East (N. Virginia)',
        'us-east-2': 'US East (Ohio)',
        'us-west-1': 'US West (N. California)',
        'us-west-2': 'US West (Oregon)',
        'eu-west-1': 'EU (Ireland)',
        'il-central-1': 'Israel (Tel Aviv)',
        // Add more region names as needed
    };

    const pricingNote = document.getElementById('pricingNote');
    pricingNote.innerHTML = `<strong>Note:</strong> The prices are based on the <em>${regionNames[selectedRegion]}</em> region.`;
}

// Function to calculate costs
function calculateCosts() {
    // Ensure that pricingData is loaded
    if (Object.keys(pricingData).length === 0) {
        alert('Pricing data is not loaded yet. Please try again shortly.');
        return;
    }

    // Get the pricing data for the selected region
    const regionPricing = pricingData[selectedRegion];

    if (!regionPricing) {
        alert('Pricing data for the selected region is not available.');
        return;
    }

    const prices = regionPricing.prices;
    const requestCosts = regionPricing.requestCosts;
    const retrievalCosts = regionPricing.retrievalCosts;

    // Helper function to convert TB to GB
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
