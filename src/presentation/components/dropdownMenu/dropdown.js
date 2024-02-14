import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";

function DropdownComponent(props) {
  var itemList = props.itemList;
  var customClass = props.customClass;
  var onChangeCallback = props.onChangeCallback;
  var selectedItemIndex = props.selectedItemIndex;

  return (
    <>
      <DropdownButton
        as={ButtonGroup}
        key="0"
        id="000"
        size="lg"
        title={itemList[selectedItemIndex]}
        variant=""
        bsPrefix={customClass + " " + "buttonText"}
        onSelect={(selected) => {
          onChangeCallback(parseInt(selected));
        }}
      >
        {itemList.map((item, idx) => (
          <Dropdown.Item eventKey={idx} key={idx}>{item}</Dropdown.Item>
        ))}
      </DropdownButton>
    </>
  );
}

export default DropdownComponent;
