import { element } from 'prop-types';
import React, { useState } from 'react';

const ClickableCard = ({ title, subtitle, isModelSelection, isAlreadySelected, onSelect }) => {
    return (
        <div onClick={() => {
            onSelect();
        }}>
            {isAlreadySelected ? (
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

export function SelectionModal(data, preselectedIndex, onSelectionChange) {
    const [selectedIndex, setSelectedIndex] = useState(preselectedIndex);
    const [searchKeyword, setSearchKeyword] = useState("");

    return (
        <form className="expanded">
            <p className="modalSubHeading">Select Script</p>
            <input
                id="searchScript"
                type="text"
                name="searchScript"
                className="model-upload-custom-dropdown itemsPaddingVerySmall"
                placeholder="Search scripts"
                value={searchKeyword}
                onChange={(res) => {
                    setSearchKeyword(res.target.value);
                }}
            />
            <div className="selectableCardsRow itemsPadding">

                {selectedIndex != -1 && <ClickableCard onSelect={() => {

                }} title={data[selectedIndex] != null && (data[selectedIndex].version || data[selectedIndex].name)} subtitle={`N/A users`} isModelSelection={false} isAlreadySelected={true} />
                }

                {data.map((obj, index) => {
                    let title = obj.version || obj.name;
                    if (index != selectedIndex && title.includes(searchKeyword)) {
                        return <ClickableCard onSelect={() => {
                            setSelectedIndex(index);
                            onSelectionChange(index);
                        }} key={index} title={title} subtitle={`N/A users`} isModelSelection={false} isAlreadySelected={false} />;
                    }
                })}
            </div>
        </form>
    );
}

const checkIfModelIsAlreadySelected = (data, selectedIndexes, currentModelName) => {
    for (let index of selectedIndexes) {
        if (data[index].modelName == currentModelName) {
            return true;
        }
    }

    return false;
}

export function MultiSelectionModal(data, preselected, onSelectionChange) {
    const [selected, setSelected] = useState(preselected);
    const [currentClickIndex, setCurrentClickIndex] = useState(-1);
    const [searchKeyword, setSearchKeyword] = useState("");
    var modelsRendered = [];


    return (
        <form className="expanded">
            <p className="modalSubHeading">Selected Models</p>

            {currentClickIndex == -1 && (<div>
                <div className="selectableCardsRowVertical itemsPadding">
                    {selected.length == 0 && <ClickableCard onSelect={() => { }} title={"No selection"} subtitle={`Please select models from below`} isModelSelection={true} isAlreadySelected={undefined} />}
                    {selected.map((selectionIndex) => {
                        return <ClickableCard onSelect={() => {
                            var newSelection = selected.filter(num => num !== selectionIndex);
                            setSelected(newSelection);
                            onSelectionChange(newSelection);

                        }} key={selectionIndex} title={data[selectionIndex].modelName} subtitle={data[selectionIndex].modelVersion} isModelSelection={true} isAlreadySelected={true} />;
                    })}
                </div>

                <p className="modalSubHeading">Select more</p>
                <input
                    id="searchUnselectedModel"
                    type="text"
                    name="searchUnselectedModel"
                    className="model-upload-custom-dropdown itemsPaddingVerySmall fadedBackground"
                    placeholder="Search models"
                    value={searchKeyword}
                    onChange={(res) => {
                        setSearchKeyword(res.target.value);
                    }}
                />
                <div className="selectableCardsRowHalf itemsPadding">
                    {data.map((obj, index) => {
                        if (obj.modelName.includes(searchKeyword) && !checkIfModelIsAlreadySelected(data, selected, obj.modelName) && !modelsRendered.includes(obj.modelName)) {
                            modelsRendered.push(obj.modelName);
                            return <ClickableCard onSelect={() => {
                                setCurrentClickIndex(index);
                            }} key={index} title={obj.modelName} subtitle={`N/A users`} isModelSelection={false} isAlreadySelected={undefined} />;
                        }
                    })}
                </div>
            </div>)}

            {currentClickIndex != -1 && (
                <div className="selectableCardsRow itemsPadding">
                    {data.map((obj, index) => {
                        if (obj.modelName == data[currentClickIndex].modelName) {
                            return <ClickableCard onSelect={() => {
                                if (!selected.includes(index)) {
                                    var newSelection = [...selected, index];
                                    setSelected(newSelection);
                                    onSelectionChange(newSelection);
                                }
                                setCurrentClickIndex(-1);
                            }} key={index} title={obj.modelVersion} subtitle={`N/A users`} isModelSelection={false} isAlreadySelected={undefined} />;
                        }
                    })}
                </div>
            )}
        </form>
    );
}
