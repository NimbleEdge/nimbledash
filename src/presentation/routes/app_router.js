import { Route, Routes } from "react-router";
import {
  ADMIN_PAGE_ROUTE,
  CONTACT_PAGE_ROUTE,
  DASHBOARD_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  RBAC_PAGE_ROUTE,
} from "./route-paths";
import React, { useEffect, useState } from "react";
import LoginPage from "presentation/pages/login/login_page";
import {
  ACCESS_TOKEN,
  APP_BASE_MDS_URL,
  AUTH_METHOD,
  COGNITO_USERNAME,
  USER_EMAIL,
} from "core/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";
import RBACPage from "presentation/pages/rbac/rbac_page";
import ContactPage from "presentation/pages/contact/contact_page";
import AdminPage from "presentation/pages/admin/admin_page";
import DashboardPage from "presentation/pages/dashboard/dashboard";
import DeploymentPage from "presentation/pages/deployment/deployment_page";

function AppRouter(props) {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const canRender = useState(false);

  useEffect(() => {
    // dispatch(loaderActions.toggleLoader(false));
    // return;
    dispatch(loaderActions.toggleLoader(true));
    var currentBrowserUrl = window.location.href;

    if (currentBrowserUrl.includes("access_token")) {
      var myUrl = new URL(window.location.href.replace(/#/g, "?"));
      var access_token = myUrl.searchParams.get("access_token");
      var id_token = myUrl.searchParams.get("id_token");

      isTokenValid(access_token).then((isValid) => {
        if (!isValid) {
          navigateTo(LOGIN_PAGE_ROUTE);
          toast.error("Login failed. Please try again!");
        } else {
          toast.success("Login successful!");
          var decodedIdToken = jwt_decode(id_token);
          localStorage.setItem(ACCESS_TOKEN, access_token);
          localStorage.setItem(USER_EMAIL, decodedIdToken["email"]);
          localStorage.setItem(
            COGNITO_USERNAME,
            decodedIdToken["cognito:username"]
          );
          navigateTo(DASHBOARD_PAGE_ROUTE);
        }
        dispatch(loaderActions.toggleLoader(false));
      });
    } else {
      var token = localStorage.getItem(ACCESS_TOKEN);

      isTokenValid(token).then((isValid) => {
        if (isValid && currentBrowserUrl.includes("/login")) {
          navigateTo(DASHBOARD_PAGE_ROUTE);
        }
        if (!isValid && !currentBrowserUrl.includes("/login")) {
          localStorage.clear();
          navigateTo(LOGIN_PAGE_ROUTE);
        }
      });
      dispatch(loaderActions.toggleLoader(false));
    }
  }, []);

  const isTokenValid = async (token) => {
    if (token == null) return false;

    return await axios
      .get(`${APP_BASE_MDS_URL}api/v2/admin/ping`, {
        headers: {
          authMethod: localStorage.getItem(AUTH_METHOD),
          Token: token,
        },
      })
      .then((res) => {
        //console.log("NEXA",res);
        if (res.status == 200) {
          return true;
        } else {
          return false;
        }
      })
      .catch((e) => {
        //console.log(e);
        //console.log('palash');
        return false;
      });
  };

  return (
    <Routes>
      <Route path={LOGIN_PAGE_ROUTE} element={<LoginPage />} />
      <Route path={DASHBOARD_PAGE_ROUTE} element={<DashboardPage />} />
      <Route path={ADMIN_PAGE_ROUTE} element={<AdminPage />} />
      <Route path={CONTACT_PAGE_ROUTE} element={<ContactPage />} />
      <Route path={RBAC_PAGE_ROUTE} element={<RBACPage />} />
      <Route path="/deployments" element={<DeploymentPage />} />
      {localStorage.getItem(ACCESS_TOKEN) != null && (
        <Route path="/" element={<DashboardPage />} />
      )}
    </Routes>
  );
}

export default AppRouter;
