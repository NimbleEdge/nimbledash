import FileDownloadComponent from "presentation/components/FileDownload/fileDownload";
import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import React, { useEffect, useState } from "react";
import { DEFAULT_TASK_NAME } from "../admin/new_admin_page";
import HoverText from "presentation/components/HoverText/hoverText";
import '../../../common.css';
import '../admin/admin_page.css';
import '../admin/TasksSection/tasksTable.css';
import './events_page.css';
import Modal from "presentation/components/modal/modal";
import axios from "axios";
import { AUTH_METHOD, ACCESS_TOKEN, CLIENT_ID, USER_EMAIL, COGNITO_USERNAME, APP_BASE_MDS_URL, FORM_PASSWORD, FORM_USERNAME } from "core/constants";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";
import { toast } from "react-toastify";
import { getRequest, postRequest, putRequest } from "data/remote_datasource";
import CheckBox from "presentation/components/checkbox/checkbox";

const EventsPage = () => {
    const [reload, setReload] = useState(true);
    const defaultDeploymentSelections = {
        name: "",
        description: "",
        scriptIndex: -1,
        modelIndexes: [],
        ctIndex: -1
    };
    const [virginData, setVirginData] = useState([]);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    

    const [deploymentViewData, updateDeploymentViewData] = useState({
        headers: [
            { text: 'Name' },
            { text: 'Enabled' },
        ],
        body: [],
    });

    const preprocessDeploymentData = async () => {
        var processedData = [];

            var res = await getRequest(APP_BASE_MDS_URL, `api/v2/admin/edgeevents`);
            setVirginData(res.data.edgeEvents);
            var data = res.data.edgeEvents;
        

        for (let event of data) {
            processedData.push(
                [
                    { Component: TextOnlyComponent, data: { text: event.name, customStyle: { fontWeight: 500, color: '#494949', fontSize: '14px' }, highlightOnHover: true } },
                    { Component: (() => <CheckBox isEnabled={event.enabled} onChange={(async(currentState) => {
                        dispatch(loaderActions.toggleLoader(true));
                        await putRequest(APP_BASE_MDS_URL, `api/v2/admin/edgeevents`,{
                            "edgeEvents": [
                                {
                                    "name": event.name,
                                    "enabled": currentState
                                }
                            ]
                        });
                        dispatch(loaderActions.toggleLoader(false));
                    })} />), data: {} }
                ]
            );
        }

        const newData = { ...deploymentViewData, body: processedData };
        updateDeploymentViewData(newData);
        dispatch(loaderActions.toggleLoader(false));
    }

    useEffect(() => {
        dispatch(loaderActions.toggleLoader(true));
        preprocessDeploymentData();
    }, [reload]);

    return (
        <div className="relative">
            <div className={`flexColumn adminPage`}>
                <div className={`flexColumn adminPageHeader`}>
                    <div className={`adminPageTitle`}>Edge Deployment Management</div>
                    <div className={`adminPageSubtitle`}>Manage Deployments</div>
                </div>
                <div className={`adminPageContent`}>
                    {
                        <div className={`subHeader flexRow`}>
                            <div className={`subHeaderText`}>Correlations</div>
                        </div>
                    }
                    <div className={`tasksTableView flexColumn overflowAuto`}>
                        <Table data={deploymentViewData} clickableHeaderIndex={undefined} clickableHeaderCallback={undefined} />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default EventsPage;
