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
  CLIENT_ID,
  COGNITO_USERNAME,
  DEFAULT_ANALYTICS,
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
import { DASHBOARD_PAGE_ROUTE } from "presentation/routes/route-paths";
import { useNavigate } from "react-router-dom";
import { DateRangePicker } from "react-date-range";

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
      { text: "Avg Active Devices Per Day" },
      { text: "ACU Incurred This Month ▼" },
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

  const subtractDays = (date, days) => {
    date.setDate(date.getDate() - days);
    return date;
  };

  const [interval, setInterval] = useState({
    startDate: subtractDays(new Date(), 7),
    endDate: new Date(),
    key: "selection",
  });

  const buildUsageTrendsBreakdownTable = async (
    currentMonthModelWiseBreakdown,
    totalAssetActiveDevices
  ) => {
    var processedData = [];
    var acuIncurred = [];

    var id = 0;
    for (let assetName in currentMonthModelWiseBreakdown) {
      acuIncurred.push(
        parseFloat(
          currentMonthModelWiseBreakdown[assetName]
            .reduce((acc, currentValue) => acc + currentValue, 0)
            .toFixed(2)
        )
      );

      processedData.push([
        {
          id: id++,
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

    const ascendingOrder = (a, b) => a - b;
    const descendingOrder = (a, b) => b - a;

    const sortedAcu = acuIncurred.slice().sort(descendingOrder);

    var sortedData = Array(sortedAcu.length).fill([]);

    for (var i = 0; i < sortedAcu.length; i++) {
      var oldIndex = acuIncurred.indexOf(sortedAcu[i]);
      var newIndex = i;
      sortedData[newIndex] = processedData[oldIndex];
    }

    const newData = { ...usageTrendsBreakdownData, body: sortedData };
    setUsageTrendsBreakdownData(newData);
  };

  const preprocessBackendData = (data, intervalData) => {
    var currentMonthTotalACUTemp = 0;
    var previousMonthTotalACUTemp = 0;
    var previousMonthTillDateACUTemp = 0;
    var acuThisMonth = 0;
    var trendsBreakdownDataTemp = {};
    const currentMonthDateObject = new Date();
    const tempMD = new Date();
    tempMD.setMonth(tempMD.getMonth() - 1);
    const previousMonthDateObject = tempMD;

    for (let obj of intervalData) {
      currentMonthTotalACUTemp += obj.acuCount;
    }

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
      let sevenDaysBackTimestamp = new Date();
      sevenDaysBackTimestamp.setDate(currentMonthDateObject.getDate() - 7);

      if (
        timestamp.getMonth() === currentMonthDateObject.getMonth() &&
        timestamp.getFullYear() === currentMonthDateObject.getFullYear() && timestamp > sevenDaysBackTimestamp
      ) {
        acuThisMonth += obj.acuCount;
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

    var daysElapsedThisMonth = new Date().getDate();

    setAllAssets(allAssetsTemp);
    setGlanceCardsData([
      currentMonthTotalACUTemp.toFixed(2).toString(),
      previousMonthTotalACUTemp.toFixed(2).toString(),
      previousMonthTillDateACUTemp.toFixed(2).toString(),
      ((acuThisMonth / 7) * 30).toFixed(2).toString(),
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

  const fetchIntervalBillignData = async () => {
    const clientID = localStorage.getItem(CLIENT_ID);
    const startDateTime = interval.startDate;
    const endDateTime = interval.endDate;

    const modifiedStartDateTime = new Date(startDateTime);
    const modifiedEndDateTime = new Date(endDateTime);

    modifiedStartDateTime.setHours(0);
    modifiedStartDateTime.setMinutes(0);
    modifiedStartDateTime.setSeconds(0);
    modifiedStartDateTime.setMilliseconds(0);

    modifiedEndDateTime.setHours(23);
    modifiedEndDateTime.setMinutes(59);
    modifiedEndDateTime.setSeconds(59);
    modifiedEndDateTime.setMilliseconds(999);

    console.log(modifiedStartDateTime, modifiedEndDateTime);
    console.log(
      modifiedStartDateTime.toISOString(),
      modifiedEndDateTime.toISOString()
    );

    return await axios
      .get(`${APP_BASE_DMS_URL}/dms/api/v2/metrics/clients/${clientID}/acu`, {
        headers: {
          AuthMethod: "Cognito",
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: clientID,
          TokenId: localStorage.getItem(USER_EMAIL),
          CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
        },
        params: {
          startTime: modifiedStartDateTime.toISOString(),
          endTime: modifiedEndDateTime.toISOString(),
        },
      })
      .then((res) => {
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
        return metrics;
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.message, {
          toastId: "errorToast",
        });
      });
  };

  const fetchBillingData = async () => {
    const clientID = localStorage.getItem(CLIENT_ID);

    await axios
      .get(`${APP_BASE_DMS_URL}/dms/api/v2/metrics/clients/${clientID}/acu`, {
        headers: {
          AuthMethod: "Cognito",
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: clientID,
          TokenId: localStorage.getItem(USER_EMAIL),
          CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
        },
      })
      .then(async (res) => {
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
        var metrics2 = await fetchIntervalBillignData();
        preprocessBackendData(metrics, metrics2);
        console.log(metrics);
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.message, {
          toastId: "errorToast",
        });
      });
  };

  useEffect(() => {
    fetchBillingData();
  }, [interval]);

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

            <GlanceCards
              interval={interval}
              setInterval={setInterval}
              glanceCardsData={glanceCardsData}
            ></GlanceCards>

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
              <Table
                clickableHeaderCallback={() => {
                  var temp = usageTrendsBreakdownData.body;
                  temp.reverse();
                  setUsageTrendsBreakdownData({
                    headers: usageTrendsBreakdownData.headers,
                    body: temp,
                  });
                }}
                clickableHeaderIndex={3}
                data={usageTrendsBreakdownData}
              />
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