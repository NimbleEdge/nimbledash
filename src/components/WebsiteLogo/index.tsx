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
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, BoxProps, Link } from '@mui/material';

/* Relative Imports */
import { ROOT_PATH } from 'routes/paths';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * styling the logo for Website.
 *
 * @interface BoxProps
 * @property {boolean} isDark - flag to show dark/light logo
 */
export interface Props extends BoxProps {
  isDark?: boolean;
}

// ----------------------------------------------------------------------

/**
 * styling the logo for Website.
 *
 * @component
 * @param {boolean} isDark - flag to show dark/light logo
 * @returns {JSX.Element}
 */
const WebsiteLogo = ({ isDark = false, ...other }: Props): JSX.Element => {
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
        src={isDark ? '/assets/logos/logo_dark.svg' : '/assets/logos/logo.svg'}
        sx={styles.logo}
        {...other}
      />
    </Link>
  );
};

export default memo(WebsiteLogo);
