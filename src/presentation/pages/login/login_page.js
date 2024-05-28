import React, { useEffect, useRef } from "react";
import "./login_page.css";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import {
  ADMIN_PAGE_ROUTE,
  DASHBOARD_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  RBAC_PAGE_ROUTE,
} from "presentation/routes/route-paths";
import axios from "axios";
import {
  ACCESS_TOKEN,
  APP_BASE_MDS_URL,
  AUTH_METHOD,
  COGNITO_LOGIN,
  FORM_LOGIN,
  FORM_PASSWORD,
  FORM_USERNAME,
  SSO_LOGIN,
  USER_EMAIL,
} from "core/constants";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";
import { toast } from "react-toastify";
import RBACPage from "../rbac/rbac_page";

function LoginPage() {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const loginUrl = process.env.REACT_APP_LOGIN_URL;
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const samlLogin = () => {
    localStorage.setItem(AUTH_METHOD, COGNITO_LOGIN);
    window.location.href = loginUrl;
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data);

      localStorage.setItem(ACCESS_TOKEN, tokenResponse.access_token);
      localStorage.setItem(USER_EMAIL, userInfo.email);
      localStorage.setItem(AUTH_METHOD, SSO_LOGIN);
      window.location.reload();
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
      dispatch(loaderActions.toggleLoader(false));
    },
  });

  const handleFormLogin = async (event) => {
    event.preventDefault();
    dispatch(loaderActions.toggleLoader(true));

    localStorage.setItem(AUTH_METHOD, FORM_LOGIN);
    localStorage.setItem(FORM_USERNAME, usernameRef.current.value);
    localStorage.setItem(FORM_PASSWORD, passwordRef.current.value);
    window.location.reload();

    // dispatch(loaderActions.toggleLoader(false));
  };

  return (
    <div className="loginPage">
      <img
        className="loginPage-main-logo"
        src="/assets/logo_expanded.png"
      ></img>
      <div className="loginPage-left-pane">
        <img className="loginPage-img" src="/assets/login_bg.jpg"></img>
      </div>
      <div className="loginPage-right-pane">
        <div className="center-vertically">
          <p className="heading2">Welcome back!</p>
          <p className="subHeading margin-top-8 force-one-line margin-bottom-big">
            Please login to proceed to the dashboard.
          </p>

          <form className="login-flex-horizontal">
            <input
              ref={usernameRef}
              placeholder="Username"
              className="login-input-box margin-bottom-small"
              type="text"
            ></input>
            <input
              ref={passwordRef}
              placeholder="Password"
              className="login-input-box"
              type="password"
            ></input>
          </form>

          <div className="login-button" onClick={handleFormLogin}>
            <p className="center-item-absolute">Sign In</p>
          </div>

          <div className="login-flex">
            <div className="or-line"></div>
            <p className="login-caption">or continue with the following</p>
            <div className="or-line"></div>
          </div>

          <div className="login-flex margin-top-medium">
            <img
              className="compact-login-button margin-right-small"
              src="/assets/icons/google_login_standalone.svg"
              height={"52px"}
              onClick={() => {
                dispatch(loaderActions.toggleLoader(true));
                googleLogin();
              }}
            ></img>

            <img
              className="compact-login-button"
              src="/assets/icons/saml_standalone.svg"
              height={"52px"}
              onClick={() => {
                dispatch(loaderActions.toggleLoader(true));
                samlLogin();
              }}
            ></img>
          </div>
        </div>
        <a
          href="mailto:siddharth.mittal@nimbleedgehq.ai"
          className="clickableLink"
        >
          Can't login? Contact us
        </a>
      </div>
    </div>
  );
}

export default LoginPage;
