import axios from "axios";
import { ACCENT_COLOR, ACCESS_TOKEN, APP_BASE_DMS_URL, COGNITO_USERNAME, USER_EMAIL } from "core/constants";
import { getAuthMethod } from "core/utils";
import AnalyticsLineChart from "presentation/components/charts/line_chart";
import AnalyticsLineChartSingle from "presentation/components/charts/line_chart_single";
import AnalyticsPieChart from "presentation/components/charts/pie_chart";
import ShapeBarChart from "presentation/components/charts/shape_bar_chart";
import DashboardCard from "presentation/components/dashboardCard/dashboard_card";
import React, { useEffect, useState } from "react";
import { InfinitySpin } from "react-loader-spinner";
import { toast } from "react-toastify";

const fetchDmsMetric = async (clientID, modelName, modelVersion, metricPath, intervalObject, successCallback) => {
    const uri = `${APP_BASE_DMS_URL}/dms/api/v2/metrics/clients/${clientID}/${metricPath}`;
        let startDateTimeRange = new Date(intervalObject["startDate"]);
        let endDateTimeRange = new Date(intervalObject["endDate"]);
        
        startDateTimeRange.setHours(0, 0, 0, 0);
        endDateTimeRange.setHours(23, 59, 59, 0);
        console.log('start', startDateTimeRange)
        console.log('end', endDateTimeRange)

        const apiCalledAt = new Date()
        await axios
        .get(uri, {
            headers: {
                AuthMethod: getAuthMethod(),
                Token: localStorage.getItem(ACCESS_TOKEN),
                ClientId: clientID,
                TokenId: localStorage.getItem(USER_EMAIL),
                CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
            },
            params: {
                startTime: startDateTimeRange.toISOString(),
                endTime: endDateTimeRange.toISOString(),
                modelName: modelName,
                modelVersion: modelVersion
            },
        })
        .then((res) => {
            const currTime = new Date();
            const elapsedTime = currTime - apiCalledAt;
            console.log(metricPath, elapsedTime);
            if(successCallback) successCallback(res.data);
        })
        .catch((e) => {
            var errorDescription = e.response?.data?.error?.description;
            if (errorDescription != null) {
                toast.error(errorDescription, {
                    toastId: "errorToast",
                });
            } else {
                toast.error("Something Went Wrong.", {
                    toastId: "errorToast",
                });
            }
        });
}

export const METRIC_TYPES = {
    NUMBER_CARD: 'NUMBER_CARD',
    LATENCY_LINE_CHART: 'LATENCY_LINE_CHART',
    DAU_LINE_CHART: 'DAU_LINE_CHART',
    PIE_CHART: 'PIE_CHART',
    BAR_CHART: 'BAR_CHART'
}

const MetricDisplay = ({metricType = METRIC_TYPES.NUMBER_CARD, clientID, modelName, modelVersion, intervalObject, metricPath, metricKey = '', processMetricValue = (data) => {return data}, cardIconAddress, cardInfoTitle, cardInfoSubtitle, cardSubText = ''}) => {
    const [loading, setLoading] = useState(true);
    const [metricValue, setMetricValue] = useState(null);
    useEffect(() => {
        setLoading(true);
        fetchDmsMetric(clientID, modelName, modelVersion, metricPath, intervalObject, (data) => {
            if(metricType == METRIC_TYPES.LATENCY_LINE_CHART) {
                setMetricValue(data);
            } else {
                const metricVal = processMetricValue(data[metricKey]);
                setMetricValue(metricVal);
            }
            setLoading(false);
        });
        
    }, [clientID, modelName, modelVersion, intervalObject])
    return (
        <>
            {
                metricType == METRIC_TYPES.NUMBER_CARD &&
                <DashboardCard
                    loading={loading}
                    cardIconAddress={cardIconAddress}
                    cardInfoTitle={cardInfoTitle}
                    cardInfoSubtitle={cardInfoSubtitle}
                    cardText={metricValue}
                    cardSubText={cardSubText}
                ></DashboardCard>
            }
            {
                metricType == METRIC_TYPES.LATENCY_LINE_CHART &&
                <div className="graph-holder">
                    {
                        (loading || metricValue == null) ?
                        <div className="loader">
                            <InfinitySpin color={ACCENT_COLOR}></InfinitySpin>
                        </div>
                        :
                        <>
                        <div className="heading-row">
                            <img className="card-icon" src={cardIconAddress} />
                            <div className="card-info">
                                <p className="bodyText">{cardInfoTitle}</p>
                                <p className="subHeading2">{cardInfoSubtitle}</p>
                            </div>
                        </div>
                        <AnalyticsLineChart
                        trends={
                            metricValue["LatencyTrends"] == null
                            ? { none: [] }
                            : metricValue["LatencyTrends"]
                        }
                        trendsTimeline={metricValue["latencyTrendsTimeline"]}
                        ></AnalyticsLineChart>
                        </>
                    }
                </div>
            }
            {
                metricType == METRIC_TYPES.DAU_LINE_CHART &&
                <div className="graph-holder">
                    {
                        (loading || metricValue == null) ?
                        <div className="loader">
                            <InfinitySpin color={ACCENT_COLOR}></InfinitySpin>
                        </div>
                        :
                        <>
                            <div className="heading-row">
                                <img className="card-icon" src={cardIconAddress} />
                                <div className="card-info">
                                    <p className="bodyText">{cardInfoTitle}</p>
                                    <p className="subHeading2">{cardInfoSubtitle}</p>
                                </div>
                            </div>
                            <AnalyticsLineChartSingle trends={metricValue}></AnalyticsLineChartSingle>
                        </>
                    }
                </div>
            }
            {
                metricType == METRIC_TYPES.PIE_CHART &&
                <div className="pie-graph-holder">
                    {
                        (loading || metricValue == null) ?
                        <div className="loader">
                            <InfinitySpin color={ACCENT_COLOR}></InfinitySpin>
                        </div>
                        :
                        <>
                            <div className="heading-row">
                                <img className="card-icon" src={cardIconAddress} />
                                <div className="card-info">
                                    <p className="bodyText">{cardInfoTitle}</p>
                                    <p className="subHeading2">{cardInfoSubtitle}</p>
                                </div>
                            </div>
                            <AnalyticsPieChart trends={metricValue}></AnalyticsPieChart>
                        </>
                    }
                    
                </div>
            }
            {
                metricType == METRIC_TYPES.BAR_CHART &&
                <div className="pie-graph-holder">
                    {
                        (loading || metricValue == null) ?
                        <div className="loader">
                            <InfinitySpin color={ACCENT_COLOR}></InfinitySpin>
                        </div>
                        :
                        <>
                            <div className="heading-row">
                                <img className="card-icon" src={cardIconAddress} />
                                <div className="card-info">
                                    <p className="bodyText">{cardInfoTitle}</p>
                                    <p className="subHeading2">{cardInfoSubtitle}</p>
                                </div>
                            </div>
                            <ShapeBarChart trends={metricValue}></ShapeBarChart>
                        </>
                    }
                    
                </div>
            }
    </>)
}

export default MetricDisplay;