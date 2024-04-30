import FileDownloadComponent from "presentation/components/FileDownload/fileDownload";
import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import React, { useEffect, useState } from "react";
import { DEFAULT_TASK_NAME } from "../admin/new_admin_page";
import HoverText from "presentation/components/HoverText/hoverText";
import "../../../common.css";
import "../admin/admin_page.css";
import "../admin/TasksSection/tasksTable.css";
import "./approval_page.css";
import Modal from "presentation/components/modal/modal";
import axios from "axios";
import {
    AUTH_METHOD,
    ACCESS_TOKEN,
    CLIENT_ID,
    USER_EMAIL,
    COGNITO_USERNAME,
    APP_BASE_MDS_URL,
} from "core/constants";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";
import { toast } from "react-toastify";
import { Toast } from "react-bootstrap";
import Dropdown from "presentation/components/DropdownInternal/dropdown";
import ApprovalRequestDetails from "./approval_request_details";

const ApprovalPage = () => {
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
    const [reload, setReload] = useState(true);
    const defaultDeploymentSelections = {
        name: "",
        description: "",
        scriptIndex: -1,
        modelIndexes: [],
        ctIndex: -1,
    };
    const dispatch = useDispatch();
    const tabTitles = ["Raised Requests", "My Requests"];

    const [raisedReqTableData, setRaisedReqTableData] = useState({
        headers: [
            { text: "Name" },
            { text: "Description" },
            { text: "Raised By" },
            { text: "Raised On" },
            { text: "Review Count" },
            { text: "Approvals Required" },
            { text: "Approvals Status" },
        ],
        body: [],
    });

    const [myReqTableData, setMyReqTableData] = useState({
        headers: [
            { text: "Name" },
            { text: "Description" },
            { text: "Raised On" },
            { text: "Review Count" },
            { text: "Approvals Required" },
            { text: "Approvals Status" },
        ],
        body: [],
    });

    const [selectedTab, setSelectedTab] = useState(0);

    const preprocessApprovalPageData = async (raisedReqData, myReqData) => {
        var processedData = [];
        var processedData2 = [];

        // for (let deployment of raisedReqData) {
        //     processedData.push([
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "State 1",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     fontWeight: 500,
        //                     color: "#494949",
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "This is a random description",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     color: "#74828F",
        //                     fontWeight: 400,
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "naman.anand@nimbleedgehq.ai",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     color: "#74828F",
        //                     fontWeight: 400,
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "01/01/1970",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     color: "#74828F",
        //                     fontWeight: 400,
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "3",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     color: "#74828F",
        //                     fontWeight: 400,
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "5",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     color: "#74828F",
        //                     fontWeight: 400,
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "PENDING",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     color: "#74828F",
        //                     fontWeight: 400,
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //     ]);
        // }

        // for (let deployment of myReqData) {
        //     processedData2.push([
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "State 1",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     fontWeight: 500,
        //                     color: "#494949",
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "This is a random description",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     color: "#74828F",
        //                     fontWeight: 400,
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "01/01/1970",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     color: "#74828F",
        //                     fontWeight: 400,
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "3",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     color: "#74828F",
        //                     fontWeight: 400,
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "5",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     color: "#74828F",
        //                     fontWeight: 400,
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //         {
        //             Component: TextOnlyComponent,
        //             data: {
        //                 text: "PENDING",
        //                 onClick: () => {
        //                     setSelectedRowIndex(0);
        //                 },
        //                 customStyle: {
        //                     color: "#74828F",
        //                     fontWeight: 400,
        //                     fontSize: "14px",
        //                     cursor: "pointer",
        //                 },
        //                 highlightOnHover: true,
        //             },
        //         },
        //     ]);
        // }

        var newData = { ...raisedReqTableData, body: processedData };
        setRaisedReqTableData(newData);

        var newData = { ...myReqTableData, body: processedData2 };
        setMyReqTableData(newData);

        dispatch(loaderActions.toggleLoader(false));
    };

    useEffect(() => {
        preprocessApprovalPageData([1, 2, 3, 4], [1, 2]);
    }, [reload]);

    return (
        <>
            <div className={`flexColumn adminPage relative`}>
                <div className={`flexColumn adminPageHeader`}>
                    <div className={`adminPageTitle`}>Edge Deployment Management</div>
                    <div className={`adminPageSubtitle`}>Manage Deployments</div>
                </div>
                {selectedRowIndex != -1 && <div className="lineDivider"></div>}
                {selectedRowIndex == -1 && (
                    <div>
                        <div className={`subHeader flexRow`}>
                            <div className={`subHeaderText`}>Correlations</div>
                            {
                                <div className="subHeaderActions">
                                    <Dropdown
                                        options={tabTitles}
                                        handleSelection={(selection) => {
                                            setSelectedTab(tabTitles.indexOf(selection));
                                        }}
                                        defaultSelectedOption={tabTitles[selectedTab]}
                                    />
                                </div>
                            }
                        </div>

                        {selectedTab == 0 && <div className={`tasksTableView flexColumn overflowAuto`}>
                            <Table data={raisedReqTableData} />
                        </div>}
                        {selectedTab == 1 && <div className={`tasksTableView flexColumn overflowAuto`}>
                            <Table data={myReqTableData} />
                        </div>}
                    </div>
                )}
                {selectedRowIndex != -1 && <ApprovalRequestDetails isMyRequest={selectedTab === 1} setSelectedRowIndex={setSelectedRowIndex} />}
            </div>
        </>
    );
};

export default ApprovalPage;
