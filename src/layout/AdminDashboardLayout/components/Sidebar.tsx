/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create side bar/drawer for admin dashboard pages.
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
import { memo, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

/* Relative Imports */
import SessionContext from 'context/SessionContext';
import Footer from 'components/Footer';
import WebsiteLogo from 'components/WebsiteLogo';
import MyAvatar from 'components/MyAvatar';
import breakpoints from 'theme/breakpoints';

/* Local Imports */
import styles from '../index.style';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create side bar/drawer for all admin pages.
 *
 * @interface SidebarProps
 * @property {boolean} openMobile - flag to check if drawer is open/close
 * @property {function} onMobileClose - callback function to change the state of openMobile
 */
export interface SidebarProps {
  openMobile: boolean;
  onMobileClose: any;
}

// ----------------------------------------------------------------------

/**
 * Side bar/drawer for all admin pages.
 *
 * @component
 * @param {boolean} openMobile - flag to check if drawer is open/close
 * @param {function} onMobileClose - callback function to change the state of openMobile
 * @returns {JSX.Element}
 */
// function Sidebar({ openMobile, onMobileClose }) {
const Sidebar = ({ openMobile, onMobileClose }: SidebarProps): JSX.Element => {
  /* Hooks */
  const theme = useTheme();
  const location = useLocation();
  const laptopDownMatches = useMediaQuery(
    theme.breakpoints.down(breakpoints.values.laptop)
  );
  const { isAuthenticated, user } = useContext(SessionContext);

  /* Side-Effects */
  useEffect(() => {
    if (openMobile) {
      onMobileClose();
    }
  }, [location.pathname]);

  /* Hooks */
  const content = isAuthenticated && user && (
    <Stack height="100%">
      <Box sx={styles.logoContainer}>
        <WebsiteLogo />
      </Box>
      <Box sx={styles.userProfile}>
        <MyAvatar sx={styles.profilePicture} />
        <Box flex={1}>
          <Typography variant="subtitle1" noWrap>
            {`${user.first_name} ${user.last_name}`}
          </Typography>
        </Box>
      </Box>
      <Box sx={styles.listContainer} />
      <Footer containerStyle={styles.footer} />
    </Stack>
  );

  /* Output */
  return (
    <>
      {laptopDownMatches ? (
        <Drawer
          anchor="left"
          variant="temporary"
          open={openMobile}
          onClose={onMobileClose}
          PaperProps={{
            sx: styles.sidebarDrawer
          }}
        >
          {content}
        </Drawer>
      ) : (
        <Box sx={styles.leftPanel}>{content}</Box>
      )}
    </>
  );
};

export default memo(Sidebar);
