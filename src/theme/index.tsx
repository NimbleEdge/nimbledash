/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Theme Config is used to set themes to its children components.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 29/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { useMemo } from 'react';
import {
  createTheme,
  CssBaseline,
  StyledEngineProvider,
  ThemeOptions,
  ThemeProvider
} from '@mui/material';
import '@mui/lab/themeAugmentation';

/* Local Imports */
import breakpoints from './breakpoints';
import componentsOverride from './overrides';
import palette from './palette';
import shadows, { customShadows } from './shadows';
import shape from './shape';
import typography from './typography';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used to create theme Config which is used to set themes to its children components.
 *
 * @interface IThemeConfigProps
 * @property {node} children - nested components to set the theme.
 */
export interface IThemeConfigProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

/**
 * Theme Config is used to set themes to its children components
 *
 * @param children - nested components to set the theme
 * @returns provides theme to its children
 */
const ThemeConfig: React.FC<IThemeConfigProps> = ({
  children
}): JSX.Element => {
  const isLight = true;
  const themeOptions: ThemeOptions = useMemo(
    () => ({
      palette: { ...palette.light, mode: 'light' },
      shape,
      typography,
      breakpoints,
      direction: 'ltr',
      shadows: shadows.light,
      customShadows: customShadows.light
    }),
    [isLight]
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  /* Output */
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeConfig;
