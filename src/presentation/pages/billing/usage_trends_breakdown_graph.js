import { GRAPH_COLORS, getColorFromSeed } from "core/constants";
import AnalyticsLineChart from "presentation/components/charts/line_chart";
import StackedBarChart from "presentation/components/charts/stacked_bar_chart";
import React from "react";

export default function UsageTrendsBreakDownGraph(props) {
  var trendsBreakdown = props.trendsBreakdown;
  var allAssets = props.allAssets;

  Object.keys(trendsBreakdown).forEach(month => {
    Object.keys(trendsBreakdown[month]).forEach(key => {
      trendsBreakdown[month][key] = parseFloat(trendsBreakdown[month][key].toFixed(2));
    });
  });

  var updatedMap = {};
  var legendSet = new Set();

  for (var month in trendsBreakdown) {
    var map = trendsBreakdown[month];

    var keyList = Object.keys(map);

    for (var key of keyList) {

      if (map[key] < 1) {
        delete map[key];
      }
      else {
        legendSet.add(key);
      }
    }

    updatedMap[month] = map;
  }

  return (
    <div className="graphBox">
      <div className="graphInfo">
        <div className="graphLegends">
          <p className="pageSubHeaders">Legend</p>
          {Array.from(legendSet).map((key, index) => (
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
        <StackedBarChart data={updatedMap}></StackedBarChart>
      </div>
    </div>
  );
}
