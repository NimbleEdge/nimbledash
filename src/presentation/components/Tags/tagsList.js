import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../modal/modal';
import './tags.css';
import { TagComponent } from './tag';
import Table, { TABLE_STYLE_TYPE } from '../Table/table';
import Search, { SearchTable } from '../Search/searchComponent';
import { getColorFromSeed } from 'core/constants';

export const TagsListComponent = ({ tags, tableData = {}, truncationLimit = 5, tableTitle = "", expandable = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        if (expandable) setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const tagsReducedList = tags.slice(0, truncationLimit);
    let truncated = false;
    if (tags.length > truncationLimit) truncated = true;

    const modelCustomStyle = { maxHeight: '90%', display: 'flex' };
    const dotCustomStyle = { padding: '4px 12px 4px 12px', height: '30px', width: '33px', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' };

    return (
        <>
            <div className={`tableCell ${expandable ? `cursorPointer` : ''}`}>
                {
                    truncated &&
                    <div className={`tagsList flexRow` + (expandable ? `cursorPointer` : '')} onClick={openModal}>
                        {tagsReducedList.map((tag, index) => {
                            return (<TagComponent key={tag} text={tag} customStyle={{ color: getColorFromSeed(tag).fontColor }} color={getColorFromSeed(tag).background} />);
                        })}
                        {truncated && <TagComponent text={"..."} color={getColorFromSeed("...").background} customStyle={{ ...dotCustomStyle, color: getColorFromSeed("...").fontColor }} />}
                    </div>
                }
                {
                    !truncated &&
                    <div className={`tagsList flexRow` + (expandable ? `cursorPointer` : '')} onClick={openModal}>
                        {tags.map((tag, index) => {
                            return (<TagComponent key={tag} text={tag} customStyle={{ color: getColorFromSeed(tag).fontColor }} color={getColorFromSeed(tag).background} />);
                        })}
                    </div>
                }
            </div>
            {
                isModalOpen &&
                <Modal isOpen={isModalOpen} onClose={closeModal} customStyle={modelCustomStyle} closeButtonDisabled={false}>
                    <div className='tagsListModalContent'>
                        <div className='tagsListModalHeader'>{tableTitle}</div>
                        <SearchTable tableData={tableData} />
                        {/* {
                        tags.map((tag, index) => {
                            const cIdx = Math.floor((Math.random()*5));
                            return (
                                <TagComponent key={tag} text={tag} color={colors[cIdx]} customStyle={{margin: '5px'}} />
                            )
                        })
                    } */}
                    </div>
                </Modal>
            }
        </>
    )
}

TagsListComponent.propTypes = {
    tags: PropTypes.arrayOf(
        PropTypes.shape({
            text: PropTypes.string.isRequired,
        })
    ).isRequired
}