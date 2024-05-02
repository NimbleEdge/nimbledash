import React, { useRef } from "react";
import "./login_page.css";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import { ADMIN_PAGE_ROUTE, DASHBOARD_PAGE_ROUTE, LOGIN_PAGE_ROUTE, RBAC_PAGE_ROUTE } from "presentation/routes/route-paths";
import axios from "axios";
import { ACCESS_TOKEN, APP_BASE_MDS_URL, AUTH_METHOD, FORM_PASSWORD, FORM_USERNAME, USER_EMAIL } from "core/constants";
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
    window.location.href = loginUrl;
    localStorage.setItem(AUTH_METHOD, "Cognito");
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data);
      console.log(tokenResponse);

      localStorage.setItem(ACCESS_TOKEN, tokenResponse.access_token);
      localStorage.setItem(USER_EMAIL, userInfo.email);
      localStorage.setItem(AUTH_METHOD, "GoogleSSO");

      navigateTo(DASHBOARD_PAGE_ROUTE);
      dispatch(loaderActions.toggleLoader(false));
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
      dispatch(loaderActions.toggleLoader(false));
    },
  });

  const handleFormLogin = async(event) => {
    event.preventDefault();
    dispatch(loaderActions.toggleLoader(true));

    await axios
      .get(`${APP_BASE_MDS_URL}api/v2/admin/ping`, {
        headers: {
          authMethod: "UserPass",
          TokenId: usernameRef.current.value,
          password: passwordRef.current.value,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          toast.success("Login successful!");
          localStorage.setItem(AUTH_METHOD, "UserPass");
          localStorage.setItem(FORM_USERNAME, usernameRef.current.value);
          localStorage.setItem(FORM_PASSWORD, passwordRef.current.value);
          navigateTo(DASHBOARD_PAGE_ROUTE);
        } else {
          localStorage.clear();
          toast.error("Login failed. Please try again!");
        }
      })
      .catch((e) => {
        localStorage.clear();
        toast.error("Login failed. Please try again!");
      });

    dispatch(loaderActions.toggleLoader(false));
  }

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
            <input ref={usernameRef}
              placeholder="Username" className="login-input-box margin-bottom-small" type="text"></input>
            <input ref={passwordRef}
              placeholder="Password" className="login-input-box" type="password"></input>
          </form>

          <div className="login-button" onClick={handleFormLogin}>
            Sign In
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

          {/* <div
            className="custom-loginPage-button clickable "
            onClick={() => {
              dispatch(loaderActions.toggleLoader(true));
              samlLogin();
            }}
          >
            <img
              className="buttonLogo"
              src="/assets/icons/saml_login.png"
              height={"28px"}
            ></img>
            <p className="buttonText">Login with SAML</p>
          </div>

          <div
            className="custom-loginPage-button clickable"
            onClick={() => {
              dispatch(loaderActions.toggleLoader(true));
              googleLogin();
            }}
          >
            <img
              className="buttonLogo"
              src="/assets/logo_google.png"
              height={"28px"}
            ></img>
            <p className="buttonText">Login with Google</p>
          </div> */}

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
