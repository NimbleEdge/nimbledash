import React, { PureComponent, useEffect, useState } from "react";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

// const data = [
//   { name: "Model 1", value: 400 },
//   { name: "Model 2", value: 300 },
//   { name: "Model 3", value: 300 },
//   { name: "Model 4", value: 200 },
// ];

const COLORS = ["#0D2535", "#5388D8", "#F4BE37", "#FF9F40"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function AnalyticsPieChart(props) {
  const trends = props.trends;
  const trendsKeys = Object.keys(trends);
  const [data, setData] = useState([]);

  useEffect(() => {
    var temp = [];
    trendsKeys.forEach((key) => {
      temp.push({ name: key, value: trends[key] });
    });

    setData(temp);
  }, [trends]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <div className="center-chart">
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>

        <div className="pie-chart-legend">
          {data.map((item, index) => (
            <div className="sub-chart-legend">
              <div className="legend-row">
                <div
                  className="legend-color"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <p className="legend-title subHeading2">{item.name}</p>
              </div>
              <p className="legend-value subHeading2">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </ResponsiveContainer>
  );
}
