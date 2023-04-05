/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create Sign in form.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 31/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */
// ----------------------------------------------------------------------

/* Imports */
import { memo } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Box, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { LoadingButton } from '@mui/lab';

/* Relative Imports */
import { PasswordInput, TextInput } from 'components/InputFields';
import { UserModel } from 'models';
import { loginToken, loginUser } from 'constants/appConstant';

/* Local Imports */
import styles from '../index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create sign In form to validate the credentials.
 *
 * @interface Props
 * @property {function} onSubmitSuccess - callback function on successful submission of sign in form
 */
export interface Props {
  onSubmitSuccess: (
    token: string,
    user: UserModel,
    rememberMe: boolean
  ) => void;
}

// ----------------------------------------------------------------------

/**
 * Sign In form to validate the credentials
 *
 * @component
 * @param {function} onSubmitSuccess - callback function on successful submission of sign in form
 * @returns {JSX.Element}
 */
const SignInForm = ({ onSubmitSuccess }: Props): JSX.Element => {
  /* Constant */
  const initialValues: any = {
    txtUsername: '',
    txtPassword: '',
    chkRememberMe: false
  };

  /* Functions */
  /**
   * Submit function to verify credentials for login
   * @param {object} values - input values of form
   * @returns {void}
   */
  const handleFormSubmit = async (values: any): Promise<void> => {
    try {
      if (
        values.txtUsername === loginUser.username &&
        values.txtPassword === loginUser.password
      ) {
        onSubmitSuccess(loginToken, loginUser, values.chkRememberMe);
      }
    } catch {
      // error
    }
  };

  /* Form validation schema */
  const validationSchema = Yup.object().shape({
    txtUsername: Yup.string().required('Please enter your username.'),
    txtPassword: Yup.string().required('Please enter your login password.')
  });

  /* Output */
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Box mb={3}>
            <TextInput
              name="txtUsername"
              label="Username"
              placeholder="Enter Username"
              value={values.txtUsername}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.txtUsername && errors.txtUsername)}
              helperText={String(touched.txtUsername && errors.txtUsername)}
            />
          </Box>
          <Box mb={2}>
            <PasswordInput
              name="txtPassword"
              label="Password"
              placeholder="Enter password"
              value={values.txtPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.txtPassword && errors.txtPassword)}
              helperText={String(touched.txtPassword && errors.txtPassword)}
            />
          </Box>
          <Box mb={2}>
            <FormGroup sx={styles.formGroup}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="chkRememberMe"
                    checked={values.chkRememberMe}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                }
                label="Remember me"
              />
            </FormGroup>
          </Box>
          <Box>
            <LoadingButton
              fullWidth
              type="submit"
              size="large"
              variant="contained"
              loading={isSubmitting}
            >
              Sign In
            </LoadingButton>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default memo(SignInForm);
