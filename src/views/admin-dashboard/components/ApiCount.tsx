/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create api count component of dashboard.
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
import { Card, Grid, Typography } from '@mui/material';

/* Relative Imports */
import { fNumber } from 'utility/formatNumber';

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
 * Component to create api count card.
 *
 * @component
 * @param {number} cloudCount - api call count to cloud
 * @param {number} edgeCount - api call count to edge
 * @returns {JSX.Element}
 */
const ApiCount = ({ cloudCount, edgeCount }: Props): JSX.Element => {
  /* Output */
  return (
    <Card sx={styles.card}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4} sx={styles.apiCallCardItem}>
          <Typography variant="h2">API Calls</Typography>
        </Grid>
        <Grid item xs={12} sm={4} sx={styles.apiCallCardItem}>
          <Typography variant="h2" gutterBottom>
            {fNumber(cloudCount)}
          </Typography>
          <Typography variant="h4" sx={styles.title}>
            Cloud
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} sx={styles.apiCallCardItem}>
          <Typography variant="h2" gutterBottom>
            {fNumber(edgeCount)}
          </Typography>
          <Typography variant="h4" sx={styles.title}>
            Edge
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ApiCount;
