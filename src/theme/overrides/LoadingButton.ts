/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description LoadingButton component to override default Mui LoadingButton's style.
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

/**
 * LoadingButton contains the styles to override default Mui LoadingButton and it's children's styles.
 *
 * @component
 * @returns Add-on styles for MuiLoadingButton
 */
export default function LoadingButton(): any {
  /* Output */
  return {
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-text': {
            '& .MuiLoadingButton-startIconPendingStart': {
              marginLeft: 0
            },
            '& .MuiLoadingButton-endIconPendingEnd': {
              marginRight: 0
            }
          }
        }
      }
    }
  };
}
