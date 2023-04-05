/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to styles for text input component.
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
import { Theme } from '@mui/material/styles';

export default {
  formLabelStyle: (theme: Theme) => ({
    position: 'relative',
    marginBottom: theme.spacing(0.5),
    width: '100%'
  }),
  formHelperTextStyle: (theme: Theme) => ({
    marginLeft: theme.spacing(0.5),
    marginTop: theme.spacing(0.5)
  })
};
