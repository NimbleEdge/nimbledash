import { getColorFromSeed } from "core/constants";
import React from "react";

export default function GlanceCards(props) {
  var glanceCardsData = props.glanceCardsData;

  return (
    <div className="glanceCardsRow">
      <div
        className="glanceCard"
        style={{ backgroundColor: getColorFromSeed("7").background }}
      >
        <p className="glanceCardTitle">{glanceCardsData[0]}</p>
        <p className="glanceCardSubTitle">
          Total ACU incurred this month till date
        </p>
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
