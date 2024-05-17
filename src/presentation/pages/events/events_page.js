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
import { getRequest, postRequest } from "data/remote_datasource";
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
    const [deploymentSelections, setDeploymentSelections] = useState(defaultDeploymentSelections);
    const [isCreateNewModelOpen, setIsCreateNewModelOpen] = useState(false);
    const dispatch = useDispatch();
    const closeModal = () => {
        setIsCreateNewModelOpen(false);
    };
    const [isChangesMade, setIsChangesMade] = useState(false);

    const [deploymentViewData, updateDeploymentViewData] = useState({
        headers: [
            { text: 'Name' },
            { text: 'Description' },
            { text: 'Created At' },
            { text: 'Enabled' },
        ],
        body: [

        ],
    });


    const virginData = [
        {
            name: 'CLICK_EVENT',
            description: 'This is a sample non m*in event',
            createdAt: '24th December, 2024',
            isEnabled: true
        },
        {
            name: 'LIKE_EVENT',
            description: 'This is a sample non m*in event',
            createdAt: '12th June, 2023',
            isEnabled: false
        },
        {
            name: 'SCROLL_EVENT',
            description: 'This is a sample non m*in event',
            createdAt: '30th September, 2022',
            isEnabled: false
        }
    ];

    const preprocessDeploymentData = async (data) => {
        var processedData = [];

        for (let event of data) {
            processedData.push(
                [
                    { Component: TextOnlyComponent, data: { text: event.name, customStyle: { fontWeight: 500, color: '#494949', fontSize: '14px' }, highlightOnHover: true } },
                    { Component: TextOnlyComponent, data: { text: event.description, customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                    { Component: TextOnlyComponent, data: { text: event.createdAt, customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                    { Component: (() => <CheckBox isEnabled={event.isEnabled} onChange={(() => { setIsChangesMade(true); })} />), data: {} }
                ]
            );
        }

        const newData = { ...deploymentViewData, body: processedData };
        updateDeploymentViewData(newData);
    }

    const searchFilter = (keyword) => {
        const keywords = keyword.split(" ");
        var temp = []

        for (let event of virginData) {
            var isValid = true;
            var candidateString = event.name + event.description + event.createdAt;

            for (let singleKeyword of keywords) {
                if (!candidateString.toLowerCase().includes(singleKeyword.toLowerCase())) {
                    isValid = false;
                    break;
                }
            }

            if (isValid) {
                temp.push(event);
            }
        }

        if (keyword == "") {
            temp = virginData;
        }
        console.log(temp);
        preprocessDeploymentData(temp);
    }

    useEffect(() => {
        preprocessDeploymentData(virginData);
    }, [reload]);

    return (
        <div className="relative">
            {isChangesMade && <div className="action-container">
                <div className="action-button flex" onClick={()=>{setIsChangesMade(false);}}>
                    <img src="/assets/icons/close.svg" className="action-icon"></img>
                    <p className="buttonText">Discard changes</p>
                </div>

                <div className="action-button-primary flex" onClick={()=>{setIsChangesMade(false);}}>
                    <img src="/assets/icons/saveTick.svg" className="action-icon"></img>
                    <p className="buttonText">Apply changes</p>
                </div>
            </div>}

            {isCreateNewModelOpen &&
                <Modal seriesInfo={{
                    isSeries: true,
                    hasNext: false,
                    hasPrev: false,
                    onNext: () => {
                    },
                    onPrev: () => {
                    },
                    onDone: () => {
                        setIsCreateNewModelOpen(false);
                    }
                }}
                    isOpen={isCreateNewModelOpen} onClose={closeModal} closeButtonDisabled={false} customStyle={{ maxHeight: '90%', height: '654px' }} >
                    <div className='tagsListModalContent'>
                        <div className='tagsListModalHeader'>Create A New Event</div>

                        {<form className="expanded">
                            <p className="modalSubHeading">Name</p>
                            <input
                                id="deploymentName"
                                type="text"
                                name="deploymentName"
                                className="model-upload-custom-dropdown itemsPadding"
                                placeholder={"Enter name here"}
                                value={deploymentSelections.name}
                                onChange={(res) => {
                                    setDeploymentSelections({ ...deploymentSelections, name: res.target.value });
                                }}
                            />

                            <p className="modalSubHeading">Description</p>
                            <textarea
                                id="deploymentDescription"
                                name="deploymentDescription"
                                className="model-upload-custom-dropdown"
                                placeholder={"Enter description here"}
                                value={deploymentSelections.description}
                                style={{
                                    height: "300px",
                                    paddingTop: "16px",
                                    outline: "none"
                                }}
                                onChange={(res) => {
                                    setDeploymentSelections({ ...deploymentSelections, description: res.target.value });
                                }}
                            />
                        </form>}
                    </div>
                </Modal>
            }

            <div className={`flexColumn adminPage`}>
                <div className={`flexColumn adminPageHeader`}>
                    <div className={`adminPageTitle`}>Edge Deployment Management</div>
                    <div className={`adminPageSubtitle`}>Manage Deployments</div>
                </div>
                <div className={`adminPageContent`}>
                    {
                        <div className={`subHeader flexRow`}>
                            <div className={`subHeaderText`}>Correlations</div>
                            {<div className="subHeaderActions">
                                <form className="expanded">
                                    <input
                                        id="searchSelectedModel"
                                        type="text"
                                        name="searchSelectedModel"
                                        className="model-upload-custom-dropdown itemsPaddingVerySmall"
                                        placeholder={"Search"}
                                        onChange={(res) => {
                                            searchFilter(res.target.value);
                                        }}
                                    />
                                </form>

                                <div className="new-admin-page-upload-btn cursorPointer" onClick={() => { setIsCreateNewModelOpen(true); }}>
                                    <img src={"/assets/icons/CreatePlus.svg"} className={``} />
                                </div>
                            </div>
                            }
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