import { getColorFromSeed } from "core/constants";
import AnalyticsLineChart from "presentation/components/charts/line_chart";
import React from "react";

export default function UsageTrendsGraph(props) {
  var selectedMonth = props.selectedMonth;
  var handleMonthChange = props.handleMonthChange;
  var trendsACU = props.trendsACU;
  var trendsTimeline = props.trendsTimeline;

  return (
    <div className="graphBox">
      <div className="graphInfo">
        <div className="graphLegends">
          <p className="pageSubHeaders">Legend</p>
          <div className="graphLegend">
            <div className="legendSolidLine"></div>
            <p className="legendTitle">Usage Till Date</p>
          </div>
          {/* <div className="graphLegend">
            <div className="legendDottedLine"></div>
            <p className="legendTitle">Projected Usage</p>
          </div> */}
        </div>
        <div className="monthPicker">
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
  );
}
