/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to define the services related to role.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 04/Apr/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */

/* Relative Imports */
import axiosInstance from 'config/axiosConfig';

// ----------------------------------------------------------------------

export const getMetricsData = (): Promise<any> => {
  return axiosInstance
    .get('/dla/api/metrics')
    .then((response) => response.data);
};
