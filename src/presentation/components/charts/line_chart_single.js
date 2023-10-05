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
  BarChart,
  Bar,
} from "recharts";
import { useState, useEffect } from "react";
import { STROKE_COLORS_LIST } from "core/constants";

function AnalyticsLineChartSingle(props) {
  const trends = props.trends;
  const [data, setData] = useState([]);

  useEffect(() => {
    var tempData = [];
    Object.keys(trends).map((key, index) => {
      tempData.push({
        name: new Date(key).toLocaleString().substring(0, 10),
        DAU: trends[key],
      });
    });

    setData(tempData);
  }, [trends]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        width={500}
        height={300}
        margin={{
          top: 64,
          right: 72,
          left: 20,
          bottom: 64,
        }}
      >
        <XAxis dataKey="name" dy={20} />
        <YAxis />
        <Tooltip />
        <XAxis dataKey="name" dy={20} />
        <Bar dataKey="DAU" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default AnalyticsLineChartSingle;

