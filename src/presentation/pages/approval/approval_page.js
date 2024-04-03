import FileDownloadComponent from "presentation/components/FileDownload/fileDownload";
import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import React, { useEffect, useState } from "react";
import { DEFAULT_TASK_NAME } from "../admin/new_admin_page";
import HoverText from "presentation/components/HoverText/hoverText";
import '../../../common.css';
import '../admin/admin_page.css';
import '../admin/TasksSection/tasksTable.css';
import './approval_page.css';
import Modal from "presentation/components/modal/modal";
import axios from "axios";
import { AUTH_METHOD, ACCESS_TOKEN, CLIENT_ID, USER_EMAIL, COGNITO_USERNAME, APP_BASE_MDS_URL } from "core/constants";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";
import { toast } from "react-toastify";
import { Toast } from "react-bootstrap";
import Dropdown from "presentation/components/DropdownInternal/dropdown";


const deploymentActions = () => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '24px' }} />

            <HoverText onHoverText={"Promote Deployment To Production"}>
                <img className={"download-model-icon"} src={"/assets/icons/promote_to_prod.svg"} onClick={() => { }}></img>
            </HoverText>

            <div style={{ marginRight: '12px' }} />

            <HoverText onHoverText={"Duplicate Selected Deployment"}>
                <img className={"download-model-icon"} src={"/assets/icons/duplicate.svg"} onClick={() => { }}></img>
            </HoverText>
        </div>

    )
}



const getModelNameWithVersionList = (dict) => {
    var temp = [];
    for (let modelName in dict) {
        temp.push(`${modelName}(${dict[modelName]})`)
    }

    return temp;
}

const ApprovalPage = () => {
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
    const [reload, setReload] = useState(true);
    const defaultDeploymentSelections = {
        name: "",
        description: "",
        scriptIndex: -1,
        modelIndexes: [],
        ctIndex: -1
    };
    const dispatch = useDispatch();

    const [deploymentViewData, updateDeploymentViewData] = useState({
        headers: [
            { text: 'Name' },
            { text: 'Description' },
            { text: 'Raised By' },
            { text: 'Raised On' },
            { text: 'Review Count' },
            { text: 'Approvals Required' },
            { text: 'Approvals Status' }
        ],
        body: [

        ],
    });

    const preprocessDeploymentData = async (data) => {
        var processedData = [];

        for (let deployment of data) {
            processedData.push(
                [
                    { Component: TextOnlyComponent, data: { text: "State 1", customStyle: { fontWeight: 500, color: '#494949', fontSize: '14px' }, highlightOnHover: true, onclick:()=>{console.log("clickkk")} } },
                    { Component: TextOnlyComponent, data: { text: "This is a random description", customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                    { Component: TextOnlyComponent, data: { text: "naman.anand@nimbleedgehq.ai", customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                    { Component: TextOnlyComponent, data: { text: "21/06/1999", customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                    { Component: TextOnlyComponent, data: { text: "3", customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                    { Component: TextOnlyComponent, data: { text: "5", customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                    { Component: TextOnlyComponent, data: { text: "PENDING", customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                ]
            );
        }

        const newData = { ...deploymentViewData, body: processedData };
        updateDeploymentViewData(newData);
        dispatch(loaderActions.toggleLoader(false));
    }

    useEffect(() => {
        preprocessDeploymentData([1, 2, 3, 4]);
    }, [reload]);

    return (
        <>
            <div className={`flexColumn adminPage`}>
                <div className={`flexColumn adminPageHeader`}>
                    <div className={`adminPageTitle`}>Edge Deployment Management</div>
                    <div className={`adminPageSubtitle`}>Manage Deployments</div>
                </div>
                <div className={`adminPageContent`}>

                    {selectedRowIndex == -1 && <div>
                        <div className={`subHeader flexRow`}>
                            <div className={`subHeaderText`}>Correlations</div>
                            {<div className="subHeaderActions">
                                <Dropdown options={["Raised Requests", "My Requests"]} handleSelection={(_view) => { }} defaultSelectedOption={"Raised Requests"} />
                            </div>
                            }
                        </div>

                        <div className={`tasksTableView flexColumn overflowAuto`}>
                            <Table data={deploymentViewData} />
                        </div></div>}

                    {selectedRowIndex != -1 &&
                        <div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
};

export default ApprovalPage;
