/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create styles for dashboard components.
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
import { Theme } from '@mui/material/styles';

/* Relative Imports */
import { fonts } from 'theme/typography';

// ----------------------------------------------------------------------

export default {
  card: (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    p: 5,
    minHeight: 200
  }),
  CardTitleBox: {
    display: 'flex',
    alignItems: 'center'
  },
  apiCallCardItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  costCard: (theme: Theme) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    p: 3
  }),
  title: {
    fontFamily: fonts.Mulish_Medium
  }
};
