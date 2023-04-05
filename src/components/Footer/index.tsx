/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create footer component.
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
import { memo } from 'react';
import { Typography, Box } from '@mui/material';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create footer Component for the authentication pages.
 *
 * @interface FooterProps
 * @property {object|function} containerStyle - styling for chips container
 */
export interface FooterProps {
  containerStyle?: object | (() => void);
}

// ----------------------------------------------------------------------

/**
 * Footer Component for the authentication pages.
 *
 * @component
 * @param {object|function} containerStyle - styling for chips container
 * @returns {JSX.Element}
 */
const Footer = ({ containerStyle = {} }: FooterProps): JSX.Element => {
  /* Output */
  return (
    <Box sx={[styles.rootStyle, containerStyle]}>
      <Typography variant="caption">
        © {new Date().getFullYear()} NimbleEdge. All rights reserved.
      </Typography>
    </Box>
  );
};

export default memo(Footer);
