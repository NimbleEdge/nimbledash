/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create website logo component.
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
import React, { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link } from '@mui/material';

/* Relative Imports */
import { ROOT_PATH } from 'routes/paths';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/**
 * styling the logo for Website.
 *
 * @component
 * @param {boolean} isIcon - flag to show original logo or icon
 * @returns {JSX.Element}
 */
const Icon = ({ ...other }): JSX.Element => {
  /* Output */
  return (
    <Link
      component={RouterLink}
      underline="none"
      to={ROOT_PATH}
      sx={styles.logoLink}
    >
      <Box
        component="img"
        alt="logo"
        src="/assets/logos/apple-touch-icon.png"
        sx={styles.logo}
        {...other}
      />
    </Link>
  );
};

export default memo(Icon);
