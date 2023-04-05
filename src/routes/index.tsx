/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create routing from all the routes.
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
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

/* Relative Imports */
import LoadingScreen from 'components/LoadingScreen';

/* Local Imports */
import RootRoutes from './rootRoutes';
import AdminDashboardRoutes from './adminDashboardRoutes';

// ----------------------------------------------------------------------

/* Merge Routes */
const routes = [...RootRoutes, ...AdminDashboardRoutes];

/**
 * Create routing with the routes
 *
 * @return {JSX.Element}
 */
const Routing: React.FC = (): JSX.Element => {
  const content = useRoutes(routes);
  return <Suspense fallback={<LoadingScreen />}>{content}</Suspense>;
};

export default Routing;
