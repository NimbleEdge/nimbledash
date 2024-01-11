import React, { useState } from 'react';
import './searchComponent.css';

function fuzzySearch(input, listOfStrings, maxResults = 8) {
    const lowerInput = input.toLowerCase();
    return listOfStrings.filter(item => item.toLowerCase().includes(lowerInput)).slice(0, maxResults);
  }

const Search = ({list, handleItemClick}) => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredItems, setFilteredItems] = useState(list.slice(0, 8));
  //const [selectedItems, setSelectedItems] = useState([]);

  const handleInputChange = (event) => {
    const searchText = event.target.value;
    setSearchInput(searchText);
    const filtered = fuzzySearch(searchText, list);
    setFilteredItems(filtered);
  };

  // const handleItemClick = (name) => {
  //   setSelectedItems(prevSelectedItems => {
  //     if (prevSelectedItems.includes(name)) {
  //       // Remove the name if it's already selected
  //       return prevSelectedItems.filter(selectedName => selectedName !== name);
  //     } else {
  //       // Add the name if it's not already selected
  //       return [...prevSelectedItems, name];
  //     }
  //   });
  // };

  return (
    <div>
      <input className="input-box" type="text" value={searchInput} onChange={handleInputChange} placeholder="Search models" />
        <div className="filtered-items-list">
            {filteredItems.map((item) => (
                <div key={item} className={`item-box`} onClick={(e) => handleItemClick(item)}>
                    <div className={`item-text`}>{item}</div>
                </div>
            ))}
        </div>
    </div>
  );
}

export default Search;
