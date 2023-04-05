/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create user guard.
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
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/* Relative Imports */
import { PAGE_ADMIN_DASHBOARD } from 'routes/paths';
import SessionContext from 'context/SessionContext';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create component to define protectation layout for pages, which are not accessible after login.
 *
 * @interface UserGuardProps
 * @property {node} children - contains the child components.
 */
export interface UserGuardProps {
  children: React.ReactElement;
}

// ----------------------------------------------------------------------

/**
 * Component to define protectation layout for pages, which are not accessible after login
 *
 * @component
 * @param {node} children - contains the child components
 * @returns {JSX.Element}
 */
const UserGuard: React.FC<UserGuardProps> = ({ children }): JSX.Element => {
  /* Hooks */
  const context = useContext(SessionContext);
  const location = useLocation();
  const returnUrl = new URLSearchParams(location.search).get('returnurl');

  /* Output */
  if (context.isAuthenticated) {
    const redirectPath = PAGE_ADMIN_DASHBOARD.root.absolutePath;
    return <Navigate to={returnUrl || redirectPath} state={location.state} />;
  }

  return children;
};

export default UserGuard;
