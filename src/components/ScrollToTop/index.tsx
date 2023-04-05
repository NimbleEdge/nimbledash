/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create scroll to top component.
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
import { memo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

/**
 * Component scrolls to top when path is changed.
 *
 * @component
 */
const ScrollToTop = (): null => {
  /* Hooks */
  const { pathname } = useLocation();

  /* Side-Effects */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  /* Output */
  return null;
};

export default memo(ScrollToTop);
