import React, { useState } from 'react';
import './searchComponent.css';
import Table, { TABLE_STYLE_TYPE } from '../Table/table';

function fuzzySearchList(input, listOfStrings, maxResults = 5) {
    const lowerInput = input.toLowerCase();
    return listOfStrings.filter(item => item.toLowerCase().includes(lowerInput)).slice(0, maxResults);
}

function fuzzySearchTable(input, tableData, maxResults = 10) {
  const filteredRows = [];
  const lowerInput = input.toLowerCase();
  tableData.body.forEach(row => {
    row.forEach(col => {
      if(col.data && col.data.text && col.data.text.toLowerCase().includes(lowerInput)) {
        filteredRows.push(row);
        return;
      }
    })
  })
  return filteredRows.slice(0, maxResults);
}

const Search = ({list, handleItemClick, placeholder = "Search", maxResults = 5}) => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredItems, setFilteredItems] = useState(list.slice(0, maxResults));

  const handleInputChange = (event) => {
    const searchText = event.target.value;
    setSearchInput(searchText);
    const filtered = fuzzySearchList(searchText, list, maxResults);
    setFilteredItems(filtered);
  };

  return (
    <div className='search-component'>
      <input className="input-box-search-list" type="text" value={searchInput} onChange={handleInputChange} placeholder={placeholder} />
        <div className="filtered-items-list">
            {filteredItems.map(item =>
                (<div key={item} className={`item-box`} onClick={(e) => handleItemClick && handleItemClick(item)}>
                    <div className={`item-text`}>{item}</div>
                </div>)
            )}
        </div>
    </div>
  );
}

export const SearchTable = ({tableData, placeholder = "Search", maxResults = 5}) => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredItems, setFilteredItems] = useState(tableData.body.slice(0, maxResults));

  const handleInputChange = (event) => {
    const searchText = event.target.value;
    setSearchInput(searchText);
    const filtered = fuzzySearchTable(searchText, tableData,maxResults);
    setFilteredItems(filtered);
  };

  return (
    <div className='search-component'>
      <input className="input-box-search-table" type="text" value={searchInput} onChange={handleInputChange} placeholder={placeholder} />
      <div className='filtered-items-table'>
        <Table data={{headers: tableData.headers, body: filteredItems}} STYLE={TABLE_STYLE_TYPE.STYLE2} />
      </div>
    </div>
  );
}

export default Search;
