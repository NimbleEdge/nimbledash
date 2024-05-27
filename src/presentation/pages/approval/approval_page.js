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
import { useDispatch, useSelector } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";
import { toast } from "react-toastify";
import { Toast } from "react-bootstrap";
import Dropdown from "presentation/components/DropdownInternal/dropdown";
import ApprovalRequestDetails from "./approval_request_details";
import { getRequest } from "data/remote_datasource";

const ApprovalPage = () => {
    // const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
    // const [selectedDeploymentData, setSelectedDeploymentData] = useState({});
    const [selectedDeploymentDataIndex, setSelectedDeploymentDataIndex] = useState(-1);
    const [reload, setReload] = useState(true);
    // @ts-ignore
    const globalUserState = useSelector((state) => state.userReducer);
    const defaultDeploymentSelections = {
        name: "",
        description: "",
        scriptIndex: -1,
        modelIndexes: [],
        ctIndex: -1,
    };
    const dispatch = useDispatch();
    const tabTitles = ["Raised Requests", "My Requests"];
    const [virginData, setVirginData] = useState([]);

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

    const preprocessApprovalPageData = async (approvalData) => {
        var processedData = [];
        var processedData2 = [];
        let masterIndex = 0;

        for (var approvalRequest in approvalData) {
            let index = masterIndex;
            let request = approvalData[approvalRequest];
            let details = JSON.parse(request.details);
            let stateName = details.name;
            let description = request.comments;
            const parsedDate = new Date(request.createdAt);
            let createdAt = parsedDate.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            });
            let status = request.status;
            let reviewsRequired = 'null';
            let reviewCount = request.reviews.length;
            let sourceClientId = details.sourceClientId;
            let owner = request.owner;


            if (owner == globalUserState.email || owner == globalUserState.username) {
                processedData2.push(
                    [
                        {
                            Component: TextOnlyComponent,
                            data: {
                                text: stateName,
                                onClick: () => {
                                    setSelectedDeploymentDataIndex(index);
                                },
                                customStyle: {
                                    fontWeight: 500,
                                    color: "#494949",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                },
                                highlightOnHover: true,
                            },
                        },
                        {
                            Component: TextOnlyComponent,
                            data: {
                                text: description,
                                onClick: () => {
                                    setSelectedDeploymentDataIndex(index);
                                },
                                customStyle: {
                                    color: "#74828F",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    cursor: "pointer",
                                },
                                highlightOnHover: true,
                            },
                        },
                        {
                            Component: TextOnlyComponent,
                            data: {
                                text: createdAt,
                                onClick: () => {
                                    setSelectedDeploymentDataIndex(index);
                                },
                                customStyle: {
                                    color: "#74828F",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    cursor: "pointer",
                                },
                                highlightOnHover: true,
                            },
                        },
                        {
                            Component: TextOnlyComponent,
                            data: {
                                text: reviewCount,
                                onClick: () => {
                                    setSelectedDeploymentDataIndex(index);
                                },
                                customStyle: {
                                    color: "#74828F",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    cursor: "pointer",
                                },
                                highlightOnHover: true,
                            },
                        },
                        {
                            Component: TextOnlyComponent,
                            data: {
                                text: 'null',
                                onClick: () => {
                                    setSelectedDeploymentDataIndex(index);
                                },
                                customStyle: {
                                    color: "#74828F",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    cursor: "pointer",
                                },
                                highlightOnHover: true,
                            },
                        },
                        {
                            Component: TextOnlyComponent,
                            data: {
                                text: status,
                                onClick: () => {
                                    setSelectedDeploymentDataIndex(index);
                                },
                                customStyle: {
                                    color: "#74828F",
                                    fontWeight: 400,
                                    fontSize: "14px",
                                    cursor: "pointer",
                                },
                                highlightOnHover: true,
                            },
                        },
                    ]

                );
            }
            else {
                processedData.push([
                    {
                        Component: TextOnlyComponent,
                        data: {
                            text: stateName,
                            onClick: () => {
                                setSelectedDeploymentDataIndex(index);
                            },
                            customStyle: {
                                fontWeight: 500,
                                color: "#494949",
                                fontSize: "14px",
                                cursor: "pointer",
                            },
                            highlightOnHover: true,
                        },
                    },
                    {
                        Component: TextOnlyComponent,
                        data: {
                            text: description,
                            onClick: () => {
                                setSelectedDeploymentDataIndex(index);
                            },
                            customStyle: {
                                color: "#74828F",
                                fontWeight: 400,
                                fontSize: "14px",
                                cursor: "pointer",
                            },
                            highlightOnHover: true,
                        },
                    },
                    {
                        Component: TextOnlyComponent,
                        data: {
                            text: owner,
                            onClick: () => {
                                setSelectedDeploymentDataIndex(index);
                            },
                            customStyle: {
                                color: "#74828F",
                                fontWeight: 400,
                                fontSize: "14px",
                                cursor: "pointer",
                            },
                            highlightOnHover: true,
                        },
                    },
                    {
                        Component: TextOnlyComponent,
                        data: {
                            text: createdAt,
                            onClick: () => {
                                setSelectedDeploymentDataIndex(index);
                            },
                            customStyle: {
                                color: "#74828F",
                                fontWeight: 400,
                                fontSize: "14px",
                                cursor: "pointer",
                            },
                            highlightOnHover: true,
                        },
                    },
                    {
                        Component: TextOnlyComponent,
                        data: {
                            text: reviewCount,
                            onClick: () => {
                                setSelectedDeploymentDataIndex(index);
                            },
                            customStyle: {
                                color: "#74828F",
                                fontWeight: 400,
                                fontSize: "14px",
                                cursor: "pointer",
                            },
                            highlightOnHover: true,
                        },
                    },
                    {
                        Component: TextOnlyComponent,
                        data: {
                            text: 'null',
                            onClick: () => {
                                setSelectedDeploymentDataIndex(index);
                            },
                            customStyle: {
                                color: "#74828F",
                                fontWeight: 400,
                                fontSize: "14px",
                                cursor: "pointer",
                            },
                            highlightOnHover: true,
                        },
                    },
                    {
                        Component: TextOnlyComponent,
                        data: {
                            text: status,
                            onClick: () => {
                                setSelectedDeploymentDataIndex(index);
                            },
                            customStyle: {
                                color: "#74828F",
                                fontWeight: 400,
                                fontSize: "14px",
                                cursor: "pointer",
                            },
                            highlightOnHover: true,
                        },
                    },
                ]);
            }

            masterIndex++;
        }


        var newData = { ...raisedReqTableData, body: processedData };
        setRaisedReqTableData(newData);

        var newData = { ...myReqTableData, body: processedData2 };
        setMyReqTableData(newData);

        dispatch(loaderActions.toggleLoader(false));
    };

    const fetchApprovalData = async () => {
        const res = await getRequest(APP_BASE_MDS_URL, 'api/v2/admin/requests');
        return res.data.userRequests;
    }

    useEffect(() => {
        dispatch(loaderActions.toggleLoader(true));
        fetchApprovalData().then((approvalData) => {
            setVirginData(approvalData);
            preprocessApprovalPageData(approvalData);
        });
    }, [reload]);

    return (
        <>
            <div className={`flexColumn adminPage relative`}>
                <div className={`flexColumn adminPageHeader`}>
                    <div className={`adminPageTitle`}>Edge Deployment Management</div>
                    <div className={`adminPageSubtitle`}>Manage Deployments</div>
                </div>
                {selectedDeploymentDataIndex != -1 && <div className="lineDivider"></div>}
                {selectedDeploymentDataIndex == -1 && (
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
                            <Table data={raisedReqTableData} clickableHeaderIndex={undefined} clickableHeaderCallback={undefined} />
                        </div>}
                        {selectedTab == 1 && <div className={`tasksTableView flexColumn overflowAuto`}>
                            <Table data={myReqTableData} clickableHeaderIndex={undefined} clickableHeaderCallback={undefined} />
                        </div>}
                    </div>
                )}
                {selectedDeploymentDataIndex != -1 && <ApprovalRequestDetails forceUpdateData={() => {
                    setReload(!reload);
                }} isMyRequest={selectedTab === 1} deploymentData={virginData[selectedDeploymentDataIndex]} setSelectedDeploymentData={setSelectedDeploymentDataIndex} />}
            </div>
        </>
    );
};

export default ApprovalPage;
