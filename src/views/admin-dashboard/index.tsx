/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Admin dashboard Root Page.
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
import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';

/* Relative Imports */
import { AdminDashboardPage } from 'components/Page';
import Loader from 'components/Loader';
import useSnackbarClose from 'hooks/useSnackbarClose';
import { APIData } from 'models';
import { getMetricsData } from 'services';

/* Local Imports */
import { ApiCost, ApiCount, AverageLatency } from './components';

// ----------------------------------------------------------------------

/**
 * Component to create the admin dashboard root page.
 *
 * @component
 * @returns {JSX.Element}
 */
const Dashboard = (): JSX.Element => {
  /* Hooks */
  const { showSnackbar } = useSnackbarClose();
  /* States */
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<APIData>();
  const [intervalId, setIntervalId] = useState<any>();

  const getDataFromApi = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getMetricsData();
      if (response) {
        setData(response as APIData);
      } else {
        showSnackbar('Something went wrong.', 'error');
      }
    } catch {
      showSnackbar('Something went wrong.', 'error');
    }
    setLoading(false);
  };

  /* Side-Effects */
  useEffect(() => {
    getDataFromApi();
    setIntervalId(
      setInterval(() => {
        getDataFromApi();
      }, 10000)
    );
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  /* Output */
  return (
    <AdminDashboardPage>
      {!loading && data ? (
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <ApiCount
              cloudCount={data.cloud_count}
              edgeCount={data.edge_count}
            />
          </Grid>
          <Grid item xs={12}>
            <ApiCost
              cloudCount={data.cloud_count}
              edgeCount={data.edge_count}
            />
          </Grid>
          <Grid item xs={12}>
            <AverageLatency data={data} />
          </Grid>
        </Grid>
      ) : (
        <Loader />
      )}
    </AdminDashboardPage>
  );
};

export default Dashboard;
