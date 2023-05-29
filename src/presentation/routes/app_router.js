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
import { ACCESS_TOKEN, APP_BASE_URL, CLIENT_ID } from "core/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";
import { toast } from "react-toastify";

function AppRouter(props) {
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loaderActions.toggleLoader(true));
    var currentBrowserUrl = window.location.href;

    if (currentBrowserUrl.includes("access_token")) {
      var myUrl = new URL(window.location.href.replace(/#/g, "?"));
      var access_token = myUrl.searchParams.get("access_token");
      isTokenValid(access_token).then((isValid) => {
        if (!isValid) {
          navigateTo(LOGIN_PAGE_ROUTE);
          toast.error("Login failed. Please try again!");
        } else {
          toast.success("Login successful!");
          localStorage.setItem(ACCESS_TOKEN, access_token);
          navigateTo(DASHBOARD_PAGE_ROUTE);
        }
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
    if(token==null) return false;
    
    return await axios
      .get(`${APP_BASE_URL}/mds/api/v1/admin/ping`, {
        headers: {
          authMethod: "Cognito",
          Token: token,
        },
      })
      .then((res) => {
        console.log(res);
        if (res.status == 200) {
          return true;
        }
        else{
          return false;
        }
      })
      .catch((e) => {
        console.log(e);
        return false;
      });}


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
