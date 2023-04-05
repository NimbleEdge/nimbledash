/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to define the root routes.
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
import { lazy } from 'react';

/* Relative Imports */
import AuthLayout from 'layout/AuthLayout';

/* Local Imports */
import { PAGE_ROOT, ROOT_PATH } from './paths';
import UserGuard from './guards/UserGuard';

// ----------------------------------------------------------------------

/* Auth Module Imports */
const SignInPage = lazy(() => import('views/auth/SignIn'));

// ----------------------------------------------------------------------

/**
 * assign components to routes
 *
 * @return {array}
 */
const RootRoutes: Array<object> = [
  {
    path: ROOT_PATH,
    element: (
      <UserGuard>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </UserGuard>
    )
  },
  {
    path: PAGE_ROOT.signIn.relativePath,
    element: (
      <UserGuard>
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </UserGuard>
    )
  }
];

export default RootRoutes;
