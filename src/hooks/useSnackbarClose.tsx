/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to define the snackbar hook.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created  : 30/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { useSnackbar } from 'notistack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// ----------------------------------------------------------------------

/**
 * Hook to customizing the snackbar
 * @component
 * @yields {function}
 */
function useSnackbarClose(): any {
  /* Hooks */
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  /* States */

  /**
   * Handles message, color and close action for snackbar
   * @param {string} message - 'info' | 'success' | 'warning' | 'error' messages from components
   * @param {string} color - 'info' | 'success' | 'warning' | 'error' colors from components
   * @returns {void}
   */
  const handleShowSnackbar = (message: string, color: any): void => {
    enqueueSnackbar(message, {
      variant: color,
      action: (key: any) => (
        <IconButton
          size="small"
          color="inherit"
          onClick={() => closeSnackbar(key)}
        >
          <CloseIcon />
        </IconButton>
      )
    });
  };

  /* Output */
  return {
    showSnackbar: handleShowSnackbar
  };
}

export default useSnackbarClose;
