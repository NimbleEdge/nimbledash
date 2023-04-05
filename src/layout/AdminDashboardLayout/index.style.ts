/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create styles for admin dashboard layout.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 31/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

import { Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export default {
  rootStyle: (theme: any) => ({
    backgroundColor: theme.palette.background.default,
    width: '100%',
    height: '100vh',
    display: 'flex',
    position: 'relative',
    overflow: 'hidden'
  }),
  leftPanel: (theme: any) => ({
    backgroundColor: theme.palette.secondary.dark,
    width: 264,
    height: '100%'
  }),
  sidebarDrawer: (theme: any) => ({
    backgroundColor: theme.palette.secondary.dark
  }),
  logoContainer: {
    paddingX: 2
  },
  userProfile: (theme: any) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    opacity: 0.6,
    margin: theme.spacing(1, 1, 3),
    padding: 2,
    borderRadius: `${theme.shape.borderRadiusXs}px`,
    [theme.breakpoints.down('md')]: {
      marginX: 2
    }
  }),
  profilePicture: {
    cursor: 'pointer',
    width: 48,
    height: 48,
    mr: 2
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 60
  },
  sidebarList: (theme: any) => ({
    padding: 0,
    '& .MuiListItemButton-root': {
      color: theme.palette.common.white,
      [theme.breakpoints.up('md')]: {
        paddingX: 3
      }
    }
  }),
  wrapperStyle: {
    flex: 1,
    height: '100%',
    position: 'relative',
    overflow: 'hidden'
  },
  containerStyle: (theme: Theme) => ({
    backgroundColor: theme.palette.background.paper,
    height: 'calc(100% - 64px)',
    mt: 8,
    overflow: 'auto'
  }),
  contentStyle: {
    flex: '1 1 auto',
    height: '100%',
    overflow: 'auto'
  },
  header: (theme: any) => ({
    width: 'calc(100% - 264px)',
    height: 64,
    position: 'fixed',
    zIndex: 999,
    left: 264,
    top: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    color: theme.palette.common.white,
    paddingY: 1,
    boxShadow:
      theme.palette.mode === 'dark'
        ? theme.shadows[12]
        : theme.customShadows.z4,
    [theme.breakpoints.down('laptop')]: {
      width: '100%',
      left: 0
    }
  }),
  menuIcon: {
    mr: 3
  },
  rightOptions: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  accountPopover: {
    width: 270
  },
  popoverProfile: {
    my: 1.5,
    px: 2.5,
    flexWrap: 'nowrap'
  },
  popoverMenuItem: {
    typography: 'body2',
    py: 1,
    px: 2.5
  },
  modeMenuItem: {
    cursor: 'default',
    '&:hover': {
      background: 'none'
    }
  },
  logout: {
    width: '100%',
    justifyContent: 'center'
  },
  footer: (theme: Theme) => ({
    textAlign: 'center',
    borderTop: `1px solid ${theme.palette.grey[600]}`,
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.common.white
  })
};
