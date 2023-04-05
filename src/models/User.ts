/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to create models for user.
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

export interface UserModel {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  profile_photo: string | null;
}
