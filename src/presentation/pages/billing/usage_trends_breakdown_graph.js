import { GRAPH_COLORS, getColorFromSeed } from "core/constants";
import AnalyticsLineChart from "presentation/components/charts/line_chart";
import StackedBarChart from "presentation/components/charts/stacked_bar_chart";
import React from "react";

export default function UsageTrendsBreakDownGraph(props) {
  var trendsBreakdown = props.trendsBreakdown;
  var allAssets = props.allAssets;

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
              <p title={key} className="legendTitle">{key}</p>
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
