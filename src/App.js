import logo from "./logo.svg";
import "./App.css";
import AppRouter from "presentation/routes/app_router";
import React, { useEffect, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { loaderActions } from "presentation/redux/stores/store";
import { InfinitySpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { ACCENT_COLOR } from "core/constants";
import { ToastContainer } from "react-toastify";
import SideBar from "presentation/components/sideBar/side_bar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (process.env.REACT_APP_ENV_NAME == "STAGING") {
      console.log("STAGE ENV STARTED!!!");
    } else if (process.env.REACT_APP_ENV_NAME == "DEVELOPMENT") {
      console.log("DEV ENV STARTED!!!");
    }
  }, []);
  return (
    <GoogleOAuthProvider clientId="405865671851-44bn30c6pc9ltep4ikkquabb1o9ajah3.apps.googleusercontent.com">
      <div className="App">
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          limit={0}
        />
        {useSelector(
          (state) =>
            // @ts-ignore
            state.loaderReducer.isLoading
        ) && (
          <div className="loader-wrapper">
            <InfinitySpin color={ACCENT_COLOR}></InfinitySpin>
          </div>
        )}
        <SideBar setIsAuthenticated={setIsAuthenticated} ></SideBar>
        <AppRouter isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} ></AppRouter>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
