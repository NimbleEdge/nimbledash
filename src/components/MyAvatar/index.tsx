/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create my avatar component.
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
import { memo, useContext } from 'react';
import { Avatar } from '@mui/material';

/* Relative Imports */
import SessionContext from 'context/SessionContext';

// ----------------------------------------------------------------------

/**
 * Component to show logged in user's profile picture.
 *
 * @component
 * @returns {JSX.Element}
 */
const MyAvatar = ({ ...other }): JSX.Element => {
  /* Hooks */
  const { user } = useContext(SessionContext);

  /* Output */
  return <Avatar src={user?.profile_photo || ''} alt="" {...other} />;
};

export default memo(MyAvatar);
