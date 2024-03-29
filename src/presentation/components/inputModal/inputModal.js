import React, { useState } from "react";
import "./inputModal.css";
import { ButtonGroup, Dropdown, DropdownButton, Toast } from "react-bootstrap";
import { toast } from "react-toastify";

function InputModal(props) {
  var initValue = props.initValue;
  var getInputCallback = props.getInputCallback;
  var closeModalCallback = props.closeModalCallback;
  var title = props.title;
  var subTitle = props.subTitle;
  var [modalErrorMessage, setModalErrorMessage] = useState("");
  var clientIDList = props.clientIDList;

  const handleSubmit = (event) => {
    event.preventDefault();
    var userInput = event.target.clientID.value;
    if (userInput == "") {
      toast.error("Input can't be null", {
        toastId: "errorToast",
      });
    } else {
      getInputCallback(userInput);
    }
  };

  return (
    <div>
      <div className="modal-bg"></div>
      <div className="input-modal">
        <img
          className="input-modal-close"
          src="assets/icons/close.svg"
          onClick={() => {
            if (initValue == "" && title.includes("clientID")) {
              setModalErrorMessage("Please enter a Client ID to proceed");
            } else {
              closeModalCallback();
            }
          }}
        ></img>
        <p className="heading3">{title}</p>
        <p className="subHeading margin-top-8">{subTitle}</p>
        {clientIDList == null ? (
          <form className="inputModal-textfield-flex" onSubmit={handleSubmit}>
            <input
              type="text"
              name="clientID"
              className="inputModal-textfield"
              placeholder={initValue}
            />
            <input
              type="submit"
              className="inputModal-button buttonText"
            ></input>
          </form>
        ) : (
          <DropdownButton
            as={ButtonGroup}
            key="0"
            id="000"
            size="lg"
            title={initValue != "" ? initValue : "Select client id"}
            variant=""
            bsPrefix={"client-id-dropdown" + " " + "buttonText"}
            onSelect={(selectedIndex) => {
              getInputCallback(clientIDList[selectedIndex]);
            }}
            children={clientIDList.map((item, idx) => (
              <Dropdown.Item key={idx} eventKey={idx}>
                {item}
              </Dropdown.Item>
            ))}
          ></DropdownButton>
        )}

        {modalErrorMessage != "" && (
          <p className="input-modal-error">{modalErrorMessage}</p>
        )}
      </div>
    </div>
  );
}

export default InputModal;
