import React, { useEffect } from "react";
import "./dashboard_card.css";
import { InfinitySpin } from "react-loader-spinner";
import { ACCENT_COLOR } from "core/constants";

function DashboardCard(props) {
  var cardIconAddress = props.cardIconAddress;
  var cardInfoTitle = props.cardInfoTitle;
  var cardInfoSubtitle = props.cardInfoSubtitle;
  var cardText = props.cardText;
  var cardSubText = props.cardSubText;

  useEffect(() => {
    console.log("get", props.some);
  });

  return (
    <div className="number-card">
      {props.loading ? (
        <div className="loader">
          <InfinitySpin color={ACCENT_COLOR}></InfinitySpin>
        </div>
      ) : (
        <div>
          <div className="heading-row">
            <img className="card-icon" src={cardIconAddress}></img>
            <div className="card-info">
              <p className="bodyText">{cardInfoTitle}</p>
              <p className="subHeading2">{cardInfoSubtitle}</p>
            </div>
          </div>
          <p className="headline card-number">{cardText}</p>
          <p className="subHeading2 card-subtext">{cardSubText}</p>
        </div>
      )}
    </div>
  );
}

export default DashboardCard;
