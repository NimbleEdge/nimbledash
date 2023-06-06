import React, { useEffect, useState } from "react";
import "./rbac_page.css";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import InputModal from "presentation/components/inputModal/inputModal";
import axios from "axios";
import { APP_BASE_URL, CLIENT_ID } from "core/constants";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";

function RBACPage() {
  var [isModalVisible, setModalVisiblity] = useState(false);
  var [userList, setUserList] = useState([]);
  var clientId = "";
  const dispatch = useDispatch();

  const onEnterEmail = (input) => {};

  const closeModalCallback = () => {
    setModalVisiblity(false);
  };

  const listUsers = async () => {
    dispatch(loaderActions.toggleLoader(true));
    await axios
      .get(`${APP_BASE_URL}/mds/api/v1/private/clients/${clientId}/users`)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
        var errorDescription = e.response.data?.error?.description;
        if (errorDescription != null) toast.error(errorDescription);
        else toast.error("Something Went Wrong.");
      });
    dispatch(loaderActions.toggleLoader(false));
  };

  const addUser = async (inputEmail, permission) => {
    dispatch(loaderActions.toggleLoader(true));
    await axios
      .post(`${APP_BASE_URL}/mds/api/v1/private/clients/${clientId}/user`, {
        clientId: clientId,
        email: inputEmail,
        permission: permission,
      })
      .then((res) => {
        console.log(res);
        listUsers();
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
      .put(`${APP_BASE_URL}/mds/api/v1/private/clients/${clientId}/user`, {
        clientId: clientId,
        email: inputEmail,
        permission: permission,
      })
      .then((res) => {
        listUsers();
        console.log(res);
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
    dispatch(loaderActions.toggleLoader(true));
    await axios
      .delete(`${APP_BASE_URL}/mds/api/v1/private/clients/${clientId}/user`, {
        data: {
          clientId: clientId,
          email: inputEmail,
        },
      })
      .then((res) => {
        listUsers();
        console.log(res);
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
    clientId = localStorage.getItem(CLIENT_ID);
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
            <div className="rbac-table-row-primary">
              <a
                href="mailto:naman.anand.official@gmail.com?subject=we bout to revoke yo access"
                className="heading7 rbac-email"
              >
                naman.anand@nimbleedgehq.ai
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
                    defaultChecked={false}
                    aria-label="No label tag"
                    onChange={() => {}}
                  />
                </div>
                <div className="rbac-control-width-container rbac-trash">
                  <img src="/assets/icons/trash.svg"></img>
                </div>
              </div>
            </div>

            {[1, 1, 1, 1, 1].map(() => (
              <div className="rbac-table-row">
                <a
                  href="mailto:naman.anand.official@gmail.com?subject=we bout to revoke yo access"
                  className="heading7 rbac-email"
                >
                  saket.harsh@nimbleedgehq.ai
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
                      defaultChecked={false}
                      aria-label="No label tag"
                      onChange={() => {}}
                    />
                  </div>
                  <div className="rbac-control-width-container rbac-trash">
                    <img src="/assets/icons/trash.svg"></img>
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
    </div>
  );
}

export default RBACPage;
