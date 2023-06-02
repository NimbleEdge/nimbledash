import React, { useState } from "react";
import "./rbac_page.css";
import Toggle from "react-toggle";
import "react-toggle/style.css";
import InputModal from "presentation/components/inputModal/inputModal";

function RBACPage() {
  var [isModalVisible, setModalVisiblity] = useState(false);

  const handleClientIDChange = (input) => {};

  const closeModalCallback = () => {
    setModalVisiblity(false);
  };

  return (
    <div className="rbacPage">
      {isModalVisible && (
        <InputModal
        title = {"Enter email"}
        subTitle = {"Email must be from the same organisation"}
          initValue={""}
          getInputCallback={() => {}}
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
                </div>
              </div>
            ))}

            <div className="rbac-table-row add-rbac-user" onClick={()=>{
                setModalVisiblity(true);
            }}>
              <p className="subHeading4 rbac-email">+ Add new user</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RBACPage;
