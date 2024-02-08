import '../../../../../common.css';
import '../../admin_page.css';
import './TagCreationAndUpdation.css';
import React, { useEffect, useState } from "react";


const DisplayCards = ({selectedModels, handleModelVersionRemoval}) => {
    const [cards, setCards] = useState([]);
    
    useEffect(() => {
        const generatedCards = [];
        for(const model in selectedModels) {
            for(const version in selectedModels[model]) {
                generatedCards.push({title: model, subtitle: version, preAttached: selectedModels[model][version]['preAttached']});
            }
        }
        generatedCards.sort((card1, card2) => {
            if (card1.preAttached === card2.preAttached) {
              return 0;
            } else if (card1.preAttached) {
              return 1; // Object with flag true comes first
            } else {
              return -1; // Object with flag false comes later
            }
        });
        setCards(generatedCards);
    }, [selectedModels])

    return (
        <div className="cards-list">
            {cards.map((card) => (
                <div key={card.title + card.subtitle} className={`card-box`}>
                    {!card.preAttached && <div className={`close-card`} onClick={() => {
                        handleModelVersionRemoval(card.title, card.subtitle)
                    }}>X</div>}
                    <div className={`card-title`}>{card.title}</div>
                    <div className={`card-subtitle`}>{'v' + card.subtitle}</div>
                </div>
            ))}
        </div>
    )
}

export default DisplayCards;