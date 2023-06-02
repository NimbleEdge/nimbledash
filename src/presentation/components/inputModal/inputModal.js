import React, { useState } from "react";
import "./inputModal.css";

function InputModal(props) {
  var initValue = props.initValue;
  var getInputCallback = props.getInputCallback;
  var closeModalCallback = props.closeModalCallback;
  var title = props.title;
  var subTitle = props.subTitle;
  var [modalErrorMessage, setModalErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    var userInput = event.target.clientID.value;
    if (userInput == "") {
      setModalErrorMessage("Client ID can't be null");
    } else if (userInput == initValue) {
      setModalErrorMessage("Please enter a different Client ID");
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
        <form className="inputModal-textfield-flex" onSubmit={handleSubmit}>
          <input
            type="text"
            name="clientID"
            className="inputModal-textfield"
            placeholder={initValue}
          />
          <input type="submit" className="inputModal-button buttonText"></input>
        </form>
        {modalErrorMessage != "" && (
          <p className="input-modal-error">{modalErrorMessage}</p>
        )}
      </div>
    </div>
  );
}

export default InputModal;
