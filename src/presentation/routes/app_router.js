// @ts-nocheck
import { Route, Routes } from "react-router";
import {
  ADMIN_PAGE_ROUTE,
  DASHBOARD_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
} from "./route-paths";
import React, { useEffect } from "react";
import LoginPage from "presentation/pages/login/login_page";
import DashboardPage from "presentation/pages/dashboard/dashboard_page";
import InputModal from "presentation/components/inputModal/inputModal";
import AdminPage from "presentation/pages/admin/admin_page";
import { ACCESS_TOKEN, CLIENT_ID } from "core/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";

function AppRouter(props) {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loaderActions.toggleLoader(true));
    var currentBrowserUrl = window.location.href;

    console.log(currentBrowserUrl);

    if (currentBrowserUrl.includes("access_token")) {
      var myUrl = new URL(window.location.href.replace(/#/g, "?"));
      var access_token = myUrl.searchParams.get("access_token");
      console.log(access_token);
      isTokenValid(access_token).then((isValid) => {
        console.log("isValid", isValid);
      });
    } else {
      var token = localStorage.getItem(ACCESS_TOKEN);

      isTokenValid(token).then((isValid) => {
        if (!isValid && !currentBrowserUrl.includes("/login")) {
          localStorage.removeItem(CLIENT_ID);
          navigateTo(LOGIN_PAGE_ROUTE);
        }
      });
    }
    dispatch(loaderActions.toggleLoader(false));
  }, []);

  const isTokenValid = async (token) => {
    return await axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status == 200) {
          return true;
        }
        return false;
      })
      .catch(() => {
        return false;
      });
  };

  return (
    <Routes>
      <Route path={LOGIN_PAGE_ROUTE} element={<LoginPage />} />
      <Route path={DASHBOARD_PAGE_ROUTE} element={<DashboardPage />} />
      <Route path={ADMIN_PAGE_ROUTE} element={<AdminPage />} />
      <Route path="/*" element={<DashboardPage />} />
    </Routes>
  );
}

export default AppRouter;
