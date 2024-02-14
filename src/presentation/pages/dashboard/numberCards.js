import React from "react";
import MetricDisplay from "./metricDisplay";

const shortenNumber = (num) => {
    num = num > 1000000 ? (num / 1000000).toFixed(2) + "M" : num.toFixed(2);
    return num;
}

const calculateAvgDAU = (dau) => {
    const valuesArray = Object.values(dau);
    const sum = valuesArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );
    if (valuesArray.length == 0) return 0;
    return Math.floor(sum / valuesArray.length);
};

const NumberCards = ({clientID, selectedModelIndex, selectedVersionIndex, intervalObject, modelJson}) => {
    return (
        <div className="number-card-array">
            <MetricDisplay 
                clientID={clientID} 
                modelName={selectedModelIndex == 0 ? "" : Object.keys(modelJson)[selectedModelIndex]} 
                modelVersion={selectedModelIndex != 0 && selectedVersionIndex != 0 ? modelJson[Object.keys(modelJson)[selectedModelIndex]][selectedVersionIndex] : ""} 
                intervalObject={intervalObject} 
                metricPath={'inference-count-trends'} 
                metricKey={'totalInferences'}
                cardIconAddress={"/assets/icons/total_inferences.jpg"}
                cardInfoTitle={"Total Inferences"}
                cardInfoSubtitle={"Over Timeframe"}
                cardSubText={"calls made"}
            />
            <div className="right-margin24"></div>
            <MetricDisplay
                clientID={clientID} 
                modelName={selectedModelIndex == 0 ? "" : Object.keys(modelJson)[selectedModelIndex]} 
                modelVersion={selectedModelIndex != 0 && selectedVersionIndex != 0 ? modelJson[Object.keys(modelJson)[selectedModelIndex]][selectedVersionIndex] : ""} 
                intervalObject={intervalObject} 
                metricPath={'inference-count-trends'} 
                metricKey={'totalErrors'}
                cardIconAddress={"/assets/icons/total_error.jpg"}
                cardInfoTitle={"Total Errors"}
                cardInfoSubtitle={"Over Timeframe"}
                cardSubText={"calls made"}
            />
            <div className="right-margin24"></div>
            <MetricDisplay
                clientID={clientID} 
                modelName={selectedModelIndex == 0 ? "" : Object.keys(modelJson)[selectedModelIndex]} 
                modelVersion={selectedModelIndex != 0 && selectedVersionIndex != 0 ? modelJson[Object.keys(modelJson)[selectedModelIndex]][selectedVersionIndex] : ""} 
                intervalObject={intervalObject} 
                metricPath={'dau'} 
                metricKey={'dau'}
                processMetricValue={calculateAvgDAU}
                cardIconAddress={"/assets/icons/avg_dau.jpg"}
                cardInfoTitle={"Avg DAU"}
                cardInfoSubtitle={"Over Timeframe"}
                cardSubText={"users"}
            />
            <div className="right-margin24"></div>
            <MetricDisplay
                clientID={clientID} 
                modelName={selectedModelIndex == 0 ? "" : Object.keys(modelJson)[selectedModelIndex]} 
                modelVersion={selectedModelIndex != 0 && selectedVersionIndex != 0 ? modelJson[Object.keys(modelJson)[selectedModelIndex]][selectedVersionIndex] : ""} 
                intervalObject={intervalObject} 
                metricPath={'average-inference'} 
                metricKey={'averageInferences'}
                processMetricValue={(val) => {return shortenNumber(val)}}
                cardIconAddress={"/assets/icons/avg_inferences.jpg"}
                cardInfoTitle={"Avg Inferences"}
                cardInfoSubtitle={"Per Day"}
                cardSubText={"calls made"}
            />
            <div className="right-margin24"></div>
            <MetricDisplay
                clientID={clientID} 
                modelName={selectedModelIndex == 0 ? "" : Object.keys(modelJson)[selectedModelIndex]} 
                modelVersion={selectedModelIndex != 0 && selectedVersionIndex != 0 ? modelJson[Object.keys(modelJson)[selectedModelIndex]][selectedVersionIndex] : ""} 
                intervalObject={intervalObject} 
                metricPath={'average-latency'} 
                metricKey={'averageLatency'}
                processMetricValue={(val) => {return (val/1000).toFixed(2)}}
                cardIconAddress={"/assets/icons/avg_latency.jpg"}
                cardInfoTitle={"Avg Latency"}
                cardInfoSubtitle={"Per Day"}
                cardSubText={"milliseconds"}
            />
        </div>
    )
}

export default NumberCards;