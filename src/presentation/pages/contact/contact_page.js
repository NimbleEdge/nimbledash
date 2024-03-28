import axios from "axios";
import {
  ACCESS_TOKEN,
  CLIENT_ID,
  USER_EMAIL,
  COGNITO_USERNAME,
  APP_BASE_DMS_URL,
  AUTH_METHOD,
} from "core/constants";
import DropdownComponent from "presentation/components/dropdownMenu/dropdown";
import { loaderActions } from "presentation/redux/stores/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./contact_page.css";
import { getAuthMethod } from "core/utils";

function ContactPage() {
  const dispatch = useDispatch();
  const [onCallList, setOnCallList] = useState({
  });

  useEffect(() => {
    fetchOnCallList();
  }, []);

  const fetchOnCallList = async () => {
    dispatch(loaderActions.toggleLoader(true));

    await axios
      .get(`${APP_BASE_DMS_URL}/dms/api/v1/oncall`, {
        headers: {
          AuthMethod: localStorage.getItem(AUTH_METHOD),
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: localStorage.getItem(CLIENT_ID),
          TokenId: localStorage.getItem(USER_EMAIL),
          CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
        },
      })
      .then((res) => {
        setOnCallList(res.data);
      })
      .catch((e) => {
        console.log(e);
        var errorDescription = e.response.data?.error?.description;
        if (errorDescription != null)
          toast.error(errorDescription, {
            toastId: "errorToast",
          });
        else
          toast.error("Something Went Wrong.", {
            toastId: "errorToast",
          });
      });
    dispatch(loaderActions.toggleLoader(false));
  };

  return (
    <div className="contactPage">
      <div className="admin-page-left-pane">
        <div className="page-title">
          <p className="heading3">Contact Us</p>
          <p className="subHeading">In Case Of Any Production Issues.</p>
        </div>

        <p className="heading4 pane-title">Details.</p>

        {Object.keys(onCallList).length != 0 && (
          <div>
            <div className="model-holder-card">
              <div className="left-content">
                <p className="heading5">{onCallList["primary"]["name"]}</p>
                <p className="subHeading3">{onCallList["primary"]["email"]}</p>
              </div>
              <div className="right-content" onClick={() => {}}>
                <p className="heading5">{onCallList["primary"]["mobile"]}</p>
              </div>
            </div>

            <div className="model-holder-card">
              <div className="left-content">
                <p className="heading5">{onCallList["secondary"]["name"]}</p>
                <p className="subHeading3">
                  {onCallList["secondary"]["email"]}
                </p>
              </div>
              <div className="right-content" onClick={() => {}}>
                <p className="heading5">{onCallList["secondary"]["mobile"]}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="divider flex-vertical"></div>
    </div>
  );
}

export default ContactPage;
