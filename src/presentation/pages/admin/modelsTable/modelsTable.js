import Table, { TagsListComponent, TextOnlyComponent } from "presentation/components/Table/table";
import '../../../../common.css';
import '../admin_page.css';
import './modelsTable.css';
import React, { useEffect, useState } from "react";

const uploadNewModalComponent = () => {
    return (
        <div className="uploadNewModelFooter">
            <div className={`uploadPlusSign`}>+</div>
            <div>Upload new model</div>
        </div>
    )
}

const ModelsTable = ({modelsDetails, onModalClick}) => {
    const [modelsViewData, updateModelsViewData] = useState({
        headers: [{text: 'Models'}, {text: 'Compatability Tags'}, {text: 'Latest Version'}],
        body: [],
    });

    const ModelNameColumnComponent = (data) => {
        return (<div className={`modelNameColumn`} onClick={() => data.onClick(data.text)}>{data.text}</div>)
    }

    useEffect(() => {
        modelsViewData.body = [];
        let index = 0;
        for(const modelName in modelsDetails) {
            index++;
            const tagsArray = [];
            for(const tag in modelsDetails[modelName]['tags']) tagsArray.push(tag);
            modelsViewData.body.push([{Component: ModelNameColumnComponent, data: {text: modelName, onClick: onModalClick}}, {Component: TagsListComponent, data: {tags: tagsArray}}, {Component: TextOnlyComponent, data: {text: modelsDetails[modelName].latestVersion}}]);
        }
        updateModelsViewData({...modelsViewData});
    }, [modelsDetails])
    
    return (
        <div className={`modelsTableView flexColumn`}>
            <Table data={modelsViewData}/>
        </div>
    )
}

export default ModelsTable;