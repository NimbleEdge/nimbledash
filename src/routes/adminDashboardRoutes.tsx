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
import { Outlet } from 'react-router-dom';

/* Relative Imports */
import AdminDashboardLayout from 'layout/AdminDashboardLayout';

/* Local Imports */
import { PAGE_ADMIN_DASHBOARD } from './paths';
import AuthGuard from './guards/AuthGuard';

// ----------------------------------------------------------------------

/* Admin Dashboard Module Imports */
const IndexPage = lazy(() => import('views/admin-dashboard'));

// ----------------------------------------------------------------------

/**
 * assign components to routes
 *
 * @return {array}
 */
const AdminDashboardRoutes: Array<object> = [
  {
    path: PAGE_ADMIN_DASHBOARD.root.relativePath,
    element: (
      <AuthGuard>
        <AdminDashboardLayout>
          <Outlet />
        </AdminDashboardLayout>
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <IndexPage />
      }
    ]
  }
];

export default AdminDashboardRoutes;
