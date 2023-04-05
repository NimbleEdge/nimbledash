/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create styles for loading screen component.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 30/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { alpha } from '@mui/material';
import { Theme } from '@mui/material/styles';

export default {
  rootStyle: (theme: Theme) => ({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.background.default,
    position: 'relative',
    zIndex: 1
  }),
  logo: {
    width: 64,
    height: 64
  },
  outerBox: (theme: Theme) => ({
    width: 120,
    height: 120,
    borderRadius: '25%',
    position: 'absolute',
    border: `8px solid ${alpha(theme.palette.primary.dark, 0.24)}`
  }),
  innerBox: (theme: Theme) => ({
    width: 100,
    height: 100,
    borderRadius: '25%',
    position: 'absolute',
    border: `3px solid ${alpha(theme.palette.primary.dark, 0.24)}`
  })
};
