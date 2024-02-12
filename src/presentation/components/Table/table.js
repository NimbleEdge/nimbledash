import React from 'react';
import PropTypes from 'prop-types';
import './style1.css';
import './style2.css';
import './table.css';
import '../../../common.css';


export const TextOnlyComponent = ({text, customStyle}) => {
    return (
        <div className={`textOnlyComponent`} style={customStyle}>{text}</div>
    )
}

TextOnlyComponent.propTypes = {
    text: PropTypes.string.isRequired
}

export const TABLE_STYLE_TYPE = {
    STYLE1: 'style1',
    STYLE2: 'style2'
}

// const defaultStyles1 = {
//     table: {width: '100%'},
//     thead: {height: '45px', width: '80%'},
//     headerCell: {padding: '6px 24px 6px 24px', backgroundColor: '#6565FF1A'},
//     leftMostHeaderCell: {}, //{borderRadius: '10px 0 0 10px'},
//     rightMostHeaderCell: {}, //{borderRadius: '0 10px 10px 0'},
//     headerText: {fontWeight: 600, fontSize: '14px', color: '#464646'},
//     tbody: {},
//     tr: {height: '64px', borderBottom: '1px solid #DBDBDB'},
//     bodyCell: {},
//     tfoot: {},
//     footerRow: {height: '64px', borderBottom: '1px solid #DBDBDB'}
// };

// const defaultStyles2 = {
//     table: {width: '100%', borderSpacing: '0 10px'},
//     thead: {height: '45px', width: '80%'},
//     headerCell: {padding: '6px 24px 6px 24px', backgroundColor: '#6565FF1A'},
//     leftMostHeaderCell: {}, //{borderRadius: '10px 0 0 10px'},
//     rightMostHeaderCell: {}, //{borderRadius: '0 10px 10px 0'},
//     headerText: {fontWeight: 600, fontSize: '14px', color: '#464646'},
//     tbody: {},
//     tr: {height: '52px', borderRadius: '8px', opacity: '80%', backgroundColor: '#6565FF1A'},
//     bodyCell: {},
//     tfoot: {},
//     footerRow: {height: '64px', borderBottom: '1px solid #DBDBDB'}
// };

const defaultStyle = {};

const Table = ({ data, customStyles= {}, STYLE = TABLE_STYLE_TYPE.STYLE1 }) => {
    
    const styles = {}; //= STYLE == TABLE_STYLE_TYPE.STYLE1 ? { ...defaultStyles1, ...customStyles } : { ...defaultStyles2, ...customStyles };

    const headerCell = (cellData, index) => {
        let cellStyle = styles.headerCell;
        if(index == 0) cellStyle = {...cellStyle, ...styles.leftMostHeaderCell};
        if(index == data.headers.length - 1) cellStyle = {...cellStyle, ...styles.rightMostHeaderCell};
        return (
            <th key={index} style={cellStyle} className={STYLE}>
                <div style={styles.headerText} className={STYLE}>{cellData.text}</div>
            </th>
        )
    }

    const bodyCell = (cellData, colIndex) => {
        let cellStyle = styles.bodyCell;
        const CellComponent = cellData.Component;
        return (
            <td key={colIndex} style={cellStyle} className={STYLE}>
                <CellComponent {...cellData.data} />
            </td>
        );
    }

    const getBodyRow = (row, rowIndex) => {
        return (
            <tr key={rowIndex} style={styles.tr} className={STYLE}>
                {row.map((cellData, colIndex) => bodyCell(cellData, colIndex))}
            </tr>
        )
    }

    const body = data.body.map((row, rowIndex) => getBodyRow(row, rowIndex));

    return (
        <table style={styles.table} className={STYLE}>
            <thead style={styles.thead} className={STYLE}>
                {data.headers.map((header, index) => headerCell(header, index))}
            </thead>
            <tbody style={styles.tbody} className={STYLE}>
                {data.body.map((row, rowIndex) => getBodyRow(row, rowIndex))}
            </tbody>
            {
                data.footer && 
                (<tfoot className={STYLE}>
                    <tr style={styles.footerRow} className={STYLE}>
                        <data.footer.Component {...data.footer.data} />
                    </tr>
                </tfoot>)
            }
        </table>
    );
};

export default Table;