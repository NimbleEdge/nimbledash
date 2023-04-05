/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Paper component to override default Mui Paper's style.
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
 * Paper contains the styles to override default Mui Paper and it's children's styles.
 *
 * @component
 * @returns Add-on styles for MuiPaper
 */
export default function Paper(): any {
  /* Output */
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0
      },

      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    }
  };
}
