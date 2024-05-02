import React, { useEffect } from "react";
import NumberCards from "./numberCards";
import MetricDisplay, { METRIC_TYPES } from "./metricDisplay";

const DashboardMetrics = ({clientID, selectedModelIndex, selectedVersionIndex, intervalObject, modelJson}) => {
    return (
        <>
            <NumberCards clientID={clientID} selectedModelIndex={selectedModelIndex} selectedVersionIndex={selectedVersionIndex} intervalObject={intervalObject} modelJson={modelJson}/>
            <MetricDisplay
                metricType={METRIC_TYPES.LATENCY_LINE_CHART}
                clientID={clientID}
                modelName={selectedModelIndex == 0 ? "" : Object.keys(modelJson)[selectedModelIndex]} 
                modelVersion={selectedModelIndex != 0 && selectedVersionIndex != 0 ? modelJson[Object.keys(modelJson)[selectedModelIndex]][selectedVersionIndex] : ""}
                intervalObject={intervalObject}
                metricPath={'latency-trends'}
                cardIconAddress={'/assets/icons/avg_latency.jpg'}
                cardInfoTitle={'Latency Trends'}
                cardInfoSubtitle={'Average latency per 15 mins'}
            />
            <MetricDisplay
                metricType={METRIC_TYPES.DAU_LINE_CHART}
                clientID={clientID}
                modelName={selectedModelIndex == 0 ? "" : Object.keys(modelJson)[selectedModelIndex]} 
                modelVersion={selectedModelIndex != 0 && selectedVersionIndex != 0 ? modelJson[Object.keys(modelJson)[selectedModelIndex]][selectedVersionIndex] : ""}
                intervalObject={intervalObject}
                metricPath={'dau'}
                metricKey={'dau'}
                cardIconAddress={'/assets/icons/avg_dau.jpg'}
                cardInfoTitle={'Daily Active Users'}
                cardInfoSubtitle={'Users with atleast 1 predict call each day'}
            />
            <MetricDisplay
                metricType={METRIC_TYPES.PIE_CHART}
                clientID={clientID}
                modelName={selectedModelIndex == 0 ? "" : Object.keys(modelJson)[selectedModelIndex]} 
                modelVersion={selectedModelIndex != 0 && selectedVersionIndex != 0 ? modelJson[Object.keys(modelJson)[selectedModelIndex]][selectedVersionIndex] : ""}
                intervalObject={intervalObject}
                metricPath={'inference-count-trends'}
                metricKey={'totalInferenceTrends'}
                cardIconAddress={'/assets/icons/total_inferences.jpg'}
                cardInfoTitle={'Total Inferences'}
                cardInfoSubtitle={'Comparing latest versions of all model'}
            />
        </>
    )
}

export default DashboardMetrics;