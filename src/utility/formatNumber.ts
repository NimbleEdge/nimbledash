/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to define the format font size functions.
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

import numeral from 'numeral';

// ----------------------------------------------------------------------

/**
 * function to format the number
 *
 * @param {number} number - number to format
 * @returns {string}
 */
export function fNumber(number: number): string {
  return numeral(number).format();
}

/**
 * function to format number in to currency format
 *
 * @param {number} number - number to format
 * @returns {string}
 */
export function fCurrency(number: number): string {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}
