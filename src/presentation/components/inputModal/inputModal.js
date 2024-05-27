import React, { useEffect, useState } from "react";
import "./inputModal.css";
import { ButtonGroup, Dropdown, DropdownButton, Toast } from "react-bootstrap";
import { toast } from "react-toastify";

function InputModal(props) {
  var initClientID = props.initClientID;
  var initOrgName = props.initOrgName;
  var handleOrgChange = props.orgSelectionCallback;
  var handleClientIDChange = props.clientIdSelectionCallback;
  var closeModalCallback = props.closeModalCallback;

  var title = props.title;
  var subTitle = props.subTitle;
  var [modalErrorMessage, setModalErrorMessage] = useState("");
  var clientIDList = props.clientIDList;
  var orgDetails = props.orgs;
  const [orgNames, setOrgNames] = useState([]);
  const orgIds = Object.keys(orgDetails);

  useEffect(() => {
    if (orgIds.length == 0) {
      handleOrgChange(orgIds[0]);
      return;
    }

    var temp = [];
    for (var org in orgDetails) {
      temp.push(orgDetails[org].name);
    }

    setOrgNames(temp);

  }, [orgDetails]);

  const getOrgId = (name) => {
    for (var orgId in orgDetails) {
      if (orgDetails[orgId].name == name) {
        return orgId;
      }
    }

    console.log("Can't find org");
    return -1;
  }

  return (
    <div>
      <div className="modal-bg"></div>
      <div className="input-modal">
        <img
          className="input-modal-close"
          src="assets/icons/close.svg"
          onClick={() => {
            if (initClientID == "" && title.includes("clientID")) {
              setModalErrorMessage("Please enter a Client ID to proceed");
            } else {
              closeModalCallback();
            }
          }}
        ></img>
        <p className="heading3">{title}</p>
        <p className="subHeading margin-top-8">{subTitle}</p>

        <div className="flex">
          {orgIds.length!=1 && <DropdownButton
            as={ButtonGroup}
            key="0"
            id="000"
            size="lg"
            title={initOrgName != "" ? initOrgName : "Select org name"}
            variant=""
            bsPrefix={"client-id-dropdown" + " " + "buttonText"}
            onSelect={(selectedIndex) => {
              handleOrgChange(getOrgId(orgNames[selectedIndex]))
            }}
            children={orgNames.map((item, idx) => (
              <Dropdown.Item key={idx} eventKey={idx}>
                {item}
              </Dropdown.Item>
            ))}
          ></DropdownButton>}

          <DropdownButton
            as={ButtonGroup}
            key="0"
            id="000"
            size="lg"
            title={initClientID != "" ? initClientID : "Select client id"}
            variant=""
            bsPrefix={"client-id-dropdown" + " " + "buttonText"}
            onSelect={(selectedIndex) => {
              handleClientIDChange(clientIDList[selectedIndex]);
            }}
            children={clientIDList.map((item, idx) => (
              <Dropdown.Item key={idx} eventKey={idx}>
                {item}
              </Dropdown.Item>
            ))}
          ></DropdownButton>
        </div>


        {modalErrorMessage != "" && (
          <p className="input-modal-error">{modalErrorMessage}</p>
        )}
      </div>
    </div>
  );
}

export default InputModal;
