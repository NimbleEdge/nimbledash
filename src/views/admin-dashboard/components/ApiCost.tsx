/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create api cost component of dashboard.
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
import { fCurrency } from 'utility/formatNumber';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface.
 *
 * @interface Props
 * @property {number} cloudCount
 * @property {number} edgeCount
 */
export interface Props {
  cloudCount: number;
  edgeCount: number;
}
// ----------------------------------------------------------------------

/**
 * Component to create api cost card with graph.
 *
 * @component
 * @param {number} cloudCount - api call count to cloud
 * @param {number} edgeCount - api call count to edge
 * @returns {JSX.Element}
 */
const ApiCost = ({ cloudCount = 0, edgeCount = 0 }: Props): JSX.Element => {
  const theme = useTheme();
  const cloudCost = (1.34 * cloudCount) / 100;
  const edgeCost = (0.6 * 1.34 * edgeCount) / 100;

  const CHART_DATA = [{ name: '', data: [cloudCost, edgeCost] }];
  const chartOptions: ApexOptions = {
    chart: {
      foreColor: theme.palette.text.disabled,
      fontFamily: theme.typography.fontFamily,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    plotOptions: {
      bar: {
        barHeight: '40%',
        distributed: true,
        borderRadius: 4,
        horizontal: true
      }
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter(value: string): string {
        return fCurrency(Number(value || 0));
      },
      style: {
        fontSize: '14px',
        fontWeight: theme.typography.fontWeightBold,
        fontFamily: theme.typography.fontFamily,
        colors: [theme.palette.common.white]
      }
    },
    xaxis: {
      categories: ['Cloud', 'Edge'],
      axisBorder: { show: true },
      axisTicks: { show: true },
      labels: {
        style: {
          fontSize: '12px',
          fontFamily: theme.typography.fontFamily
        },
        offsetY: 2,
        formatter(value: string): string {
          return fCurrency(Number(value || 0));
        }
      }
    },
    yaxis: {
      axisBorder: { show: true },
      axisTicks: { show: false },
      labels: {
        padding: 4,
        style: {
          fontSize: '14px',
          fontWeight: theme.typography.fontWeightBold,
          fontFamily: theme.typography.fontFamily
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
      style: {
        fontSize: '14px',
        fontFamily: theme.typography.fontFamily
      },
      marker: { show: false },
      y: {
        title: {
          formatter(): string {
            return '';
          }
        },
        formatter(val: number): string {
          return fCurrency(val || 0);
        }
      }
    }
  };

  /* Output */
  return (
    <Card sx={styles.card}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} sx={styles.apiCallCardItem}>
          <Typography variant="h2">Cost</Typography>
          <Typography variant="body1" color="text.secondary">
            *2M MAU
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8}>
          <ReactApexChart
            type="bar"
            series={CHART_DATA}
            options={chartOptions}
            width="98%"
            height={300}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default ApiCost;
