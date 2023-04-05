/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create notistack provider(snackbar) component.
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
import { SnackbarProvider } from 'notistack';
import { Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CancelIcon from '@mui/icons-material/Cancel';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create styling icon container for snackbar.
 *
 * @interface SnackbarIconProps
 * @property {any} icon - title for the snackbar.
 * @property {string} color - sub title for the snackbar.
 */
export interface SnackbarIconProps {
  icon: any;
  color: string;
}

/**
 * Interface used to create component to shows message for a brief moment at right-top corner.
 *
 * @interface SnackbarProps
 * @property {node} children - contains data or component.
 */
export interface SnackbarProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

/* Styles */
/**
 * styling icon container for snackbar
 * @param {object} icon - icon for snackbar
 * @param {string} color - color for icon container
 */
const SnackbarIcon = ({ icon, color }: SnackbarIconProps): JSX.Element => {
  const IconSnackbar = icon;
  return (
    <Box
      component="span"
      sx={{
        ...styles.iconBox,
        color: `${color}.main`
      }}
    >
      <IconSnackbar width={24} height={24} />
    </Box>
  );
};

// ----------------------------------------------------------------------

/**
 * Shows message for a brief moment at right-top corner
 * @param {node} children - contains data to be displayed.
 *
 * @component
 */
const NotistackProvider = ({ children }: SnackbarProps): JSX.Element => {
  /* Output */
  return (
    <SnackbarProvider
      dense
      maxSnack={5}
      preventDuplicate
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      iconVariant={{
        success: <SnackbarIcon icon={CheckCircleIcon} color="success" />,
        error: <SnackbarIcon icon={CancelIcon} color="error" />,
        warning: <SnackbarIcon icon={ErrorIcon} color="warning" />,
        info: <SnackbarIcon icon={InfoIcon} color="info" />
      }}
    >
      {children}
    </SnackbarProvider>
  );
};

export default memo(NotistackProvider);
