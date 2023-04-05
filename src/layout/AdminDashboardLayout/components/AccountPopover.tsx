/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create Account popover component.
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
import { memo, useContext, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Typography
} from '@mui/material';

/* Relative Imports */
import SessionContext from 'context/SessionContext';
import MenuPopover from 'components/MenuPopover';
import MyAvatar from 'components/MyAvatar';
import { ConfirmDialog } from 'components/Dialog';

/* Local Imports */
import styles from '../index.style';

// ----------------------------------------------------------------------

/**
 * Account/My Profile Popover for the logged in pages
 *
 * @component
 * @returns {JSX.Element}
 */
const AccountPopover = (): JSX.Element => {
  /* Hooks */
  const { user, LogoutUser } = useContext(SessionContext);

  /* States */
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  /* Constants */
  const open = Boolean(anchorEl);

  /**
   * function to open profile menu
   * @returns {void}
   */
  const handleOpenMenu = (event: any): void => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * function to close profile menu
   * @returns {void}
   */
  const handleCloseMenu = (): void => {
    setAnchorEl(null);
  };

  /**
   * function to open logout confirmation dialog
   * @returns {void}
   */
  const handleDialogOpen = (): void => {
    setOpenDialog(true);
  };

  /**
   * function to close logout confirmation dialog
   * @returns {void}
   */
  const handleDialogClose = (): void => {
    setOpenDialog(false);
  };

  /**
   * function to call on cancel logout
   * @returns {void}
   */
  const handleLogoutCancel = (): void => {
    handleDialogClose();
    handleCloseMenu();
  };

  /**
   * function to logout on confirmation
   * @returns {void}
   */
  const handleLogout = (): void => {
    LogoutUser();
  };

  return (
    <>
      {user && (
        <>
          <IconButton onClick={handleOpenMenu}>
            <MyAvatar />
          </IconButton>
          <MenuPopover
            id="logout"
            open={open}
            anchorEl={anchorEl}
            onClose={handleCloseMenu}
            contentStyle={styles.accountPopover}
          >
            <Box sx={styles.popoverProfile}>
              <Typography variant="subtitle1">{`${user.first_name} ${user.last_name}`}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              component={Button}
              onClick={handleDialogOpen}
              sx={[styles.popoverMenuItem, styles.logout]}
            >
              Logout
            </MenuItem>
          </MenuPopover>
          <ConfirmDialog
            open={openDialog}
            description="Are you sure you want to Logout?"
            agreeText="Logout"
            disagreeText="Cancel"
            onAgreeAction={handleLogout}
            onDisAgreeAction={handleLogoutCancel}
          />
        </>
      )}
    </>
  );
};

export default memo(AccountPopover);
