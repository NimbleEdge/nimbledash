import React, { useEffect, useRef, useState } from 'react';
import './searchComponent.css';
import Table, { TABLE_STYLE_TYPE } from '../Table/table';
import { RectCard } from '../RectangularCards/card';

function fuzzySearchList(input, searchList) {
    if(input == '') return searchList;
    const lowerInput = input.toLowerCase();
    const reducedList = [];
    searchList.forEach(item => {
      if(item.searchText.toLowerCase().includes(lowerInput)) {
        reducedList.push({...item})
      }
    });
  //   reducedList.sort((item1, item2) => {
  //     if (item1.selected === item2.selected) {
  //       return 0;
  //     } else if (item1.selected) {
  //       return -1; 
  //     } else {
  //       return 1;
  //     }
  // });
    return reducedList;
}

function fuzzySearchTable(input, tableData) {
  const filteredRows = [];
  const lowerInput = input.toLowerCase();
  tableData.body.forEach(row => {
    for(let idx = 0; idx < row.length; idx++) {
      const col = row[idx];
      if(col.data && col.data.text && col.data.text.toLowerCase().includes(lowerInput)) {
          filteredRows.push(row);
        return;
      }
    }
  })
  return filteredRows;
}

export const ITEMS_LAYOUT = {
  SingleRow: 'SingleRow',
  MultipleRows: 'MultipleRows'
}

const Search = ({searchList, handleItemClick = null, placeholder = "Search", itmesLayout = ITEMS_LAYOUT.SingleRow}) => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredItems, setFilteredItems] = useState(() => {
    return fuzzySearchList(searchInput, searchList)
  });

  useEffect(() => {
    const updatedFilteredItems = fuzzySearchList(searchInput, searchList);
    setFilteredItems([...updatedFilteredItems]);
  }, [searchInput, searchList]);

  const handleInputChange = (event) => {
    const searchText = event.target.value;
    setSearchInput(searchText);
  };

  const handleItemClickInternal = (card) => {
    if(handleItemClick != null) handleItemClick(card);
  }

  return (
    <div className='search-component'>
      <input className="input-box-search-list" type="text" value={searchInput} onChange={handleInputChange} placeholder={placeholder} />
        <div className={itmesLayout == ITEMS_LAYOUT.SingleRow ? "filtered-items-list-single-row" : "filtered-items-list-multiple-row"}>
            {filteredItems.map(item =>
                <RectCard key={item.searchText} card={{title: item.searchText}} selectable={true} handleClick={handleItemClickInternal} selected={item.selected ? true : false} customStyle={itmesLayout == ITEMS_LAYOUT.OneHorizontalRow ? {} : {box: {marginRight: '15px'}}}/>
            )}
        </div>
    </div>
  );
}

export const SearchTable = ({tableData, placeholder = "Search"}) => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredItems, setFilteredItems] = useState(tableData.body);

  const handleInputChange = (event) => {
    const searchText = event.target.value;
    setSearchInput(searchText);
    const filtered = fuzzySearchTable(searchText, tableData);
    setFilteredItems(filtered);
  };

  return (
    <div className='search-table-component'>
      <input className="input-box-search-table" type="text" value={searchInput} onChange={handleInputChange} placeholder={placeholder} />
      <div className='filtered-items-table'>
        <Table data={{headers: tableData.headers, body: filteredItems}} STYLE={TABLE_STYLE_TYPE.STYLE2} />
      </div>
    </div>
  );
}

export default Search;
