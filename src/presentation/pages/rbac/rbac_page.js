import React, { useEffect, useState } from "react";
import "./rbac_page.css";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import InputModal from "presentation/components/inputModal/inputModal";
import axios from "axios";
import {
  ACCESS_TOKEN,
  APP_BASE_MDS_URL,
  APP_BASE_URL,
  CLIENT_ID,
  PermissionEnum,
  USER_EMAIL,
} from "core/constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";
import { useNavigate } from "react-router-dom";
import { DASHBOARD_PAGE_ROUTE } from "presentation/routes/route-paths";
import DropdownComponent from "presentation/components/dropdownMenu/dropdown";
import { getAuthMethod } from "core/utils";

function RBACPage() {
  var [isModalVisible, setModalVisiblity] = useState(false);
  var [userList, setUserList] = useState([]);
  const [userEmailLocal, setUserEmailLocal] = useState("");
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const onEnterEmail = (input) => {
    addUser(input);
  };

  const closeModalCallback = () => {
    setModalVisiblity(false);
  };

  const listUsers = async () => {
    dispatch(loaderActions.toggleLoader(true));
    await axios
      .get(`${APP_BASE_MDS_URL}/mds/api/v1/admin/users`, {
        headers: {
          AuthMethod: getAuthMethod(),
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: localStorage.getItem(CLIENT_ID),
          TokenId: localStorage.getItem(USER_EMAIL),
        },
      })
      .then((res) => {
        var listOfObjects = res.data.users;
        listOfObjects.sort(function (a, b) {
          return a.email.localeCompare(b.email);
        });
        setUserList(listOfObjects);
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
        navigateTo(DASHBOARD_PAGE_ROUTE);
      });
    dispatch(loaderActions.toggleLoader(false));
  };

  const addUser = async (inputEmail) => {
    dispatch(loaderActions.toggleLoader(true));
    await axios
      .post(
        `${APP_BASE_MDS_URL}/mds/api/v1/admin/user`,
        {
          email: inputEmail,
          permission: PermissionEnum.READ,
        },
        {
          headers: {
            AuthMethod: getAuthMethod(),
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
        if (errorDescription != null)
          toast.error(errorDescription, {
            toastId: "errorToast",
          });
        else
          toast.error("Something Went Wrong.", {
            toastId: "errorToast",
          });
      });
  };

  const updateUserPermission = async (inputEmail, permission) => {
    dispatch(loaderActions.toggleLoader(true));
    await axios
      .put(
        `${APP_BASE_MDS_URL}/mds/api/v1/admin/user`,
        {
          email: inputEmail,
          permission: permission,
        },
        {
          headers: {
            AuthMethod: getAuthMethod(),
            Token: localStorage.getItem(ACCESS_TOKEN),
            ClientId: localStorage.getItem(CLIENT_ID),
            TokenId: localStorage.getItem(USER_EMAIL),
          },
        }
      )
      .then((res) => {
        dispatch(loaderActions.toggleLoader(false));
        toast.success("Permission updated succesfully.");
        window.location.reload();
      })
      .catch((e) => {
        dispatch(loaderActions.toggleLoader(false));
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
  };

  const deleteUser = async (inputEmail) => {
    await axios
      .delete(`${APP_BASE_MDS_URL}/mds/api/v1/admin/user`, {
        headers: {
          AuthMethod: getAuthMethod(),
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
        window.location.reload();
      })
      .catch((e) => {
        dispatch(loaderActions.toggleLoader(false));
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
  };

  useEffect(() => {
    setUserEmailLocal(localStorage.getItem(USER_EMAIL));
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

      {!isModalVisible && userEmailLocal != "" && (
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
                  Manage Permission
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
                      <DropdownComponent
                        customClass={"rbac-dropdown"}
                        itemList={["Read Only", "Read & Write", "Admin"]}
                        onChangeCallback={(index) => {
                          if (index == 0) {
                            updateUserPermission(
                              user.email,
                              PermissionEnum.READ
                            );
                          } else if (index == 1) {
                            updateUserPermission(
                              user.email,
                              PermissionEnum.READ_WRITE
                            );
                          } else if (index == 2) {
                            updateUserPermission(
                              user.email,
                              PermissionEnum.ADMIN
                            );
                          }
                        }}
                        selectedItemIndex={
                          user.permission == PermissionEnum.ADMIN
                            ? 2
                            : user.permission == PermissionEnum.READ_WRITE
                            ? 1
                            : 0
                        }
                      ></DropdownComponent>

                      {/* <Toggle
                        className="toggle-button"
                        icons={false}
                        defaultChecked={
                          user.permission == PermissionEnum.READ_WRITE || user.permission == PermissionEnum.ADMIN
                        }
                        disabled = {user.permission == PermissionEnum.ADMIN}
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
                      /> */}
                    </div>
                    {/* <div className="rbac-control-width-container">
                      <Toggle
                        className="toggle-button"
                        defaultChecked={user.permission == PermissionEnum.ADMIN}
                        icons={false}
                        aria-label="No label tag"
                        disabled={false}
                        onChange={(permission) => {
                          var isChecked = permission.target.checked;
                          if (isChecked) {
                            updateUserPermission(
                              user.email,
                              PermissionEnum.ADMIN
                            );
                          } else {
                            updateUserPermission(
                              user.email,
                              PermissionEnum.READ_WRITE
                            );
                          }
                        }}
                      />
                    </div> */}
                    <div
                      className="rbac-control-width-container rbac-trash"
                      title={
                        user.permission == PermissionEnum.ADMIN
                          ? "Superuser. Can't delete."
                          : ""
                      }
                      onClick={() => {
                        if (user.permission != PermissionEnum.ADMIN) {
                          deleteUser(user.email);
                        }
                      }}
                    >
                      <img
                        className="delete-user-icon"
                        src={
                          user.permission == PermissionEnum.ADMIN
                            ? "/assets/icons/super_user.svg"
                            : "/assets/icons/trash.svg"
                        }
                      ></img>
                    </div>
                  </div>
                </div>
              ))}

              <div
                className="rbac-table-row add-rbac-user"
                onClick={() => {
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
