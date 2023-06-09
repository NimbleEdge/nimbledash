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
    // trends['test_model'] = Array.from({length: 30}, () => Math.floor(Math.random() * 40000));

    var tempData = [];
    var modelKeys = Object.keys(trends);
    var maxLen = -1;

    //calculate max length
    modelKeys.forEach((key) => {
      if (trends[key].length > maxLen) maxLen = trends[key].length;
    });

    //add 0 to the shorter arrays
    modelKeys.forEach((modelName)=>{
      var modelArray = trends[modelName];
      modelArray.reverse();
      trends[modelName] = Array.from({length: maxLen-modelArray.length}, () => 0).concat(modelArray);
    });

    //transform data
    for (var index = 0; index < maxLen; index++) {
      var tempMap = {};
      modelKeys.forEach((modelName) => {
        tempMap[modelName] = trends[modelName][index];
      });
      tempMap["unit"] = "millis";
      tempData.push(tempMap);
    }

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
