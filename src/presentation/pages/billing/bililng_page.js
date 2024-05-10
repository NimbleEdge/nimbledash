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
  ACCENT_COLOR,
  ACCESS_TOKEN,
  APP_BASE_DMS_URL,
  AUTH_METHOD,
  CLIENT_ID,
  COGNITO_USERNAME,
  DEFAULT_ANALYTICS,
  FORM_PASSWORD,
  FORM_USERNAME,
  GRAPH_COLORS,
  USER_EMAIL,
  getColorFromSeed,
} from "core/constants";
import StackedBarChart from "presentation/components/charts/stacked_bar_chart";
import axios from "axios";
import { InfinitySpin } from "react-loader-spinner";
import { toast } from "react-toastify";
import GlanceCards from "./glance_cards";
import UsageTrendsGraph from "./usage_trends_graph";
import UsageTrendsBreakDownGraph from "./usage_trends_breakdown_graph";
import { getRequest } from "data/remote_datasource";

function BillingPage() {
  const dispatch = useDispatch();
  const [selectedMonth, setSelectedMonth] = useState("");
  const [trendsACU, setTrendsACU] = useState({});
  const [trendsTimeline, setTrendsTimeline] = useState({});
  const [trendsBreakdown, setTrendsBreakdown] = useState({});
  const [allAssets, setAllAssets] = useState([]);
  const [usageTrendsBreakdownData, setUsageTrendsBreakdownData] = useState({
    headers: [
      { text: "Name" },
      { text: "Version" },
      { text: "Avg Active Devices This Month" },
      { text: "ACU Incurred This Month" },
    ],
    body: [],
  });
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const [glanceCardsData, setGlanceCardsData] = useState([
    "N/A",
    "N/A",
    "N/A",
    "N/A",
  ]);

  const buildUsageTrendsBreakdownTable = async (
    currentMonthModelWiseBreakdown,
    totalAssetActiveDevices
  ) => {
    var processedData = [];

    for (let assetName in currentMonthModelWiseBreakdown) {
      processedData.push([
        {
          Component: TextOnlyComponent,
          data: {
            text: assetName.split(" ")[0],
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
            text: assetName.split(" ")[1],
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
            tags: [totalAssetActiveDevices[assetName].toString()],
            tableData: {},
            tableTitle: "Linked Models Detail",
            truncationLimit: 2,
            expandable: false,
            highlightOnHover: true,
          },
        },
        {
          Component: TextOnlyComponent,
          data: {
            text: currentMonthModelWiseBreakdown[assetName]
              .reduce((acc, currentValue) => acc + currentValue, 0)
              .toFixed(2),
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
  };

  const preprocessBackendData = (data) => {
    var currentMonthTotalACUTemp = 0;
    var previousMonthTotalACUTemp = 0;
    var previousMonthTillDateACUTemp = 0;
    var trendsBreakdownDataTemp = {};
    const currentMonthDateObject = new Date();
    const tempMD = new Date();
    tempMD.setMonth(tempMD.getMonth() - 1);
    const previousMonthDateObject = tempMD;

    let timelines = {};
    for (let obj of data) {
      let readableDate =
        new Date(obj.timestamp).getMonth() +
        1 +
        "/" +
        new Date(obj.timestamp).getFullYear();

      timelines[readableDate] = timelines[readableDate] || [];
      if (!timelines[readableDate].includes(obj.timestamp)) {
        timelines[readableDate].push(obj.timestamp);
      }

      let timestamp = new Date(obj.timestamp);

      if (
        timestamp.getMonth() === currentMonthDateObject.getMonth() &&
        timestamp.getFullYear() === currentMonthDateObject.getFullYear()
      ) {
        currentMonthTotalACUTemp += obj.acuCount;
      }

      if (
        timestamp.getMonth() === previousMonthDateObject.getMonth() &&
        timestamp.getFullYear() === previousMonthDateObject.getFullYear()
      ) {
        previousMonthTotalACUTemp += obj.acuCount;

        if (timestamp.getDate() <= currentMonthDateObject.getDate()) {
          previousMonthTillDateACUTemp += obj.acuCount;
        }
      }
    }

    var trendsACUTemp = {};
    var allAssetsTemp = [];
    var totalActiveDevicesTemp = {};
    for (let obj of data) {
      let assetName = `${obj.assetId} v${obj.assetVersion}`;

      if (!allAssetsTemp.includes(assetName)) {
        allAssetsTemp.push(assetName);
      }

      if (
        currentMonthDateObject.getMonth() ===
        new Date(obj.timestamp).getMonth() &&
        currentMonthDateObject.getFullYear() ===
        new Date(obj.timestamp).getFullYear()
      ) {
        if (totalActiveDevicesTemp.hasOwnProperty(assetName)) {
          totalActiveDevicesTemp[assetName] = [
            ...totalActiveDevicesTemp[assetName],
            obj.numDevices,
          ];
        } else {
          totalActiveDevicesTemp = {
            ...totalActiveDevicesTemp,
            [assetName]: [obj.numDevices],
          };
        }
      }

      let readableDate = `${new Date(obj.timestamp).getMonth() + 1}/${new Date(
        obj.timestamp
      ).getFullYear()}`;

      trendsACUTemp[readableDate] = trendsACUTemp[readableDate] || {};

      trendsACUTemp[readableDate][assetName] =
        trendsACUTemp[readableDate][assetName] ||
        Array.from({ length: timelines[readableDate].length }, () => 0);

      let timestampIndex = timelines[readableDate].findIndex(
        (element) => element === obj.timestamp
      );
      trendsACUTemp[readableDate][assetName][timestampIndex] = obj.acuCount;

      trendsBreakdownDataTemp[readableDate] =
        trendsBreakdownDataTemp[readableDate] || {};
      trendsBreakdownDataTemp[readableDate][assetName] =
        (trendsBreakdownDataTemp[readableDate][assetName] || 0) + obj.acuCount;
    }

    setAllAssets(allAssetsTemp);
    setGlanceCardsData([
      currentMonthTotalACUTemp.toFixed(2).toString(),
      previousMonthTotalACUTemp.toFixed(2).toString(),
      previousMonthTillDateACUTemp.toFixed(2).toString(),
      "N/A",
    ]);
    setTrendsACU(trendsACUTemp);
    setSelectedMonth(Object.keys(trendsACUTemp)[0]);
    setTrendsTimeline(timelines);
    setTrendsBreakdown(trendsBreakdownDataTemp);

    for (let assetName in totalActiveDevicesTemp) {
      let arr = totalActiveDevicesTemp[assetName];
      let average = Math.floor(
        arr.reduce((acc, val) => acc + val, 0) / arr.length
      );

      totalActiveDevicesTemp[assetName] = average;
    }

    buildUsageTrendsBreakdownTable(
      trendsACUTemp[Object.keys(trendsACUTemp)[0]],
      totalActiveDevicesTemp
    );
  };

  const fetchBillingData = async () => {
    const clientID = localStorage.getItem(CLIENT_ID);

    var res = await getRequest(APP_BASE_DMS_URL, `/dms/api/v2/metrics/clients/${clientID}/acu`);

    if (res != null) {
      var metrics = res.data.acuMetrics;
      if (metrics.length == 0) {
        metrics = [
          {
            assetId: "none",
            assetVersion: "1.0.0",
            assetType: "model",
            acuCount: 0,
            numDevices: 0,
            deploymentId: 0,
            timestamp: "1970-01-01T00:00:00Z",
          },
        ];
      }
      metrics.reverse();
      preprocessBackendData(metrics);
      console.log(metrics);
      dispatch(loaderActions.toggleLoader(false));
    }}

    useEffect(() => {
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

              <GlanceCards glanceCardsData={glanceCardsData}></GlanceCards>

              <p className="pageHeaders">Usage Trends</p>

              <UsageTrendsGraph
                trendsACU={trendsACU}
                selectedMonth={selectedMonth}
                trendsTimeline={trendsTimeline}
                handleMonthChange={handleMonthChange}
              ></UsageTrendsGraph>

              <p className="pageHeaders">Usage Trends Breakdown</p>
              <UsageTrendsBreakDownGraph
                trendsBreakdown={trendsBreakdown}
                allAssets={allAssets}
              ></UsageTrendsBreakDownGraph>

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
