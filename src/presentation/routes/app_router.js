import { Route, Routes } from "react-router";
import {
  ADMIN_PAGE_ROUTE,
  APPROVAL_PAGE_ROUTE,
  BILLING_PAGE_ROUTE,
  CONTACT_PAGE_ROUTE,
  DASHBOARD_PAGE_ROUTE,
  DEPLOYMENTS_PAGE_ROUTE,
  EVENTS_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  RBAC_PAGE_ROUTE,
} from "./route-paths";
import React, { useEffect, useState } from "react";
import LoginPage from "presentation/pages/login/login_page";
import {
  ACCESS_TOKEN,
  APP_BASE_MDS_URL,
  AUTH_METHOD,
  CLIENT_ID,
  COGNITO_LOGIN,
  COGNITO_USERNAME,
  FORM_LOGIN,
  FORM_PASSWORD,
  FORM_USERNAME,
  ORGANIZATION,
  PING_ENDPOINT,
  SSO_LOGIN,
  USER_EMAIL,
} from "core/constants";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import store, { loaderActions, userActions } from "presentation/redux/stores/store";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import RBACPage from "presentation/pages/rbac/rbac_page";
import ContactPage from "presentation/pages/contact/contact_page";
import AdminPage from "presentation/pages/admin/admin_page";
import DashboardPage from "presentation/pages/dashboard/dashboard";
import DeploymentPage from "presentation/pages/deployment/deployment_page";
import BillingPage from "presentation/pages/billing/bililng_page";
import ApprovalPage from "presentation/pages/approval/approval_page";
import { getRequest, postRequest } from "data/remote_datasource";
import EventsPage from "presentation/pages/events/events_page";

