import { fetchTaskFile } from 'data/apis';
import Table, { TextOnlyComponent } from 'presentation/components/Table/table';
import { TagsListComponent } from 'presentation/components/Tags/tagsList';
import { loaderActions } from 'presentation/redux/stores/store';
import React, { PureComponent, useEffect, useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { useDispatch } from 'react-redux';


function DeploymentDiff({ deployment1, deployment2, onBack }) {

    const [scripts, setScripts] = useState([])
    const dispatch = useDispatch();

    const downloadScripts = async () => {
        var script1 = (await fetchTaskFile({ taskVersion: deployment1.tasks.DEFAULT_SCRIPT })).data.taskCode;
        var script2 = (await fetchTaskFile({ taskVersion: deployment2.tasks.DEFAULT_SCRIPT })).data.taskCode;

        setScripts([script1, script2]);

        dispatch(loaderActions.toggleLoader(false));
    }

    useEffect(() => {
        dispatch(loaderActions.toggleLoader(true));
        prepareModelTabble();
        downloadScripts();
    }, []);

    const [deploymentViewData, updateDeploymentViewData] = useState({
        headers: [
            { text: deployment1.name },
            { text: deployment2.name },
        ],
        body: [

        ],
    });

    const prepareModelTabble = () => {
        var deploymentModels1 = [];
        var deploymentModels2 = [];

        for (var key in deployment1.models) {
            deploymentModels1.push(key + " v" + deployment1.models[key]);
        }

        for (var key in deployment2.models) {
            deploymentModels2.push(key + " v" + deployment2.models[key]);
        }


        var length = deploymentModels1.length > deploymentModels2.length ? deploymentModels1.length : deploymentModels2.length;

        var processedData = [];

        for (var index = 0; index < length; index++) {
            var model1 = deploymentModels1[index];
            var model2 = deploymentModels2[index];

            processedData.push(
                [
                    { Component: TextOnlyComponent, data: { text: model1, customStyle: { fontWeight: 500, color: '#494949', fontSize: '14px' }, highlightOnHover: true } },
                    { Component: TextOnlyComponent, data: { text: model2, customStyle: { color: '#494949', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                ]
            );
        }

        const newData = { ...deploymentViewData, body: processedData };
        updateDeploymentViewData(newData);
    }


    return <div className={`flexColumn adminPage`}>
        <div className={`flexColumn adminPageHeader`}>
            <div className={`adminPageTitle`}>Deployment Comparision</div>
            <div className={`adminPageSubtitle`}>{deployment1.name} v/s {deployment2.name}</div>
        </div>
        <div className='flex'>
            <img style={{ height: "20px", marginRight: "8px", cursor:"pointer" }} src='/assets/icons/backArrow.svg' onClick={onBack}></img>
            <p style={{ marginBottom: '24px' }} className='heading4'>Script</p>
        </div>
        <ReactDiffViewer showDiffOnly={true} leftTitle={deployment1.tasks.DEFAULT_SCRIPT} rightTitle={deployment2.tasks.DEFAULT_SCRIPT} oldValue={scripts[0]} newValue={scripts[1]} splitView={true} />

        <p style={{ marginTop: '52px', marginBottom: '24px' }} className='heading4'>Models</p>
        <div>
            <div className={`tasksTableView flexColumn overflowAuto`}>
                <Table data={deploymentViewData} clickableHeaderIndex={undefined} clickableHeaderCallback={undefined} />
            </div>
        </div>


    </div>
}

export default DeploymentDiff;