/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Main index file as an entry point of project
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
import ReactDOM from 'react-dom/client';

/* CSS Imports */
import 'simplebar/src/simplebar.css';

/* Local Imports */
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
