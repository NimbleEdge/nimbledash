import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '../modal/modal';
import './tags.css';
import { TagComponent } from './tag';

export const TagsListComponent = ({tags, truncationLimit = 5}) => {
    const colors = ['#F8D3D3', '#F8F4D3', '#EAD3F8', '#D3E8F8', '#D4F8D3'];
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    const tagsReducedList = tags.slice(0, truncationLimit);
    let truncated = false;
    if(tags.length > truncationLimit) truncated = true;
    const customStyle= {
        maxHeight: '90%',
        display:'flex'
    };

    return (
        <>
            {
                truncated &&
                <div className={`tagsList flexRow cursorPointer`} onClick={openModal}>
                    {tagsReducedList.map((tag, index) => {
                        const cIdx = index; //Math.floor((Math.random()*5));
                        return (<TagComponent key={tag} text={tag} color={colors[cIdx]} />);
                    })}
                    {truncated && <div className='tagsListTruncated'>{'...more'}</div>}
                </div>
            }
            {
                !truncated &&
                <div className={`tagsList flexRow`}>
                    {tags.map((tag, index) => {
                        const cIdx = index; //Math.floor((Math.random()*truncationLimit));
                        return (<TagComponent key={tag} text={tag} color={colors[cIdx]} />);
                    })}
                    {truncated && <div className='tagsListTruncated'>{'...more'}</div>}
                </div>
            }
            {
                isModalOpen &&
                <Modal isOpen={isModalOpen} onClose={closeModal} customStyle={customStyle}>
                    <div className='completeListDisplayDiv'>
                    {
                        tags.map((tag, index) => {
                            const cIdx = Math.floor((Math.random()*5));
                            return (
                                <TagComponent key={tag} text={tag} color={colors[cIdx]} customStyle={{margin: '5px'}} />
                            )
                        })
                    }
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