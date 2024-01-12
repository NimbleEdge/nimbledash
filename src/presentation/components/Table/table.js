import React from 'react';
import PropTypes from 'prop-types';
import './table.css';
import '../../../common.css';


export const TextOnlyComponent = ({text}) => {
    return (
        <div className={`textOnlyComponent`}>{text}</div>
    )
}

TextOnlyComponent.propTypes = {
    text: PropTypes.string.isRequired
}

const TagComponent = ({text, color}) => {
    const bgColor = color || 'white';
    return (
        <div className={`textTag`} style={{backgroundColor: bgColor}}>{text}</div>
    );
}

TagComponent.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string.isRequired,
};

export const TagsListComponent = ({tags}) => {
    const colors = ['#D4F8D3', '#F8F4D3', '#D3E8F8', '#EAD3F8', '#F8D3D3'];
    const tagsReducedList = tags.slice(0, 5);
    let truncated = false;
    if(tags.length > 5) truncated = true;
    return (
        <div className={`tagsList flexRow`}>
            {tagsReducedList.map((tag, index) => 
                <TagComponent key={tag} text={tag} color={colors[index]} />
            )}
            {truncated && <div className='tagsListTruncated'>{'...more'}</div>}
        </div>
    )
}

TagsListComponent.propTypes = {
    tags: PropTypes.arrayOf(
        PropTypes.shape({
          text: PropTypes.string.isRequired,
        })
    ).isRequired
}

const defaultStyles = {
    table: {width: '100%'},
    thead: {height: '45px', width: '80%'},
    headerCell: {padding: '6px 24px 6px 24px', backgroundColor: '#6565FF1A'},
    leftMostHeaderCell: {borderRadius: '10px 0 0 10px'},
    rightMostHeaderCell: {borderRadius: '0 10px 10px 0'},
    headerText: {fontWeight: 600, fontSize: '14px', color: '#464646'},
    tbody: {},
    bodyRow: {height: '64px', borderBottom: '1px solid #DBDBDB'},
    bodyCell: {padding: '16px 24px 16px 24px'},
    tfoot: {},
    footerRow: {height: '64px', borderBottom: '1px solid #DBDBDB'}
};

const Table = ({ data, customStyles= {} }) => {
    
    const styles = { ...defaultStyles, ...customStyles };

    const headerCell = (cellData, index) => {
        let cellStyle = styles.headerCell;
        if(index == 0) cellStyle = {...cellStyle, ...styles.leftMostHeaderCell};
        if(index == data.headers.length - 1) cellStyle = {...cellStyle, ...styles.rightMostHeaderCell};
        return (
            <th key={index} style={cellStyle}>
                <div style={styles.headerText}>{cellData.text}</div>
            </th>
        )
    }

    const bodyCell = (cellData, colIndex) => {
        let cellStyle = styles.bodyCell;
        const CellComponent = cellData.Component;
        return (
            <td key={colIndex} style={cellStyle}>
                <CellComponent {...cellData.data} />
            </td>
        );
    }

    const getBodyRow = (row, rowIndex) => {
        return (
            <tr key={rowIndex} style={styles.bodyRow}>
                {row.map((cellData, colIndex) => bodyCell(cellData, colIndex))}
            </tr>
        )
    }

    const body = data.body.map((row, rowIndex) => getBodyRow(row, rowIndex));

    return (
        <table style={styles.table}>
            <thead style={styles.thead}>
                {data.headers.map((header, index) => headerCell(header, index))}
            </thead>
            <tbody style={styles.tbody}>
                {data.body.map((row, rowIndex) => getBodyRow(row, rowIndex))}
            </tbody>
            {
                data.footer && 
                (<tfoot>
                    <tr style={styles.footerRow}>
                        <data.footer.Component {...data.footer.data} />
                    </tr>
                </tfoot>)
            }
        </table>
    );
};

export default Table;