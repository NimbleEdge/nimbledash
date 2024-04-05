import { GRAPH_COLORS, getColorFromSeed } from "core/constants";
import React, { PureComponent, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function StackedBarChart(props) {
  const [data, setData] = useState([]);
  const [assetKeys, setAssetKeys] = useState([]);

  useEffect(() => {
    var dataTemp = [];
    var assetKeysTemp = [];
    console.log("gay", props.data);
    for (let name in props.data) {
      dataTemp.push({
        name: name,
        ...props.data[name],
      });

      assetKeysTemp = [...assetKeysTemp, ...Object.keys(props.data[name])];
    }

    assetKeysTemp = assetKeysTemp.filter(
      (value, index, self) => self.indexOf(value) === index
    );

    dataTemp.reverse();

    setAssetKeys(assetKeysTemp);
    setData(dataTemp);

    console.log(assetKeysTemp, dataTemp);
  }, []);

  return (
    <ResponsiveContainer debounce={300} width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 64,
          right: 72,
          left: 60,
          bottom: 64,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        {/* <Legend /> */}

        {assetKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            stackId="a"
            fill={GRAPH_COLORS[index % 10]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
