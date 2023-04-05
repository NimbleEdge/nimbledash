/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to define all the paths.
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

/* Constants */
const ROOT_PATH = '/';
const ROOT_ADMIN_DASHBOARD = 'admin-dashboard';

/* Home Page */
export { ROOT_PATH };

/* Root Pages */
export const PAGE_ROOT = {
  signIn: {
    relativePath: 'signin',
    absolutePath: '/signin'
  }
};

/* Admin Dashboard Pages */
export const PAGE_ADMIN_DASHBOARD = {
  root: {
    relativePath: ROOT_ADMIN_DASHBOARD,
    absolutePath: `/${ROOT_ADMIN_DASHBOARD}`
  }
};
