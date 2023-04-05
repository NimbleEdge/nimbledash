/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to define the configrations for axios.
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
import axios from 'axios';

/* Local Imports */
import { apiBaseUrl } from './config';

// ----------------------------------------------------------------------

const axiosConfig = axios.create({
  baseURL: apiBaseUrl
});

export default axiosConfig;
