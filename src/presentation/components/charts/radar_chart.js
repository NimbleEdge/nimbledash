import React, { memo, useEffect, useState } from "react";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

function AnalyticsRadarChart(props) {
  const trends = props.trends;
  const trendsKeys = Object.keys(trends);
  const [data, setData] = useState([]);

  useEffect(() => {
    var temp = [];
    var maxUsers = 0;

    trendsKeys.forEach((key) => {
      if (trends[key] > maxUsers) {
        maxUsers = trends[key];
      }
    });

    trendsKeys.forEach((key, index) => {
      console.log("trends", trends[key]);
      temp.push({
        subject: key,
        A: trends[key],
        fullMark: maxUsers,
      });
    });

    if (Object.keys(trends).length < 3) {
      temp.push({
        subject: "",
        A: 0,
        fullMark: maxUsers,
      });

      temp.push({
        subject: "...",
        A: 0,
        fullMark: maxUsers,
      });
    }

    setData(temp);
  }, [trends]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid />
        <PolarAngleAxis fontSize={"12.5px"} dataKey="subject" />
        <PolarRadiusAxis />
        <Radar
          name="Mike"
          dataKey="A"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.6}
        />

      </RadarChart>
    </ResponsiveContainer>
  );
}

export default memo(AnalyticsRadarChart);
