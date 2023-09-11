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

function AnalyticsLineChartSingle(props) {
  const trends = props.trends;
  const [data, setData] = useState([]);

  useEffect(() => {
    var tempData = [];
    Object.keys(trends).map((key,index)=>{
        tempData.push({
            name:(new Date(key)).toLocaleString().substring(0,10),
            DAU:trends[key]
        })
    });

    setData(tempData);
  }, [trends]);

  return (
    <ResponsiveContainer width="100%" height="100%">
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
          <XAxis dataKey="name" dy={20}/>
          <YAxis />
          <Tooltip />
          {/* <Legend /> */}
          <Line type="monotone" dataKey="DAU" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 4 }} dot={false} />
        </LineChart>
      </ResponsiveContainer>
  );
}

export default AnalyticsLineChartSingle;
