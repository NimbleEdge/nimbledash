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
  var trends = props.trends;
  var trendsTimeline = props.trendsTimeline;
  var isACU = props.isACU;
  const [data, setData] = useState([]);

  useEffect(() => {
    // trends['test_model'] = Array.from({length: 30}, () => Math.floor(Math.random() * 40000));
    var tempData = [];
    var modelKeys = Object.keys(trends);
    var size = trends[Object.keys(trends)[0]].length;

    for (var index = 0; index < size; index++) {
      var tempMap = {};
      modelKeys.forEach((modelName) => {
        var value = trends[modelName][size - index - 1];
        if (value == -1) {
          value = null;
        } else if (isACU) {
          value = parseFloat(value.toFixed(2));
        } else {
          value = parseFloat((value / 1000).toFixed(2));
        }
        value = tempMap[modelName] = value;
      });
      tempMap["name"] = new Date(trendsTimeline[size - index - 1])
        .toLocaleString()
        .substring(0, 10);
      if (isACU) {
        tempMap["unit"] = "ACU";
      } else {
        tempMap["unit"] = "ms";
      }
      tempData.push(tempMap);
    }

    setData(tempData);
  }, [trends]);

  const getUnit = () => {
    if (isACU) return " ACU";
    else return " ms";
  };

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
        <XAxis dataKey="name" dy={20} tick={{ fontSize: 12 }} />
        <YAxis unit={getUnit()} width={100} tick={{ fontSize: 12 }} />
        <Tooltip />
        {/* <Legend dy={20}/> */}
        {Object.keys(trends).map((key, index) => (
          <Line
            type="monotone"
            connectNulls
            dataKey={key}
            stroke={STROKE_COLORS_LIST[index % STROKE_COLORS_LIST.length]}
            strokeWidth={3}
            activeDot={{ r: 4 }}
            dot={false}
            key={index}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default AnalyticsLineChart;
