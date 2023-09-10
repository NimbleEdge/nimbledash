import axios from "axios";
import {
  APP_BASE_URL,
  ACCESS_TOKEN,
  CLIENT_ID,
  USER_EMAIL,
  COGNITO_USERNAME,
} from "core/constants";
import DropdownComponent from "presentation/components/dropdownMenu/dropdown";
import { loaderActions } from "presentation/redux/stores/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./contact_page.css";

function ContactPage() {
  const dispatch = useDispatch();
  const [onCallList, setOnCallList] = useState({
    primary: {
      name: "Kushal",
      email: "kushal.patil@nimbleedgehq.ai",
      mobile: "+91-9560118127",
    },
    secondary: {
      name: "Saket",
      email: "saket.harsh@nimbleedgehq.ai",
      mobile: "+91-7209338593",
    },
  });

  useEffect(() => {
    fetchModelList();
  }, []);

  const fetchModelList = async () => {
    dispatch(loaderActions.toggleLoader(true));

    await axios
      .get(`${APP_BASE_URL}/dms/api/v1/oncall`, {
        headers: {
          AuthMethod: "Cognito",
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: localStorage.getItem(CLIENT_ID),
          TokenId: localStorage.getItem(USER_EMAIL),
          CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
        },
      })
      .then((res) => {
        var listOfModels = res.data.models;
        listOfModels.reverse();
        // setModelList(listOfModels);
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
    <div className="adminPage">
      <div className="admin-page-left-pane">
        <div className="page-title">
          <p className="heading3">Contact Us</p>
          <p className="subHeading">Our Current On Call Engineers.</p>
        </div>

        <p className="heading4 pane-title">Details.</p>

        {Object.keys(onCallList).map((key, index) => (
          <div className="model-holder-card">
            <div className="left-content">
              <p className="heading5">{onCallList[key]["name"]}</p>
              <p className="subHeading3">{onCallList[key]["email"]}</p>
            </div>
            <div className="right-content" onClick={() => {}}>
              <p className="heading5">{onCallList[key]["mobile"]}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="divider flex-vertical"></div>
    </div>
  );
}

export default ContactPage;
