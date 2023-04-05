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

/**
 * function to convert font size from rem to px
 *
 * @param {string} value - font size value in rem
 * @returns {number}
 */
export function remToPx(value: string): number {
  return Math.round(parseFloat(value) * 16);
}

/**
 * function to convert font size from px to rem
 *
 * @param {number} value - font size value in px
 * @returns {string}
 */
export function pxToRem(value: number): string {
  return `${value / 16}rem`;
}
