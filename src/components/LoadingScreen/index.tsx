/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create loading screen component.
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
import { motion } from 'framer-motion';
import { Box } from '@mui/material';

/* Relative Imports */
import WebsiteLogoIcon from 'components/WebsiteLogo/Icon';

/* Local Imports */
import styles from './index.style';

// ----------------------------------------------------------------------

/**
 * Component displays animated loading screen.
 *
 * @component
 */
const LoadingScreen = ({ ...other }): JSX.Element => {
  /* Output */
  return (
    <Box sx={styles.rootStyle} {...other}>
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 360 }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeatDelay: 1,
          repeat: Infinity
        }}
      >
        <Box sx={styles.logo}>
          <WebsiteLogoIcon />
        </Box>
      </motion.div>

      <Box
        component={motion.div}
        animate={{
          scale: [1.2, 1, 1, 1.2, 1.2],
          rotate: [270, 0, 0, 270, 270],
          opacity: [0.25, 1, 1, 1, 0.25],
          borderRadius: ['25%', '25%', '50%', '50%', '25%']
        }}
        transition={{ ease: 'linear', duration: 3.2, repeat: Infinity }}
        sx={styles.innerBox}
      />
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1.2, 1, 1],
          rotate: [0, 270, 270, 0, 0],
          opacity: [1, 0.25, 0.25, 0.25, 1],
          borderRadius: ['25%', '25%', '50%', '50%', '25%']
        }}
        transition={{
          ease: 'linear',
          duration: 3.2,
          repeat: Infinity
        }}
        sx={styles.outerBox}
      />
    </Box>
  );
};

export default memo(LoadingScreen);
