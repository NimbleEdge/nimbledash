import React, { useState } from 'react';

const ClickableCard = ({ title, subtitle, isModelSelection }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div onClick={() => setIsSelected(!isSelected)}>
      {isSelected ? (
        <SelectedCard title={title} subtitle={subtitle} renderCloseButton={isModelSelection} />
      ) : (
        <UnselectedCard title={title} subtitle={subtitle} />
      )}
    </div>
  );
};

const UnselectedCard = ({ title, subtitle }) => {
  return (
    <div className="selectableCard clickableItem">
      <img src={"/assets/icons/red_close.svg"} className='selectableCardCloseIcon' />
      <div className="selectableCardContent">
        <p className="selectableCardTitle">{title}</p>
        <p className="selectableCardSubTitle">{subtitle}</p>
      </div>
    </div>
  );
};

const SelectedCard = ({ title, subtitle, renderCloseButton = true }) => {
  return (
    <div className="selectableCard clickableItem">
      <img src={"/assets/icons/red_close.svg"} className={`selectableCardCloseIcon ${renderCloseButton ? "cardCanBeDeleted" : ""}`} />
      <div className="selectableCardContent cardIsSelected">
        <p className="selectableCardTitle">{title}</p>
        <p className="selectableCardSubTitle">{subtitle}</p>
      </div>
    </div>
  );
};

export function SelectionModal( data ) {
  return (
    <form className="expanded">
      <p className="modalSubHeading">Select Script</p>
      <input
        id="searchScript"
        type="text"
        name="searchScript"
        className="model-upload-custom-dropdown itemsPaddingVerySmall"
        placeholder="Search scripts"
      />
      <div className="selectableCardsRow itemsPadding">
        {data.map((obj, index) => {
          let title = "N/A";
          if (Object.keys(obj).includes("version")) {
            title = "v" + obj.version;
          } else if (Object.keys(obj).includes("name")) {
            title = obj.name;
          }
          return <ClickableCard key={index} title={title} subtitle={`N/A users`} isModelSelection={false} />;
        })}
      </div>
    </form>
  );
}

export function MultiSelectionModal() {
  return (
    <form className="expanded">
      <p className="modalSubHeading">Selected Models</p>
      <input
        id="searchSelectedModel"
        type="text"
        name="searchSelectedModel"
        className="model-upload-custom-dropdown itemsPaddingVerySmall"
        placeholder="Search models"
      />

      <div className="selectableCardsRow itemsPadding">
        <ClickableCard title="nude_net (v2.7.1)" subtitle="84883 users" isModelSelection={true} />
      </div>

      <p className="modalSubHeading">Select more</p>
      <input
        id="searchUnselectedModel"
        type="text"
        name="searchUnselectedModel"
        className="model-upload-custom-dropdown itemsPaddingVerySmall fadedBackground"
        placeholder="Search models"
      />
      <div className="selectableCardsRow itemsPadding">{/* Add content here */}</div>
    </form>
  );
}
