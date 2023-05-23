// @ts-nocheck
import React from "react";
import "./login_page.css";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import { DASHBOARD_PAGE_ROUTE } from "presentation/routes/route-paths";
import axios from "axios";
import { ACCESS_TOKEN, USER_EMAIL } from "core/constants";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";

function LoginPage() {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handleLoginSuccess = (response) => {
    console.log(response);
    navigateTo(DASHBOARD_PAGE_ROUTE);
  };

  const handleLoginFailure = () => {};

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        })
        .then((res) => res.data);

      localStorage.setItem(ACCESS_TOKEN, tokenResponse.access_token);
      localStorage.setItem(USER_EMAIL, userInfo.email);

      navigateTo(DASHBOARD_PAGE_ROUTE);
      dispatch(loaderActions.toggleLoader(false));
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
      dispatch(loaderActions.toggleLoader(false));
    },
  });

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
          <p className="subHeading margin-top-8 force-one-line">
            Please login to proceed to the dashboard.
          </p>
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
            <p className="buttonText">Login using Google</p>
          </div>
          {/* <div className="loginPage-button">
            <GoogleLogin
              theme="filled_blue"
              text="continue_with"
              auto_select={true}
              useOneTap={true}
              state_cookie_domain="single_host_origin"
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
            />
          </div> */}
        </div>
        <p className="clickableLink">Can't login? Contact us</p>
      </div>
    </div>
  );
}

export default LoginPage;
