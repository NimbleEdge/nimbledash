// @ts-nocheck
import React, { useEffect } from "react";
import "./dashboard_page.css";
import "react-dropdown/style.css";
import DropdownComponent from "../../components/dropdownMenu/dropdown";
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownButton, SplitButton, ButtonGroup } from "react-bootstrap";
import { useState } from "react";
import DashboardCard from "../../components/dashboardCard/dashboard_card";
import AnalyticsLineChart from "../../components/charts/line_chart";
import PieChartComponent from "../../components/charts/pie_chart";
import AnalyticsPieChart from "../../components/charts/pie_chart";
import AnalyticsRadarChart from "../../components/charts/radar_chart";
import InputModal from "../../components/inputModal/inputModal";
import { getRequest } from "data/remote_datasource";
import SideBar from "presentation/components/sideBar/side_bar";
import axios from "axios";
import {
  ACCESS_TOKEN,
  USER_EMAIL,
  CLIENT_ID,
  APP_BASE_URL,
  GRAPH_COLORS,
  COGNITO_USERNAME
} from "core/constants";
import { useDispatch } from "react-redux";
import {
  dashboardActions,
  loaderActions,
} from "presentation/redux/stores/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DashboardPage() {
  var [metrics, setMetrics] = useState({});
  var [modelJson, setModelJson] = useState({});
  var [selectedModelIndex, setSelectedModelIndex] = useState(0);
  var [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
  const dispatch = useDispatch();

  var [isModalVisible, setModalVisiblity] = useState(true);
  var [clientID, setClientID] = useState("");

  const handleClientIDChange = (input) => {
    setClientID(input);
  };

  const closeModalCallback = () => {
    setModalVisiblity(false);
  };

  const calculateRadarLegend = (trends) => {
    var trendsKeys = Object.keys(trends);
    var temp = [];
    trendsKeys.forEach((key, index) => {
      console.log("trends", trends[key]);
      temp.push({
        subject: key,
        A: trends[key],
      });
    });
    return temp;
  };

  useEffect(() => {
    dispatch(loaderActions.toggleLoader(true));
    var cachedClientId = localStorage.getItem(CLIENT_ID);
    if (clientID == "" && cachedClientId != null) {
      setClientID(cachedClientId);
    } else if (clientID == "") {
      dispatch(loaderActions.toggleLoader(false));
    }
    if (clientID != "") {
      validateCliendID();
    }
  }, [clientID]);

  const validateCliendID = async () => {
    await axios
      .get(`${APP_BASE_URL}/mds/api/v1/admin/models`, {
        headers: {
          AuthMethod: "Cognito",
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: clientID,
          TokenId: localStorage.getItem(USER_EMAIL),
          CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
        },
      })
      .then((res) => {
        if (res.status == 200) {
          localStorage.setItem(CLIENT_ID, clientID);
          fetchModelList();
          setModalVisiblity(false);
        } else {
          toast.error("Wrong Clientid");
        }
      })
      .catch((e) => {
        console.log(e);

        var errorDescription = e.response?.data?.error?.description;
        if (errorDescription != null) toast.error(errorDescription);
        else toast.error("Something Went Wrong.");

        dispatch(loaderActions.toggleLoader(false));
      });
  };

  const fetchModelList = async () => {
    toast("Fetching data", { autoClose: 100 });
    var tempJson = {};
    await axios
      .get(`${APP_BASE_URL}/mds/api/v1/admin/models`, {
        headers: {
          AuthMethod: "Cognito",
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: clientID,
          TokenId: localStorage.getItem(USER_EMAIL),
          CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
        },
      })
      .then((res) => {
        tempJson["All Models"] = ["Latest"];
        res.data.models.forEach((modelNameVersionMap) => {
          var key = modelNameVersionMap.modelName;
          if (tempJson.hasOwnProperty(key)) {
            tempJson[key].push(modelNameVersionMap.modelVersion);
          } else {
            tempJson[key] = ["All Versions", modelNameVersionMap.modelVersion];
          }
        });

        fetchMetrics(null, null);
        setModelJson(tempJson);
      })
      .catch((e) => {
        console.log(e);
        var errorDescription = e.response?.data?.error?.description;
        if (errorDescription != null) toast.error(errorDescription);
        else toast.error("Something Went Wrong.");
      });
  };

  const fetchMetrics = async (modelName, versionName) => {
    var uri = "";
    if (modelName == null && versionName == null) {
      uri = `${APP_BASE_URL}/dms/api/v1/metrics/clients/${clientID}/inference`;
    } else if (modelName != null && versionName == null) {
      uri = `${APP_BASE_URL}/dms/api/v1/metrics/clients/${clientID}/models/${modelName}/inference`;
    } else if (modelName != null && versionName != null) {
      uri = `${APP_BASE_URL}/dms/api/v1/metrics/clients/${clientID}/models/${modelName}/versions/${versionName}/inference`;
    }
    console.log("request uri is", uri);
    await axios
      .get(uri, {
        headers: {
          AuthMethod: "Cognito",
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: clientID,
          TokenId: localStorage.getItem(USER_EMAIL),
          CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
        },
      })
      .then((res) => {
        setMetrics(res.data);
      })
      .catch((e) => {
        var errorDescription = e.response?.data?.error?.description;
        if (errorDescription != null) toast.error(errorDescription);
        else toast.error("Something Went Wrong.");
      });

    dispatch(loaderActions.toggleLoader(false));
  };

  return (
    <div className="dashboardPage">
      {isModalVisible && (
        <InputModal
          initValue={clientID}
          getInputCallback={handleClientIDChange}
          closeModalCallback={closeModalCallback}
        ></InputModal>
      )}

      {Object.keys(metrics).length != 0 && (
        <div className="dashboard-content">
          <div className="page-title">
            <p className="heading3">Dashboard</p>
            <p className="subHeading">Live Analytical Updates.</p>
          </div>
          <div className="dropdown-array">
            <div
              className="clientID-selector"
              onClick={() => setModalVisiblity(true)}
            >
              <p className="buttonText spinner-text">{clientID}</p>
            </div>

            <div>
              <DropdownComponent
                itemList={Object.keys(modelJson)}
                customClass={"custom-dropdown"}
                selectedItemIndex={selectedModelIndex}
                onChangeCallback={(modelIndex) => {
                  console.log("modelIndex", modelIndex);
                  if (modelIndex == 0) {
                    fetchMetrics(null, null);
                  } else {
                    fetchMetrics(Object.keys(modelJson)[modelIndex], null);
                  }
                  setSelectedModelIndex(modelIndex);
                  setSelectedVersionIndex(0);
                }}
              ></DropdownComponent>
              <DropdownComponent
                itemList={modelJson[Object.keys(modelJson)[selectedModelIndex]]}
                customClass={"custom-dropdown"}
                selectedItemIndex={selectedVersionIndex}
                onChangeCallback={(versionIndex) => {
                  if (selectedModelIndex == 0) {
                    fetchMetrics(null, null);
                  } else if (versionIndex == 0) {
                    fetchMetrics(
                      Object.keys(modelJson)[selectedModelIndex],
                      null
                    );
                  } else {
                    fetchMetrics(
                      Object.keys(modelJson)[selectedModelIndex],
                      modelJson[Object.keys(modelJson)[selectedModelIndex]][
                        versionIndex
                      ]
                    );
                  }
                  setSelectedVersionIndex(versionIndex);
                }}
              ></DropdownComponent>
            </div>
          </div>
          <div className="number-card-array">
            <DashboardCard
              cardIconAddress="/assets/icons/total_inferences.jpg"
              cardInfoTitle="Total Inferences"
              cardInfoSubtitle="Lifetime"
              cardText={metrics["totalInferences"]}
              cardSubText="calls made"
            ></DashboardCard>

            <div className="right-margin24"></div>

            <DashboardCard
              cardIconAddress="/assets/icons/total_error.jpg"
              cardInfoTitle="Total Errors"
              cardInfoSubtitle="Lifetime"
              cardText={metrics["totalErrors"]}
              cardSubText="calls made"
            ></DashboardCard>

            <div className="right-margin24"></div>

            <DashboardCard
              cardIconAddress="/assets/icons/avg_inferences.jpg"
              cardInfoTitle="Average Inferences"
              cardInfoSubtitle="Per Day"
              cardText={metrics["averageInferences"]}
              cardSubText="calls made"
            ></DashboardCard>

            <div className="right-margin24"></div>

            <DashboardCard
              cardIconAddress="/assets/icons/avg_latency.jpg"
              cardInfoTitle="Average Latency"
              cardInfoSubtitle="Per Day"
              cardText={(metrics["averageLatency"] / 1000).toFixed(2)}
              cardSubText="milliseconds"
            ></DashboardCard>
          </div>

          <div className="graph-holder">
            <div className="heading-row">
              <img
                className="card-icon"
                src="/assets/icons/avg_latency.jpg"
              ></img>
              <div className="card-info">
                <p className="bodyText">Latency Trends</p>
                <p className="subHeading2">Average latency per 30 mins</p>
              </div>
            </div>
            <AnalyticsLineChart
              trends={metrics["LatencyTrends"]}
            ></AnalyticsLineChart>
          </div>

          <div className="row-flex">
            <div className="pie-graph-holder">
              <div className="heading-row">
                <img
                  className="card-icon"
                  src="/assets/icons/total_inferences.jpg"
                ></img>
                <div className="card-info">
                  <p className="bodyText">Total Inferences</p>
                  <p className="subHeading2">
                    Comparing latest versions of all model
                  </p>
                </div>
              </div>
              <AnalyticsPieChart
                trends={metrics["totalInferenceTrends"]}
              ></AnalyticsPieChart>
            </div>

            <div className="right-margin24"></div>

            <div className="pie-graph-holder">
              <div className="heading-row">
                <img
                  className="card-icon"
                  src="/assets/icons/active_users.jpg"
                ></img>
                <div className="card-info">
                  <p className="bodyText">Active Users</p>
                  <p className="subHeading2">Across all the live models</p>
                </div>
              </div>
              <div className="pie-chart-legend chart-legend">
                {calculateRadarLegend(metrics["activeUsersTrends"]).map(
                  (item, index) => (
                    <div className="sub-chart-legend">
                      <div className="legend-row">
                        <div
                          className="legend-color"
                          style={{
                            backgroundColor:
                              GRAPH_COLORS[index % GRAPH_COLORS.length],
                          }}
                        ></div>
                        <p className="legend-title subHeading2">
                          {item.subject}
                        </p>
                      </div>
                      <p className="legend-value">{item.A}</p>
                    </div>
                  )
                )}
              </div>
              <AnalyticsRadarChart
                trends={metrics["activeUsersTrends"]}
              ></AnalyticsRadarChart>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
