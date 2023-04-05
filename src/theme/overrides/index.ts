/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Components Overrides holds all imported components
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created  : 29/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

// ----------------------------------------------------------------------

/* Imports */
import { Theme } from '@mui/material';
import { merge } from 'lodash';

/* Local Imports */
import Avatar from './Avatar';
import Backdrop from './Backdrop';
import Button from './Button';
import Card from './Card';
import Checkbox from './Checkbox';
import ControlLabel from './ControlLabel';
import Dialog from './Dialog';
import Drawer from './Drawer';
import Input from './Input';
import LoadingButton from './LoadingButton';
import Menu from './Menu';
import Paper from './Paper';
import Popover from './Popover';
import Typography from './Typography';

// ----------------------------------------------------------------------

/**
 * Allows all imported components to use theme by passing as props, merging and making into single component.
 * @component
 * @param theme - passed as props to the imported components
 * @returns single component containing all imported components
 */
export default function ComponentsOverrides(theme: Theme): any {
  /* Output */
  return merge(
    Avatar(theme),
    Backdrop(theme),
    Button(theme),
    Card(theme),
    Checkbox(theme),
    ControlLabel(theme),
    Dialog(theme),
    Drawer(theme),
    Input(theme),
    LoadingButton(),
    Menu(theme),
    Paper(),
    Popover(theme),
    Typography(theme)
  );
}
