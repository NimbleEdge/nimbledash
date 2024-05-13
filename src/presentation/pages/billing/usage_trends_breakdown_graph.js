import { GRAPH_COLORS, getColorFromSeed } from "core/constants";
import AnalyticsLineChart from "presentation/components/charts/line_chart";
import StackedBarChart from "presentation/components/charts/stacked_bar_chart";
import React from "react";

export default function UsageTrendsBreakDownGraph(props) {
  var trendsBreakdown = props.trendsBreakdown;
  var allAssets = props.allAssets;

  console.log(trendsBreakdown);

  Object.keys(trendsBreakdown).forEach(month => {
    Object.keys(trendsBreakdown[month]).forEach(key => {
      trendsBreakdown[month][key] = parseFloat(trendsBreakdown[month][key].toFixed(2));
    });
});

  console.log(trendsBreakdown);

  return (
    <div className="graphBox">
      <div className="graphInfo">
        <div className="graphLegends">
          <p className="pageSubHeaders">Legend</p>
          {allAssets.map((key, index) => (
            <div className="graphLegend">
              <div
                className="legendSolidLine"
                style={{
                  backgroundColor: GRAPH_COLORS[index % 10],
                }}
              ></div>
              <p className="legendTitle">{key}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="usageTrendsGraph">
        <StackedBarChart data={trendsBreakdown}></StackedBarChart>
      </div>
    </div>
  );
}
