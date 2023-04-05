/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to define the constants.
 * --------------------------------------------------------------------
 * Creation Details
 * @author Naishad Vaishnav
 * Date Created: 30/Mar/2023
 * FDO Ref:
 * TDO Ref:
 * RTM Ref:
 * Test Case Ref:
 */

import { UserModel } from 'models';

// ----------------------------------------------------------------------

export const loginToken = 'accesstoken';
export const loginUser: UserModel = {
  id: 1,
  first_name: 'Siddharth',
  last_name: 'Mittal',
  email: 'siddharth.mittal@nimbleedgehq.ai',
  username: 'demo',
  password: 'demo',
  profile_photo: null
};
