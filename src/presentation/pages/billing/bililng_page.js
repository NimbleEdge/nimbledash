import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import { loaderActions } from "presentation/redux/stores/store";
import React, { useEffect, useState, version } from "react";
import { useDispatch } from "react-redux";
import "../../../common.css";
import "../admin/admin_page.css";
import "./billing_page.css";
import AnalyticsLineChart from "presentation/components/charts/line_chart";
import {
  ACCESS_TOKEN,
  APP_BASE_DMS_URL,
  AUTH_METHOD,
  CLIENT_ID,
  COGNITO_USERNAME,
  DEFAULT_ANALYTICS,
  USER_EMAIL,
  getColorFromSeed,
} from "core/constants";
import StackedBarChart from "presentation/components/charts/stacked_bar_chart";
import axios from "axios";

function BillingPage() {
  const dispatch = useDispatch();
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [selectedMonthData, setSelectedMonthData] = useState({
    month: 9,
    year: 2023,
  });
  const [selectedMonth, setSelectedMonth] = useState("");

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [usageTrendsBreakdownData, setUsageTrendsBreakdownData] = useState({
    headers: [
      { text: "Name" },
      { text: "Description" },
      { text: "Models" },
      { text: "ACU Incurred" },
    ],
    body: [],
  });

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const [currentMonthTotalACU, setCurrentMonthTotalACU] = useState("N/A");
  const [previousMonthTotalACU, setPreviousMonthTotalACU] = useState("N/A");
  const [previousMonthTillDateACU, setPreviousMonthTillDateACU] =
    useState("N/A");
  const [trendsACU, setTrendsACU] = useState({});
  const [trendsTimeline, setTrendsTimeline] = useState({});
  const [trendsBreakdown, setTrendsBreakdown] = useState({});

  const proprocessTrendsBreakdownData = async (data) => {
    var processedData = [];

    for (let deployment of data) {
      processedData.push([
        {
          Component: TextOnlyComponent,
          data: {
            text: "v3.2.1",
            customStyle: {
              fontWeight: 500,
              color: "#494949",
              fontSize: "14px",
            },
            highlightOnHover: true,
          },
        },
        {
          Component: TextOnlyComponent,
          data: {
            text: "This is a short description of the compatiblity tag",
            customStyle: {
              color: "#74828F",
              fontWeight: 400,
              fontSize: "14px",
            },
            highlightOnHover: true,
          },
        },
        {
          Component: TagsListComponent,
          data: {
            tags: [
              `model-name-${deployment}`,
              "smol-model" + (deployment - 5 * 234),
            ],
            tableData: {
              headers: [{ text: "Name" }, { text: "Description" }],
              body: [
                [
                  {
                    Component: TextOnlyComponent,
                    data: {
                      text: "model-name-1",
                      customStyle: {
                        fontWeight: "500",
                        fontSize: "14px",
                        color: "#494949",
                        fontFamily: "Poppins",
                      },
                    },
                  },
                  {
                    Component: TextOnlyComponent,
                    data: {
                      text: "This is a sample mfin description",
                      customStyle: {
                        fontWeight: "400",
                        fontSize: "14px",
                        color: "#74828F",
                        fontFamily: "Poppins",
                      },
                    },
                  },
                ],
              ],
            },
            tableTitle: "Linked Compatiblity Tag Details",
            truncationLimit: 2,
            expandable: true,
            highlightOnHover: true,
          },
        },
        {
          Component: TextOnlyComponent,
          data: {
            text: "341",
            customStyle: {
              color: "#74828F",
              fontWeight: 400,
              fontSize: "14px",
            },
            highlightOnHover: true,
          },
        },
      ]);
    }

    const newData = { ...usageTrendsBreakdownData, body: processedData };
    setUsageTrendsBreakdownData(newData);
    dispatch(loaderActions.toggleLoader(false));
  };

  const preprocessBackendData = (data) => {
    var currentMonthTotalACUTemp = 0;
    var previousMonthTotalACUTemp = 0;
    var previousMonthTillDateACUTemp = 0;
    var trendsBreakdownDataTemp = {};
    const currentMonthDate = new Date();
    const tempMD = new Date();
    tempMD.setMonth(tempMD.getMonth() - 1);
    const previousMonthDate = tempMD;

    let timelines = {};
    for (let obj of data) {
      let readableDate =
        new Date(obj.timestamp).getMonth() +
        1 +
        "/" +
        new Date(obj.timestamp).getFullYear();

      if (!timelines.hasOwnProperty(readableDate)) {
        timelines[readableDate] = [];
      }

      if (!timelines[readableDate].includes(obj.timestamp)) {
        timelines[readableDate] = [...timelines[readableDate], obj.timestamp];
      }

      let timestamp = new Date(obj.timestamp);

      if (
        timestamp.getMonth() == currentMonthDate.getMonth() &&
        timestamp.getFullYear() == currentMonthDate.getFullYear()
      ) {
        currentMonthTotalACUTemp += obj.acuCount;
      }

      if (
        timestamp.getMonth() == previousMonthDate.getMonth() &&
        timestamp.getFullYear() == previousMonthDate.getFullYear()
      ) {
        previousMonthTotalACUTemp += obj.acuCount;
      }

      if (
        timestamp.getMonth() == previousMonthDate.getMonth() &&
        timestamp.getFullYear() == previousMonthDate.getFullYear() &&
        timestamp.getDate() <= currentMonthDate.getDate()
      ) {
        previousMonthTillDateACUTemp += obj.acuCount;
      }
    }

    for (let timeline in timelines) {
      timelines[timeline].reverse();
    }
    var trendsACUTemp = {};

    for (let obj of data) {
      let assetName = obj.assetId;
      let readableDate =
        new Date(obj.timestamp).getMonth() +
        1 +
        "/" +
        new Date(obj.timestamp).getFullYear();

      let timestamp = obj.timestamp;

      if (!trendsACUTemp.hasOwnProperty(readableDate)) {
        trendsACUTemp[readableDate] = {};
      }

      if (!trendsACUTemp[readableDate].hasOwnProperty(assetName)) {
        trendsACUTemp[readableDate] = {
          ...trendsACUTemp[readableDate],
          [assetName]: Array.from(
            { length: timelines[readableDate].length },
            () => -1
          ),
        };
      }
      let timestampIndex = timelines[readableDate].findIndex(
        (element) => element === timestamp
      );

      var valueArray = trendsACUTemp[readableDate][assetName];
      valueArray[timestampIndex] = obj.acuCount;
      trendsACUTemp[readableDate][assetName] = valueArray;

      if (!trendsBreakdownDataTemp.hasOwnProperty(readableDate)) {
        trendsBreakdownDataTemp[readableDate] = {};
      }

      if (!trendsBreakdownDataTemp[readableDate].hasOwnProperty(assetName)) {
        trendsBreakdownDataTemp[readableDate] = {
          ...trendsBreakdownDataTemp[readableDate],
          [assetName]: obj.acuCount,
        };
      } else {
        trendsBreakdownDataTemp[readableDate][assetName] =
          trendsBreakdownDataTemp[readableDate][assetName] + obj.acuCount;
      }
    }

    setCurrentMonthTotalACU(currentMonthTotalACUTemp.toFixed(2).toString());
    setPreviousMonthTotalACU(previousMonthTotalACUTemp.toFixed(2).toString());
    setPreviousMonthTillDateACU(
      previousMonthTillDateACUTemp.toFixed(2).toString()
    );
    setTrendsACU(trendsACUTemp);
    setSelectedMonth(Object.keys(trendsACUTemp)[0]);
    setTrendsTimeline(timelines);
    setTrendsBreakdown(trendsBreakdownDataTemp);
  };

  const fetchBillingData = async () => {
    const clientID = localStorage.getItem(CLIENT_ID);

    await axios
      .get(`${APP_BASE_DMS_URL}/dms/api/v2/metrics/clients/${clientID}/acu`, {
        headers: {
          AuthMethod: localStorage.getItem(AUTH_METHOD),
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: clientID,
          TokenId: localStorage.getItem(USER_EMAIL),
          CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
        },
      })
      .then((res) => {
        preprocessBackendData(res.data.acuMetrics);
      })
      .catch((e) => {});
  };

  useEffect(() => {
    proprocessTrendsBreakdownData([1, 2, 3, 4, 5]);
    fetchBillingData();
  }, []);

  return (
    <div className={`flexColumn adminPage`}>
      {Object.keys(trendsACU).length != 0 && (
        <div>
          <div className={`flexColumn adminPageHeader`}>
            <div className={`adminPageTitle`}>Billing Information</div>
            <div className={`adminPageSubtitle`}>
              Monitor Active Compute Units In Realtime
            </div>
          </div>
          <div className={`adminPageContent`}>
            <p className="pageHeaders">Usage At A Glance</p>
            <div className="glanceCardsRow">
              <div
                className="glanceCard"
                style={{ backgroundColor: getColorFromSeed("7").background }}
              >
                <p className="glanceCardTitle">{currentMonthTotalACU}</p>
                <p className="glanceCardSubTitle">
                  Total ACU incurred this month till date
                </p>
              </div>
              <div
                className="glanceCard"
                style={{ backgroundColor: getColorFromSeed("7").background }}
              >
                <p className="glanceCardTitle">{previousMonthTotalACU}</p>
                <p className="glanceCardSubTitle">Previous month ACU usage</p>
              </div>
              <div
                className="glanceCard"
                style={{ backgroundColor: getColorFromSeed("7").background }}
              >
                <p className="glanceCardTitle">{previousMonthTillDateACU}</p>
                <p className="glanceCardSubTitle">
                  ACU usage till date previous month
                </p>
              </div>
              <div
                className="glanceCard"
                style={{ backgroundColor: getColorFromSeed("7").background }}
              >
                <p className="glanceCardTitle">N/A</p>
                <p className="glanceCardSubTitle">
                  Projected ACU by the end of this month
                </p>
              </div>
            </div>

            <p className="pageHeaders">Usage Trends</p>
            <div className="graphBox">
              <div className="graphInfo">
                <div className="graphLegends">
                  <p className="pageSubHeaders">Legend</p>
                  <div className="graphLegend">
                    <div className="legendSolidLine"></div>
                    <p className="legendTitle">Usage Till Date</p>
                  </div>
                  <div className="graphLegend">
                    <div className="legendDottedLine"></div>
                    <p className="legendTitle">Projected Usage</p>
                  </div>
                </div>
                <div
                  className="monthPicker"
                  onClick={() => {
                    setShowMonthPicker(true);
                  }}
                >
                  <img
                    style={{ marginRight: "4px" }}
                    src={"/assets/icons/calendar.svg"}
                  ></img>
                  <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="legendPickerFont"
                    style={{
                      border: "none",
                      outline: "none",
                      background: "none",
                      appearance: "none",
                    }}
                  >
                    {Object.keys(trendsACU).map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <img
                    style={{ height: "8px" }}
                    className="centerVertically"
                    src={"/assets/icons/dropdownArrow.svg"}
                  ></img>
                </div>
              </div>
              <div className="usageTrendsGraph">
                {trendsACU.hasOwnProperty(selectedMonth) && (
                  <AnalyticsLineChart
                    trends={trendsACU[selectedMonth]}
                    trendsTimeline={trendsTimeline[selectedMonth]}
                    isACU={true}
                  ></AnalyticsLineChart>
                )}
              </div>
            </div>

            <p className="pageHeaders">Usage Trends Breakdown</p>
            <div className="graphBox">
              <div className="graphInfo">
                <div className="graphLegends">
                  <p className="pageSubHeaders">Legend</p>
                  <div className="graphLegend">
                    <div className="legendSolidLine"></div>
                    <p className="legendTitle">Model</p>
                  </div>
                  <div className="graphLegend">
                    <div className="legendSolidLine"></div>
                    <p className="legendTitle">Script</p>
                  </div>
                </div>
                <div
                  className="monthPicker"
                  onClick={() => {
                    setShowMonthPicker(true);
                  }}
                >
                  <img
                    style={{ marginRight: "4px" }}
                    src={"/assets/icons/calendar.svg"}
                  ></img>
                  <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="legendPickerFont"
                    style={{
                      border: "none",
                      outline: "none",
                      background: "none",
                      appearance: "none",
                    }}
                  >
                    {[
                      //   "Deployments",
                      "Models",
                      //   "Scripts",
                      //   "Compatiblity Tags",
                    ].map((options) => (
                      <option key={options} value={options}>
                        {options}
                      </option>
                    ))}
                  </select>
                  <img
                    style={{ height: "8px" }}
                    className="centerVertically"
                    src={"/assets/icons/dropdownArrow.svg"}
                  ></img>
                </div>
              </div>
              <div className="usageTrendsGraph">
                <StackedBarChart data={trendsBreakdown}></StackedBarChart>
              </div>
            </div>

            <div className={`tasksTableView flexColumn overflowAuto`}>
              <Table data={usageTrendsBreakdownData} />
            </div>
          </div>
          {/* <a
            className="externalLink"
            target="_blank"
            href="https://codeclock.in"
          >
            Please click here to perform advance queries.
          </a> */}
        </div>
      )}
    </div>
  );
}

export default BillingPage;
