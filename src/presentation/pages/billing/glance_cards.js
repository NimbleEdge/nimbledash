import { getColorFromSeed } from "core/constants";
import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";

export default function GlanceCards(props) {
  var glanceCardsData = props.glanceCardsData;
  var interval = props.interval;
  var setInterval = props.setInterval;
  const [isDatePickerVisible, toggleDatePicker] = useState(false);

  const subtractDays = (date, days) => {
    date.setDate(date.getDate() - days);
    return date;
  };

  const [internalInterval, setInternalInterval] = useState({
    startDate: subtractDays(new Date(), 7),
    endDate: new Date(),
    key: "selection",
  });

  const handleSelect = (ranges) => {
    setInternalInterval(ranges["selection"])
  };

  function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear() % 100;

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    year = year < 10 ? '0' + year : year;

    return `${day}/${month}/${year}`;
  }

  return (
    <div className="glanceCardsRow">
      <div
        className="glanceCard"
        style={{ backgroundColor: getColorFromSeed("7").background }}
      >
        <img className="cardDatePicker" src={"/assets/icons/calendar.svg"} onClick={() => { toggleDatePicker(!isDatePickerVisible) }}></img>
        <p className="glanceCardTitle">{glanceCardsData[0]}</p>
        <p className="glanceCardSubTitle">
          Total ACU incurred from <span className="bold-span">{formatDate(interval['startDate'])}</span> to  <span className="bold-span">{formatDate(interval['endDate'])}</span>
        </p>

        {isDatePickerVisible && (
          <div>
            <DateRangePicker className="datePicker2" ranges={[internalInterval]} onChange={handleSelect} />
            <div className="datePickerApply2" onClick={async () => {
              toggleDatePicker(false);
              setInterval(internalInterval);
            }}>
              <p className="centerText">Apply</p>
            </div>
            <div className="datePickerCancel2" onClick={() => {
              toggleDatePicker(false);
              setInternalInterval(interval);
            }}>
              <p className="centerText">Cancel</p>
            </div>
          </div>
        )}
      </div>
      <div
        className="glanceCard"
        style={{ backgroundColor: getColorFromSeed("7").background }}
      >
        <p className="glanceCardTitle">{glanceCardsData[1]}</p>
        <p className="glanceCardSubTitle">Previous month ACU usage</p>
      </div>
      <div
        className="glanceCard"
        style={{ backgroundColor: getColorFromSeed("7").background }}
      >
        <p className="glanceCardTitle">{glanceCardsData[2]}</p>
        <p className="glanceCardSubTitle">ACU usage till date previous month</p>
      </div>
      <div
        className="glanceCard"
        style={{ backgroundColor: getColorFromSeed("7").background }}
      >
        <p className="glanceCardTitle">{glanceCardsData[3]}</p>
        <p className="glanceCardSubTitle">
          Projected ACU by the end of this month
        </p>
      </div>
    </div>
  );
}