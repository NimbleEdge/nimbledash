/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Main app component to enter in project.
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
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

/* Relative Imports */
import ThemeConfig from 'theme';
import Routing from 'routes';
import { SessionProvider } from 'context/SessionContext';
import ScrollToTop from 'components/ScrollToTop';
import NotistackProvider from 'components/NotistackProvider';

// ----------------------------------------------------------------------

/**
 * App component to to set all the higher level components and routes.
 *
 * @component
 * @returns {JSX.Element}
 */
const App: React.FC = (): JSX.Element => {
  return (
    <HelmetProvider>
      <ThemeConfig>
        <SessionProvider>
          <NotistackProvider>
            <Router>
              <ScrollToTop />
              <Routing />
            </Router>
          </NotistackProvider>
        </SessionProvider>
      </ThemeConfig>
    </HelmetProvider>
  );
};

export default App;
