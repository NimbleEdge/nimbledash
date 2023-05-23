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
import { ACCESS_TOKEN, USER_EMAIL } from "core/constants";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DashboardPage() {
  var [metrics, setMetrics] = useState({});
  var [modelJson, setModelJson] = useState({});
  var [selectedModelIndex, setSelectedModelIndex] = useState(0);
  var selectedVersionIndex = 0;
  const dispatch = useDispatch();

  var [isModalVisible, setModalVisiblity] = useState(true);
  var [clientID, setClientID] = useState("");

  const handleClientIDChange = (input) => {
    dispatch(loaderActions.toggleLoader(true));
    setClientID(input);
  };

  useEffect(() => {
    if (clientID != "") {
      validateCliendID();
    }
  }, [clientID]);

  const validateCliendID = async () => {
    await axios
      .post(
        "http://localhost:8010/proxy/mds/api/v1/admin/sso",
        { email: localStorage.getItem(USER_EMAIL) },
        {
          headers: { clientid: clientID },
        }
      )
      .then((res) => {
        if (res.data["permission"] == "read_write") {
          fetchModelList();
          setModalVisiblity(false);
        } else {
          toast.error("Wrong Clientid");
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("Something Went Wrong.");
      });
  };

  const fetchModelList = async () => {
    var tempJson = {};
    await axios
      .get("http://localhost:8010/proxy/mds/api/v1/admin/models", {
        headers: {
          clientid: clientID,
          tokenid: localStorage.getItem(USER_EMAIL),
          SsoToken: localStorage.getItem(ACCESS_TOKEN),
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
        console.log(tempJson);
        fetchMetrics();
        setModelJson(tempJson);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Something Went Wrong.");
      });
      dispatch(loaderActions.toggleLoader(false));
  };

  const closeModalCallback = () => {
    setModalVisiblity(false);
  };

  const fetchMetrics = async () => {
    await axios
      .get(
        `http://localhost:9000/proxy/dms/api/v1/metrics/clients/${clientID}/inference`,
        {
          headers: {
            tokenid: localStorage.getItem(USER_EMAIL),
            SsoToken: localStorage.getItem(ACCESS_TOKEN),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setMetrics(res.data);
      })
      .catch((e) => {});
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

      <SideBar></SideBar>

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
                onChangeCallback={(modelIndex) => {
                  // console.log(modelName);
                  setSelectedModelIndex(modelIndex);
                }}
              ></DropdownComponent>
              <DropdownComponent
                itemList={modelJson[Object.keys(modelJson)[selectedModelIndex]]}
                customClass={"custom-dropdown"}
                onChangeCallback={(versionIndex) => {
                  selectedVersionIndex = versionIndex;
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
              cardText={metrics["averageLatency"]}
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
                <p className="subHeading2">Last 20 Inferences</p>
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
