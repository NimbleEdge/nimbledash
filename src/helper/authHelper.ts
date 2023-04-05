/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to define helper functions for authentication.
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
import Cookies from 'js-cookie';

// ----------------------------------------------------------------------

/* Constants */
const cookieKey = 'nimbleedge_dashboard_token';

// ----------------------------------------------------------------------

/**
 * function to set access token in cookies
 *
 * @param {string} accessToken - logged in user token
 * @param {boolean} isRememberMe - flag to remember/forgot user after session ends.
 * @returns {void}
 */
export const setAccessToken = (
  accessToken: string,
  isRememberMe: boolean
): void => {
  const cookieConfig: any = {
    path: '/',
    sameSite: true
  };
  const expiresDate = new Date(); // Now
  if (isRememberMe) {
    expiresDate.setDate(expiresDate.getDate() + 30); // Set now + 30 days as the new date

    cookieConfig.expires = expiresDate;
  } else {
    expiresDate.setDate(expiresDate.getDate() + 1); // Set now + 1 days as the new date
    cookieConfig.expires = expiresDate;
  }
  Cookies.set(cookieKey, accessToken, cookieConfig);
};

/**
 * function to remove access token from cookies
 *
 * @returns {void}
 */
export const removeAccessToken = (): void => {
  const cookieConfig: any = {
    path: '/',
    sameSite: true,
    expires: 0
  };
  Cookies.remove(cookieKey, cookieConfig);
};

/**
 * function to get access token from cookies
 *
 * @returns {string} - returns a access token from cookies
 */
export const getAccessToken = (): string | null => {
  return Cookies.get(cookieKey) || null;
};
