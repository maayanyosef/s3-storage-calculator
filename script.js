function calculateCosts() {
    // Prices per GB per month (example rates)
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
            archiveAccess: 0.004,
            deepArchiveAccess: 0.00099,
            monitoring: 0.0025 // per 1,000 objects
        }
    };

    // Request costs per 1,000 requests (example rates)
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

    // Retrieval costs per GB (example rates)
    const retrievalCosts = {
        standard: 0,
        standardIA: 0.01,
        oneZoneIA: 0.01,
        glacierIR: 0.03,
        glacierFR: 0.01,
        glacierDA: 0.02,
        intelligentTiering: {
            frequentAccess: 0,
            infrequentAccess: 0.01,
            archiveAccess: 0.03,
            deepArchiveAccess: 0.02
        }
    };

    // S3 Standard
    const standardSize = parseFloat(document.getElementById('standard-size').value) || 0;
    const standardPutRequests = parseFloat(document.getElementById('standard-put-requests').value) || 0;
    const standardGetRequests = parseFloat(document.getElementById('standard-get-requests').value) || 0;
    const standardRetrieval = parseFloat(document.getElementById('standard-retrieval').value) || 0;

    const standardStorageCost = standardSize * prices.standard;
    const standardRequestCost = ((standardPutRequests / 1000) * requestCosts.standard.put) + ((standardGetRequests / 1000) * requestCosts.standard.get);
    const standardRetrievalCost = standardRetrieval * retrievalCosts.standard;

    const standardTotalCost = standardStorageCost + standardRequestCost + standardRetrievalCost;
    document.getElementById('standard-cost').innerText = `$${standardTotalCost.toFixed(2)}`;

    // Repeat similar calculations for other tiers...

    // S3 Standard-IA
    const standardIASize = parseFloat(document.getElementById('standard-ia-size').value) || 0;
    const standardIAPutRequests = parseFloat(document.getElementById('standard-ia-put-requests').value) || 0;
    const standardIAGetRequests = parseFloat(document.getElementById('standard-ia-get-requests').value) || 0;
    const standardIARetrieval = parseFloat(document.getElementById('standard-ia-retrieval').value) || 0;

    const standardIAStorageCost = standardIASize * prices.standardIA;
    const standardIARequestCost = ((standardIAPutRequests / 1000) * requestCosts.standardIA.put) + ((standardIAGetRequests / 1000) * requestCosts.standardIA.get);
    const standardIARetrievalCost = standardIARetrieval * retrievalCosts.standardIA;

    const standardIATotalCost = standardIAStorageCost + standardIARequestCost + standardIARetrievalCost;
    document.getElementById('standard-ia-cost').innerText = `$${standardIATotalCost.toFixed(2)}`;

    // S3 One Zone-IA
    const oneZoneIASize = parseFloat(document.getElementById('onezone-ia-size').value) || 0;
    const oneZoneIAPutRequests = parseFloat(document.getElementById('onezone-ia-put-requests').value) || 0;
    const oneZoneIAGetRequests = parseFloat(document.getElementById('onezone-ia-get-requests').value) || 0;
    const oneZoneIARetrieval = parseFloat(document.getElementById('onezone-ia-retrieval').value) || 0;

    const oneZoneIAStorageCost = oneZoneIASize * prices.oneZoneIA;
    const oneZoneIARequestCost = ((oneZoneIAPutRequests / 1000) * requestCosts.oneZoneIA.put) + ((oneZoneIAGetRequests / 1000) * requestCosts.oneZoneIA.get);
    const oneZoneIARetrievalCost = oneZoneIARetrieval * retrievalCosts.oneZoneIA;

    const oneZoneIATotalCost = oneZoneIAStorageCost + oneZoneIARequestCost + oneZoneIARetrievalCost;
    document.getElementById('onezone-ia-cost').innerText = `$${oneZoneIATotalCost.toFixed(2)}`;

    // S3 Glacier Instant Retrieval
    const glacierIRSize = parseFloat(document.getElementById('glacier-ir-size').value) || 0;
    const glacierIRPutRequests = parseFloat(document.getElementById('glacier-ir-put-requests').value) || 0;
    const glacierIRGetRequests = parseFloat(document.getElementById('glacier-ir-get-requests').value) || 0;
    const glacierIRRetrieval = parseFloat(document.getElementById('glacier-ir-retrieval').value) || 0;

    const glacierIRStorageCost = glacierIRSize * prices.glacierIR;
    const glacierIRRequestCost = ((glacierIRPutRequests / 1000) * requestCosts.glacierIR.put) + ((glacierIRGetRequests / 1000) * requestCosts.glacierIR.get);
    const glacierIRRetrievalCost = glacierIRRetrieval * retrievalCosts.glacierIR;

    const glacierIRTotalCost = glacierIRStorageCost + glacierIRRequestCost + glacierIRRetrievalCost;
    document.getElementById('glacier-ir-cost').innerText = `$${glacierIRTotalCost.toFixed(2)}`;

    // S3 Glacier Flexible Retrieval
    const glacierFRSize = parseFloat(document.getElementById('glacier-fr-size').value) || 0;
    const glacierFRPutRequests = parseFloat(document.getElementById('glacier-fr-put-requests').value) || 0;
    const glacierFRGetRequests = parseFloat(document.getElementById('glacier-fr-get-requests').value) || 0;
    const glacierFRRetrieval = parseFloat(document.getElementById('glacier-fr-retrieval').value) || 0;

    const glacierFRStorageCost = glacierFRSize * prices.glacierFR;
    const glacierFRRequestCost = ((glacierFRPutRequests / 1000) * requestCosts.glacierFR.put) + ((glacierFRGetRequests / 1000) * requestCosts.glacierFR.get);
    const glacierFRRetrievalCost = glacierFRRetrieval * retrievalCosts.glacierFR;

    const glacierFRTotalCost = glacierFRStorageCost + glacierFRRequestCost + glacierFRRetrievalCost;
    document.getElementById('glacier-fr-cost').innerText = `$${glacierFRTotalCost.toFixed(2)}`;

    // S3 Glacier Deep Archive
    const glacierDASize = parseFloat(document.getElementById('glacier-da-size').value) || 0;
    const glacierDAPutRequests = parseFloat(document.getElementById('glacier-da-put-requests').value) || 0;
    const glacierDAGetRequests = parseFloat(document.getElementById('glacier-da-get-requests').value) || 0;
    const glacierDARetrieval = parseFloat(document.getElementById('glacier-da-retrieval').value) || 0;

    const glacierDAStorageCost = glacierDASize * prices.glacierDA;
    const glacierDARequestCost = ((glacierDAPutRequests / 1000) * requestCosts.glacierDA.put) + ((glacierDAGetRequests / 1000) * requestCosts.glacierDA.get);
    const glacierDARetrievalCost = glacierDARetrieval * retrievalCosts.glacierDA;

    const glacierDATotalCost = glacierDAStorageCost + glacierDARequestCost + glacierDARetrievalCost;
    document.getElementById('glacier-da-cost').innerText = `$${glacierDATotalCost.toFixed(2)}`;

    // S3 Intelligent-Tiering
    const intelligentTieringSize = parseFloat(document.getElementById('intelligent-tiering-size').value) || 0;
    const intelligentTieringPutRequests = parseFloat(document.getElementById('intelligent-tiering-put-requests').value) || 0;
    const intelligentTieringGetRequests = parseFloat(document.getElementById('intelligent-tiering-get-requests').value) || 0;
    const intelligentTieringRetrieval = parseFloat(document.getElementById('intelligent-tiering-retrieval').value) || 0;

    // Assume all data in Frequent Access for simplicity
    const intelligentTieringStorageCost = intelligentTieringSize * prices.intelligentTiering.frequentAccess;
    const intelligentTieringRequestCost = ((intelligentTieringPutRequests / 1000) * requestCosts.intelligentTiering.put) + ((intelligentTieringGetRequests / 1000) * requestCosts.intelligentTiering.get);
    const intelligentTieringRetrievalCost = intelligentTieringRetrieval * retrievalCosts.intelligentTiering.frequentAccess;
    const intelligentTieringMonitoringCost = (intelligentTieringSize * 1024 * prices.intelligentTiering.monitoring) / 1000; // Assuming 1,024 objects per GB

    const intelligentTieringTotalCost = intelligentTieringStorageCost + intelligentTieringRequestCost + intelligentTieringRetrievalCost + intelligentTieringMonitoringCost;
    document.getElementById('intelligent-tiering-cost').innerText = `$${intelligentTieringTotalCost.toFixed(2)}`;
}
