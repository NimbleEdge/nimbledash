/**
 * @copyright @2023  Nimbleedge Inc. All rights reserved.
 * @description Page to define the session context.
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
import React from 'react';

/* Relative Imports */
import { ROOT_PATH } from 'routes/paths';
import { UserModel } from 'models';
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken
} from 'helper/authHelper';
import { loginUser } from 'constants/appConstant';

// ----------------------------------------------------------------------

/* Types/Interfaces */
/**
 * Interface used for session state.
 *
 * @interface ISessionState
 * @property {boolean} isAuthenticated - is authenticated for session state.
 * @property {string|null} authToken - authToken for session state.
 * @property {UserModel|null} user - user for session state.
 * @property {func} LoginUser - login user function for session state.
 * @property {func} LogoutUser - logout user function for session state.
 */
export interface ISessionState {
  isAuthenticated: boolean;
  authToken: string | null;
  user: UserModel | null;
  LoginUser: (token: string, loggedInUser: any, rememberMe: boolean) => void;
  LogoutUser: () => void;
}

/**
 * Interface used to define session provider.
 *
 * @interface ISessionProps
 * @property {node} children - contains data or component.
 */
export interface ISessionProps {
  children: React.ReactNode;
}

// ----------------------------------------------------------------------

/* Initial State */
const initialState: ISessionState = {
  isAuthenticated: false,
  authToken: null,
  user: null,
  LoginUser: () => null,
  LogoutUser: () => null
};

/* Create Context */
const SessionContext = React.createContext<ISessionState>(initialState);

// ----------------------------------------------------------------------

class Session extends React.Component<ISessionProps, ISessionState> {
  private static USER_COOKIE_KEY: string = 'dsr_user';

  /* Constructor */
  constructor(props: ISessionProps) {
    super(props);
    const accessToken: string | null = getAccessToken();
    const user = accessToken ? loginUser : null;

    this.state = {
      isAuthenticated: Boolean(accessToken),
      authToken: accessToken,
      user,
      LoginUser: (token, loggedInUser, rememberMe) => {
        setAccessToken(token, rememberMe);
        this.setState({
          isAuthenticated: true,
          authToken: token,
          user: { ...loggedInUser }
        });
      },
      LogoutUser: () => {
        removeAccessToken();
        this.setState((prevState) => ({
          ...prevState,
          isAuthenticated: false,
          authToken: null,
          user: null
        }));
        window.location.href = ROOT_PATH;
      }
    };
  }

  /* Output */
  render(): JSX.Element {
    return (
      <SessionContext.Provider value={this.state}>
        {this.props.children}
      </SessionContext.Provider>
    );
  }
}

export default SessionContext;
export const SessionProvider = Session;
export const SessionConsumer = SessionContext.Consumer;
