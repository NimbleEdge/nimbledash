/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create average latency component of dashboard.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 31/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Card, Grid, Typography, useTheme } from '@mui/material';

/* Relative Imports */
import { fNumber } from 'utility/formatNumber';
import { APIData } from 'models';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface.
 *
 * @interface Props
 * @property {APIData} data
 */
export interface Props {
  data: APIData;
}
// ----------------------------------------------------------------------

/**
 * Component to create latency graph with average latency card.
 *
 * @component
 * @param {APIData} data - api data metrics of cloud & edge
 * @returns {JSX.Element}
 */
const AverageLatency = ({ data }: Props): JSX.Element => {
  const theme = useTheme();
  const CHART_DATA = [
    { name: 'Cloud', data: data.cloud_mets.slice(-20).map((x) => x.uTime) },
    { name: 'Edge', data: data.edge_mets.slice(-20).map((x) => x.uTime) }
  ];
  const chartOptions: ApexOptions = {
    chart: {
      foreColor: theme.palette.text.disabled,
      fontFamily: theme.typography.fontFamily,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    grid: {
      show: false
    },
    markers: { size: 6 },
    dataLabels: { enabled: false },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { show: false },
      tooltip: { enabled: false }
    },
    yaxis: {
      axisBorder: { show: true },
      axisTicks: { show: true },
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: theme.typography.fontFamily
        },
        formatter(val: number): string {
          return `${val} \u03BCs`;
        }
      }
    },
    legend: {
      show: true,
      fontSize: '16px',
      position: 'top',
      horizontalAlign: 'right',
      markers: { radius: 12 },
      itemMargin: { horizontal: 16 },
      labels: {
        colors: theme.palette.text.primary
      }
    },
    tooltip: {
      marker: { show: true },
      x: { show: false },
      y: {
        formatter(val: number): string {
          return val ? `${val} \u03BCs` : '';
        }
      },
      style: {
        fontSize: '16px',
        fontFamily: theme.typography.fontFamily
      }
    }
  };

  /* Output */
  return (
    <Card sx={styles.card}>
      <Grid container spacing={3} mb={8}>
        <Grid item xs={12} sm={4} sx={styles.apiCallCardItem}>
          <Typography variant="h2">Latency</Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <ReactApexChart
            type="line"
            series={CHART_DATA}
            options={chartOptions}
            width="98%"
            height={300}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} sx={styles.apiCallCardItem}>
          <Typography variant="h2">Average</Typography>
        </Grid>
        <Grid item xs={12} sm={4} sx={styles.apiCallCardItem}>
          <Typography variant="h2" gutterBottom>
            {fNumber(data.cloud_avg)} &#181;s
          </Typography>
          <Typography variant="h4" sx={styles.title}>
            Cloud
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} sx={styles.apiCallCardItem}>
          <Typography variant="h2" gutterBottom>
            {fNumber(data.edge_avg)} &#181;s
          </Typography>
          <Typography variant="h4" sx={styles.title}>
            Edge
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default AverageLatency;
