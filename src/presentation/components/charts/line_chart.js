import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { STROKE_COLORS_LIST } from "core/constants";

function AnalyticsLineChart(props) {
  const trends = props.trends;
  const [data, setData] = useState([]);

  useEffect(() => {
    var tempData = [];
    var modelKeys = Object.keys(trends);
    var maxLen = -1;

    modelKeys.forEach((key) => {
      if (trends[key].length > maxLen) maxLen = trends[key].length;
    });

    for (var index = 0; index < maxLen; index++) {
      var tempMap = {};
      modelKeys.forEach((key) => {
        var trendList = trends[key];
        if (trendList.length - 1 - index >= 0) {
          tempMap[key] = trendList[trendList.length - 1 - index]/1000;
        } else {
          tempMap[key] = 0;
        }
      });
      tempMap["unit"] = "millis";
      tempData.push(tempMap);
    }

    console.log(tempData);
    setData(tempData);
  }, [trends]);

  return (
    <ResponsiveContainer debounce={300} width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 64,
          right: 72,
          left: 20,
          bottom: 64,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis dataKey="name" />
        <YAxis unit=" millls" width={100} />
        <Tooltip />
        <Legend />
          {Object.keys(trends).map((key, index) => (
            <Line
              type="monotone"
              dataKey={key}
              stroke={STROKE_COLORS_LIST[index % STROKE_COLORS_LIST.length]}
              strokeWidth={3}
              activeDot={{ r: 4 }}
              dot = {false}
            />
          ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default AnalyticsLineChart;
