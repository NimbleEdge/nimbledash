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
  const loginUrl = process.env.REACT_APP_LOGIN_URL;

  const samlLogin = () => {
    window.location.href = loginUrl;
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
          <p className="subHeading margin-top-8 force-one-line">
            Please login to proceed to the dashboard.
          </p>
          <div
            className="custom-loginPage-button clickable"
            onClick={() => {
              dispatch(loaderActions.toggleLoader(true));
              samlLogin();
            }}
          >
            <img
              className="buttonLogo"
              src="/assets/logo_google.png"
              height={"28px"}
            ></img>
            <p className="buttonText">Login using Google</p>
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
