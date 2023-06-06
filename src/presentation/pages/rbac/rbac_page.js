import React, { useEffect, useState } from "react";
import "./rbac_page.css";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import InputModal from "presentation/components/inputModal/inputModal";
import axios from "axios";
import {
  ACCESS_TOKEN,
  APP_BASE_URL,
  CLIENT_ID,
  PermissionEnum,
  USER_EMAIL,
} from "core/constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";

function RBACPage() {
  var [isModalVisible, setModalVisiblity] = useState(false);
  var [userList, setUserList] = useState([]);
  //   var [clientId,setClientID] = useState("");
  const dispatch = useDispatch();

  const onEnterEmail = (input) => {
    addUser(input);
  };

  const closeModalCallback = () => {
    setModalVisiblity(false);
  };

  const listUsers = async () => {
    dispatch(loaderActions.toggleLoader(true));
    await axios
      .get(`${APP_BASE_URL}/mds/api/v1/admin/users`, {
        headers: {
          AuthMethod: "Cognito",
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: localStorage.getItem(CLIENT_ID),
          TokenId: localStorage.getItem(USER_EMAIL),
        },
      })
      .then((res) => {
        console.log(res);
        setUserList(res.data.users);
      })
      .catch((e) => {
        console.log(e);
        var errorDescription = e.response.data?.error?.description;
        if (errorDescription != null) toast.error(errorDescription);
        else toast.error("Something Went Wrong.");
      });
    dispatch(loaderActions.toggleLoader(false));
  };

  const addUser = async (inputEmail) => {
    dispatch(loaderActions.toggleLoader(true));
    await axios
      .post(
        `${APP_BASE_URL}/mds/api/v1/admin/user`,
        {
          email: inputEmail,
          permission: PermissionEnum.READ,
        },
        {
          headers: {
            AuthMethod: "Cognito",
            Token: localStorage.getItem(ACCESS_TOKEN),
            ClientId: localStorage.getItem(CLIENT_ID),
            TokenId: localStorage.getItem(USER_EMAIL),
          },
        }
      )
      .then((res) => {
        console.log(res);
        setModalVisiblity(false);
        window.location.reload();
      })
      .catch((e) => {
        dispatch(loaderActions.toggleLoader(false));
        console.log(e);
        var errorDescription = e.response.data?.error?.description;
        if (errorDescription != null) toast.error(errorDescription);
        else toast.error("Something Went Wrong.");
      });
  };

  const updateUserPermission = async (inputEmail, permission) => {
    dispatch(loaderActions.toggleLoader(true));
    await axios
      .put(
        `${APP_BASE_URL}/mds/api/v1/admin/user`,
        {
          email: inputEmail,
          permission: permission,
        },
        {
          headers: {
            AuthMethod: "Cognito",
            Token: localStorage.getItem(ACCESS_TOKEN),
            ClientId: localStorage.getItem(CLIENT_ID),
            TokenId: localStorage.getItem(USER_EMAIL),
          },
        }
      )
      .then((res) => {
        dispatch(loaderActions.toggleLoader(false));
        toast.success("Permission updated succesfully.");
      })
      .catch((e) => {
        dispatch(loaderActions.toggleLoader(false));
        console.log(e);
        var errorDescription = e.response.data?.error?.description;
        if (errorDescription != null) toast.error(errorDescription);
        else toast.error("Something Went Wrong.");
      });
  };

  const deleteUser = async (inputEmail) => {
    console.log("clientID", inputEmail);
    dispatch(loaderActions.toggleLoader(true));
    await axios
      .delete(`${APP_BASE_URL}/mds/api/v1/admin/user`, {
        headers: {
          AuthMethod: "Cognito",
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: localStorage.getItem(CLIENT_ID),
          TokenId: localStorage.getItem(USER_EMAIL),
        },
        data: {
          email: inputEmail,
        },
      })
      .then((res) => {
        console.log(res);
        // window.location.reload();
      })
      .catch((e) => {
        dispatch(loaderActions.toggleLoader(false));
        console.log(e);
        var errorDescription = e.response.data?.error?.description;
        if (errorDescription != null) toast.error(errorDescription);
        else toast.error("Something Went Wrong.");
      });
  };

  useEffect(() => {
    listUsers();
  }, []);

  return (
    <div className="rbacPage">
      {isModalVisible && (
        <InputModal
          title={"Enter email"}
          subTitle={"Email must be from the same organisation"}
          initValue={""}
          getInputCallback={(input) => {
            onEnterEmail(input);
          }}
          closeModalCallback={closeModalCallback}
        ></InputModal>
      )}

      {!isModalVisible && (
        <div className="admin-page-left-pane">
          <div className="page-title">
            <p className="heading3">Superuser Panel</p>
            <p className="subHeading">Role Based Access Control.</p>
          </div>

          <div className="rbac-table">
            <div className="rbac-table-header">
              <p className="heading4 pane-title">Email</p>
              <div className="rbac-table-controls-header">
                <p className="heading4 pane-title rbac-control-width-container">
                  Read Access
                </p>
                <p className="heading4 pane-title rbac-control-width-container">
                  Write Access
                </p>
                <p className="heading4 pane-title rbac-control-width-container">
                  Delete User
                </p>
              </div>
            </div>

            <div className="rbac-table-body">
              {userList.map((user, index) => (
                <div key={index} className="rbac-table-row">
                  <a
                    href={`mailto:${user.email}`}
                    className="heading7 rbac-email"
                  >
                    {user.email}
                  </a>
                  <div className="rbac-controls">
                    <div className="rbac-control-width-container">
                      <Toggle
                        className="toggle-button"
                        defaultChecked={true}
                        icons={false}
                        aria-label="No label tag"
                        disabled={true}
                        onChange={() => {}}
                      />
                    </div>
                    <div className="rbac-control-width-container">
                      <Toggle
                        className="toggle-button"
                        icons={false}
                        defaultChecked={
                          user.permission == PermissionEnum.READ_WRITE
                        }
                        aria-label="No label tag"
                        onChange={(permission) => {
                          var isChecked = permission.target.checked;
                          if (isChecked) {
                            updateUserPermission(
                              user.email,
                              PermissionEnum.READ_WRITE
                            );
                          } else {
                            updateUserPermission(
                              user.email,
                              PermissionEnum.READ
                            );
                          }
                          console.log(permission.target.checked);
                        }}
                      />
                    </div>
                    <div
                      className="rbac-control-width-container rbac-trash"
                      onClick={() => {
                        deleteUser(user.email);
                      }}
                    >
                      <img src="/assets/icons/trash.svg"></img>
                    </div>
                  </div>
                </div>
              ))}

              <div
                className="rbac-table-row add-rbac-user"
                onClick={() => {
                  console.log("click tohho rha hai");
                  setModalVisiblity(true);
                }}
              >
                <p className="subHeading4 rbac-email">+ Add new user</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RBACPage;
