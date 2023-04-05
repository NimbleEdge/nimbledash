/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create styles for auth pages/components.
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

/**
 * Style object for auth pages/components
 *
 * @returns {object}
 */
export default {
  rootStyle: (theme: any) => ({
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3, 0),
    borderRadius: `${theme.shape.borderRadius}px`,
    boxShadow: theme.customShadows.z8
  })
};