function AppRouter(props) {
  const dispatch = useDispatch();
  const isAuthenticated = props.isAuthenticated;
  const setIsAuthenticated = props.setIsAuthenticated;
  // @ts-ignore
  const globalUserState = useSelector((state) => state.userReducer);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    dispatch(loaderActions.toggleLoader(true));

    var authMethod = localStorage.getItem(AUTH_METHOD);

    switch (authMethod) {
      case COGNITO_LOGIN:
        handeSamlLogin().then(() => { dispatch(loaderActions.toggleLoader(false)); setCheckingAuth(false); });
        break;
      case SSO_LOGIN:
        handleGoogleLogin().then(() => { dispatch(loaderActions.toggleLoader(false)); setCheckingAuth(false); });
        break;
      case FORM_LOGIN:
        handleFormLogin().then(() => { dispatch(loaderActions.toggleLoader(false)); setCheckingAuth(false); });
        break;
      default:
        dispatch(loaderActions.toggleLoader(false));
        setCheckingAuth(false);
    }
  }, []);

  const handeSamlLogin = async () => {
    var currentBrowserUrl = window.location.href;

    if (currentBrowserUrl.includes("access_token")) {
      var myUrl = new URL(window.location.href.replace(/#/g, "?"));
      var accessToken = myUrl.searchParams.get("access_token");
      var idToken = myUrl.searchParams.get("id_token");
      var decodedIdToken = jwt_decode(idToken);
      var email = decodedIdToken["email"]

      var isValid = await isAccessTokenValid(COGNITO_LOGIN, accessToken, email, null)

      if (isValid[0]) {
        handleSuccessfulLogin(COGNITO_LOGIN, decodedIdToken["cognito:username"], null, null, email, accessToken, null, null, isValid[1]);
      }
      else {
        handleFailedLogin();
      }
    }
    else {
      var cachedAccessToken = localStorage.getItem(ACCESS_TOKEN);
      var cachedEmail = localStorage.getItem(USER_EMAIL);
      var cachedClientId = localStorage.getItem(CLIENT_ID);
      var cognitoUsername = localStorage.getItem(COGNITO_USERNAME);
      var cachedUserOrg = localStorage.getItem(ORGANIZATION);

      if (cachedAccessToken == 'undefined' || cachedAccessToken == 'null') { handleFailedLogin(); }

      var isValid = await isAccessTokenValid(COGNITO_LOGIN, cachedAccessToken, cachedEmail, null)
      if (isValid[0]) {
        handleSuccessfulLogin(COGNITO_LOGIN, cognitoUsername, null, null, cachedEmail, cachedAccessToken, cachedClientId, cachedUserOrg, isValid[1]);
      }
      else {
        handleFailedLogin();
      }
    }
  }

  const handleGoogleLogin = async () => {
    var cachedAccessToken = localStorage.getItem(ACCESS_TOKEN);
    var cachedEmail = localStorage.getItem(USER_EMAIL);
    var cachedClientId = localStorage.getItem(CLIENT_ID);
    var cachedUserOrg = localStorage.getItem(ORGANIZATION);

    if (cachedAccessToken == 'undefined' || cachedAccessToken == 'null') { handleFailedLogin() }
    var isValid = await isAccessTokenValid(SSO_LOGIN, cachedAccessToken, cachedEmail, null);
    if (isValid[0]) {
      handleSuccessfulLogin(SSO_LOGIN, null, null, null, cachedEmail, cachedAccessToken, cachedClientId, cachedUserOrg, isValid[1]);
    }
    else {
      handleFailedLogin();
    }
  }

  const handleFormLogin = async () => {
    var username = localStorage.getItem(FORM_USERNAME);
    var password = localStorage.getItem(FORM_PASSWORD);
    var cachedClientId = localStorage.getItem(CLIENT_ID);
    var cachedUserOrg = localStorage.getItem(ORGANIZATION);

    var isValid = await isAccessTokenValid(FORM_LOGIN, null, username, password);

    if (isValid[0]) {
      handleSuccessfulLogin(FORM_LOGIN, null, username, password, null, null, cachedClientId, cachedUserOrg, isValid[1]);
    }
    else {
      handleFailedLogin();
    }
  }

  const handleSuccessfulLogin = (authMethod, cognitoUsername, username, password, email, accessToken, clientId, userOrg, orgDetails) => {
    var currentBrowserUrl = window.location.href;

    localStorage.setItem(AUTH_METHOD, authMethod);
    localStorage.setItem(COGNITO_USERNAME, cognitoUsername);
    localStorage.setItem(FORM_USERNAME, username);
    localStorage.setItem(FORM_PASSWORD, password);
    localStorage.setItem(USER_EMAIL, email);
    localStorage.setItem(ACCESS_TOKEN, accessToken);
    localStorage.setItem(CLIENT_ID, clientId);
    localStorage.setItem(ORGANIZATION, userOrg);

    // @ts-ignore
    dispatch(userActions.setUser({
      authMethod: authMethod,
      cognitoUsername: cognitoUsername,
      username: username,
      password: password,
      email: email,
      accessToken: accessToken,
      clientId: clientId,
      org: userOrg,
      orgData: orgDetails
    }));


    if (currentBrowserUrl.includes("/login")) {
      toast.success("Login successful!");
    }
    setIsAuthenticated(true);

  }

  const handleFailedLogin = () => {
    localStorage.clear();

    toast.error("Login failed. Please try again!");
  }

  const isAccessTokenValid = async (authMethod, accessToken, tokenId, password) => {

    var res = await postRequest(APP_BASE_MDS_URL, PING_ENDPOINT, { email: tokenId }, {
      authMethod: authMethod,
      Token: accessToken,
      TokenId: tokenId,
      password: password,
    });

    if (res != null && res.status <= 200 && res.status < 300) {
      var orgs = res.organizations;

      return [true,orgs];
    }

    return [false,null];
  };

  return (

    <div>
      {!checkingAuth && <Routes>
        <Route path={LOGIN_PAGE_ROUTE} element={isAuthenticated ? <Navigate to={DASHBOARD_PAGE_ROUTE} /> : <LoginPage />} />
        <Route path={DASHBOARD_PAGE_ROUTE} element={isAuthenticated ? <DashboardPage /> : <Navigate to={LOGIN_PAGE_ROUTE} />} />
        <Route path={ADMIN_PAGE_ROUTE} element={isAuthenticated ? <AdminPage /> : <Navigate to={LOGIN_PAGE_ROUTE} />} />
        <Route path={CONTACT_PAGE_ROUTE} element={isAuthenticated ? <ContactPage /> : <Navigate to={LOGIN_PAGE_ROUTE} />} />
        <Route path={RBAC_PAGE_ROUTE} element={isAuthenticated ? <RBACPage /> : <Navigate to={LOGIN_PAGE_ROUTE} />} />
        <Route path={DEPLOYMENTS_PAGE_ROUTE} element={isAuthenticated ? <DeploymentPage /> : <Navigate to={LOGIN_PAGE_ROUTE} />} />
        <Route path={BILLING_PAGE_ROUTE} element={isAuthenticated ? <BillingPage /> : <Navigate to={LOGIN_PAGE_ROUTE} />} />
        <Route path={APPROVAL_PAGE_ROUTE} element={isAuthenticated ? <ApprovalPage /> : <Navigate to={LOGIN_PAGE_ROUTE} />} />
        <Route path={APPROVAL_PAGE_ROUTE} element={isAuthenticated ? <ApprovalPage /> : <Navigate to={LOGIN_PAGE_ROUTE} />} />
        <Route path={EVENTS_PAGE_ROUTE} element={isAuthenticated ? <EventsPage /> : <Navigate to={LOGIN_PAGE_ROUTE} />} />
        {(localStorage.getItem(ACCESS_TOKEN) != null || localStorage.getItem(FORM_PASSWORD) != null) && <Route path="/" element={isAuthenticated ? <Navigate to={DASHBOARD_PAGE_ROUTE} /> : <Navigate to={LOGIN_PAGE_ROUTE} />} />}
        {<Route path="*" element={isAuthenticated ? <Navigate to={DASHBOARD_PAGE_ROUTE} /> : <Navigate to={LOGIN_PAGE_ROUTE} />} />}
      </Routes>}
    </div>

  );
}

export default AppRouter;
