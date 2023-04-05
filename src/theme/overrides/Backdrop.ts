/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Backdrop component to override default Mui Backdrop's style.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 29/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { alpha, Theme } from '@mui/material';

// ----------------------------------------------------------------------

/**
 * Backdrop contains the styles to override default Mui Backdrop and it's children's styles.
 *
 * @component
 * @param theme - global theme object to provide colors, fonts, spacing, shadows etc.
 * @returns Add-on styles for MuiBackdrop
 */
export default function Backdrop(theme: Theme): any {
  /* Output */
  return {
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(theme.palette.common.black, 0.8),
          '&.MuiBackdrop-invisible': {
            background: 'transparent'
          }
        }
      }
    }
  };
}
