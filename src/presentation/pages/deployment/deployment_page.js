import FileDownloadComponent from "presentation/components/FileDownload/fileDownload";
import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import React, { useEffect, useState } from "react";
import { DEFAULT_TASK_NAME } from "../admin/new_admin_page";
import HoverText from "presentation/components/HoverText/hoverText";
import '../../../common.css';
import '../admin/admin_page.css';
import '../admin/TasksSection/tasksTable.css';
import './deployment_page.css';
import Modal from "presentation/components/modal/modal";
import axios from "axios";
import { AUTH_METHOD, ACCESS_TOKEN, CLIENT_ID, USER_EMAIL, COGNITO_USERNAME, APP_BASE_MDS_URL, FORM_PASSWORD, FORM_USERNAME } from "core/constants";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";
import { SelectionModal, MultiSelectionModal } from "./selection_modal";
import { toast } from "react-toastify";
import { getRequest, postRequest } from "data/remote_datasource";
import { DropdownButton, ButtonGroup, Dropdown } from "react-bootstrap";
import DeploymentDiff from "./deployoment_diff";


const DeploymentPage = () => {
  const [virginDeploymentApiData, setVirginDeploymentApiData] = useState([]);
  const [virginCTList, setVirginCTList] = useState([]);
  const [virginScriptList, setVirginScriptList] = useState([]);
  const [virginModelList, setVirginModelList] = useState([]);
  const [reload, setReload] = useState(true);
  const defaultDeploymentSelections = {
    name: "",
    description: "",
    scriptIndex: -1,
    modelIndexes: [],
    ctIndex: -1
  };
  const [deploymentSelections, setDeploymentSelections] = useState(defaultDeploymentSelections);
  const [seriesIndex, setSeriesIndex] = useState(0);
  const [isCreateNewModelOpen, setIsCreateNewModelOpen] = useState(false);
  const dispatch = useDispatch();
  const closeModal = () => {
    setIsCreateNewModelOpen(false);
  };
  const [isComparisionModalOpen, setIsComparisionModelOpen] = useState(false);
  const seriesTitles = [
    "Create A New Deployment - Enter Deployment Details",
    "Create A New Deployment - Select Script Version",
    "Create A New Deployment - Select Models",
    "Create A New Deployment - Select Compatibility Tag",
    "Create A New Deployment - Review Changes",
  ]
  const [deploymentViewData, updateDeploymentViewData] = useState({
    headers: [
      { text: 'Name' },
      { text: 'Description' },
      { text: 'Compatability Tag' },
      { text: 'WorkflowScript' },
      { text: 'Models' },
      { text: 'Actions' }
    ],
    body: [

    ],
  });

  const [onDiffPage, setOnDiffPage] = useState(false);

  const [comparisionSelectedIndexes, setComparisionSelectedIndexes] = useState([-1, -1]);

  const seriesPages = [
    (<form className="expanded">
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
    </form>),

    SelectionModal(virginScriptList, deploymentSelections.scriptIndex, (selectedIndex) => {
      setDeploymentSelections({ ...deploymentSelections, scriptIndex: selectedIndex });
    }),
    MultiSelectionModal(virginModelList, deploymentSelections.modelIndexes, (selectedIndexList) => {
      setDeploymentSelections({ ...deploymentSelections, modelIndexes: selectedIndexList });
    }),
    SelectionModal(virginCTList, deploymentSelections.ctIndex, (selectedIndex) => {
      setDeploymentSelections({ ...deploymentSelections, ctIndex: selectedIndex });
    }),

    (
      <div>
        <p className="modalSubHeading">Please review changes. You won’t be able to edit the values afterwards.</p>
        <div className="reviewRow" onClick={() => { setSeriesIndex(0) }}>
          <p className="reviewRowKey">Deployment Name</p>
          <p className="reviewRowValue">{deploymentSelections.name}</p>
        </div>

        <div className="reviewRow" onClick={() => { setSeriesIndex(0) }}>
          <p className="reviewRowKey">Deployment Description</p>
          <p className="reviewRowValue">{deploymentSelections.description}</p>
        </div>


        <div className="reviewRow" onClick={() => { setSeriesIndex(1) }}>
          <p className="reviewRowKey">Workflow Script</p>
          <p className="reviewRowValue">{deploymentSelections.scriptIndex != -1 && virginScriptList[deploymentSelections.scriptIndex].version}</p>
        </div>

        <div className="reviewRow" onClick={() => { setSeriesIndex(2) }}>
          <p className="reviewRowKey">Models</p>
          <p className="reviewRowValue">
            {deploymentSelections.modelIndexes.map((selectedModelIndex) => (
              `${virginModelList[selectedModelIndex].modelName}(${virginModelList[selectedModelIndex].modelVersion})`
            )).join(', ')}
          </p>
        </div>

        <div className="reviewRow" onClick={() => { setSeriesIndex(3) }}>
          <p className="reviewRowKey">Compatiblity Tag</p>
          <p className="reviewRowValue">{deploymentSelections.ctIndex != -1 && virginCTList[deploymentSelections.ctIndex].name}</p>
        </div>
      </div>
    )

  ];

  const preprocessDeploymentData = async (data) => {
    var processedData = [];

    for (let deployment of data) {
      processedData.push(
        [
          { Component: TextOnlyComponent, data: { text: deployment.name, customStyle: { fontWeight: 500, color: '#494949', fontSize: '14px' }, highlightOnHover: true } },
          { Component: TextOnlyComponent, data: { text: deployment.description, customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
          { Component: TextOnlyComponent, data: { text: deployment.compatibilityTag, customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
          { Component: TextOnlyComponent, data: { text: deployment.tasks.DEFAULT_SCRIPT, customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
          {
            Component: TagsListComponent, data: {
              tags: Object.keys(deployment.models), tableData: {
                headers: [{ text: 'Name' }, { text: 'Version' }, { text: 'Description' }],
                body: ((n) => Array.from({ length: Object.keys(deployment.models).length }, (_, i) => [{ Component: TextOnlyComponent, data: { text: Object.keys(deployment.models)[i], customStyle: { fontWeight: '500', fontSize: '14px', color: '#494949', fontFamily: 'Poppins' } } }, { Component: TextOnlyComponent, data: { text: deployment.models[Object.keys(deployment.models)[i]], customStyle: { fontWeight: '400', fontSize: '14px', color: '#74828F', fontFamily: 'Poppins' } } }, { Component: TextOnlyComponent, data: { text: "This is a sample description", customStyle: { fontWeight: '400', fontSize: '14px', color: '#74828F', fontFamily: 'Poppins' } } }]))(Object.keys(deployment.models))
              }, tableTitle: "Linked Models Detail", truncationLimit: 2, expandable: true, highlightOnHover: true
            }
          },
          { Component: (() => deploymentActions(deployment)), data: { taskVersion: "xxx" } }
        ]
      );
    }

    const newData = { ...deploymentViewData, body: processedData };
    updateDeploymentViewData(newData);
  }

  const deploymentActions = (deployment) => {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '24px' }} />

        <HoverText onHoverText={"Promote Deployment To Production"}>
          <img className={"download-model-icon"} src={"/assets/icons/promote_to_prod.svg"} onClick={() => {
            handlePromoteToProd(deployment.deploymentId);
          }}></img>
        </HoverText>

        <div style={{ marginRight: '12px' }} />

        <HoverText onHoverText={"Duplicate Selected Deployment"}>
          <img className={"download-model-icon"} src={"/assets/icons/duplicate.svg"} onClick={() => {
            var scriptVersion = deployment.tasks.DEFAULT_SCRIPT;
            var models = deployment.models;
            var compatibilityTag = deployment.compatibilityTag;

            var modelIndexes = [];
            var scriptIndex = -1;
            var ctIndex = -1;


            for (let modelName in models) {
              let index = 0;
              for (let obj of virginModelList) {
                if (obj.modelName === modelName && obj.modelVersion === models[modelName]) {
                  modelIndexes.push(index);
                }

                index++;
              }
            }

            for (let i = 0; i < virginScriptList.length; i++) {
              if (virginScriptList[i].version === scriptVersion) {
                scriptIndex = i;
                break;
              }
            }

            for (let i = 0; i < virginCTList.length; i++) {
              if (virginCTList[i].name === compatibilityTag) {
                ctIndex = i;
                break;
              }
            }

            setDeploymentSelections({
              name: deployment.name,
              description: deployment.description,
              scriptIndex: scriptIndex,
              modelIndexes: modelIndexes,
              ctIndex: ctIndex
            });

            setIsCreateNewModelOpen(true);

          }}></img>
        </HoverText>
      </div>

    )
  }

  const getDeploymentData = async () => {
    const res = await getRequest(APP_BASE_MDS_URL, 'api/v2/admin/deployments');
    setVirginDeploymentApiData(res.data.deployments);
    preprocessDeploymentData(res.data.deployments);
  }

  const getModelsData = async () => {
    const res = await getRequest(APP_BASE_MDS_URL, 'api/v2/admin/models');
    setVirginModelList(res.data.models);
  }


  const getCTData = async () => {
    const res = await getRequest(APP_BASE_MDS_URL, 'api/v2/admin/compatibilityTags');
    setVirginCTList(res.data.tags);
  }


  const getScriptData = async () => {
    const res = await getRequest(APP_BASE_MDS_URL, 'api/v2/admin/tasks');
    setVirginScriptList(res.data.tasks);
  }

  const createDeployment = async () => {
    const res = await postRequest(APP_BASE_MDS_URL, 'api/v2/admin/deployment', {
      "compatibilityTag": virginCTList[deploymentSelections.ctIndex].name,
      "models": deploymentSelections.modelIndexes.reduce((acc, modelIndex) => (acc[virginModelList[modelIndex].modelName] = virginModelList[modelIndex].modelVersion, acc), {}),
      "tasks": {
        "DEFAULT_SCRIPT": virginScriptList[deploymentSelections.scriptIndex].version
      },
      "name": deploymentSelections.name,
      "description": deploymentSelections.description,
    },);

    toast.success("Deployment Creation Successful!")
    setReload(!reload);
    setDeploymentSelections(defaultDeploymentSelections);
  }

  const handlePromoteToProd = async (deploymentId) => {
    dispatch(loaderActions.toggleLoader(true));
    const res = await postRequest(APP_BASE_MDS_URL, 'api/v2/admin/deployment/promote', {
      "deploymentId": deploymentId,
      "comments": "none"
    },);

    dispatch(loaderActions.toggleLoader(false));

    if (200 <= res.status && res.status < 300) {
      toast.success("Deployment Promoted");
    }
  }


  const searchFilter = (keyword) => {
    const keywords = keyword.split(" ");
    var temp = []

    for (let deployment of virginDeploymentApiData) {
      var isValid = true;
      var modelSearchString = "";
      for (let modelName in deployment.models) {
        modelSearchString += modelName + deployment.models[modelName];
      }

      var candidateString = deployment.compatibilityTag + deployment.tasks.DEFAULT_SCRIPT + deployment.name + deployment.description + modelSearchString;

      for (let singleKeyword of keywords) {
        if (!candidateString.toLowerCase().includes(singleKeyword.toLowerCase())) {
          isValid = false;
          break;
        }
      }

      if (isValid) {
        temp.push(deployment);
      }
    }

    if (keyword == "") {
      temp = virginDeploymentApiData;
    }
    console.log(temp);
    preprocessDeploymentData(temp);

  }

  useEffect(() => {
    dispatch(loaderActions.toggleLoader(true));
    getModelsData();
    getCTData();
    getScriptData();
  }, [reload]);

  useEffect(() => {
    if (virginCTList.length != 0 && virginScriptList.length != 0 && virginModelList.length != 0) {
      getDeploymentData().then(() => {
        dispatch(loaderActions.toggleLoader(false));
      });;
    }
  }, [virginCTList, virginScriptList, virginModelList]);

  return (
    <>

      {onDiffPage && <DeploymentDiff onBack={() => {
        setOnDiffPage(false);
        setIsComparisionModelOpen(false);
      }} deployment1={virginDeploymentApiData[comparisionSelectedIndexes[0]]} deployment2={virginDeploymentApiData[comparisionSelectedIndexes[1]]} />}

      {!onDiffPage && <div>
        {isComparisionModalOpen && <div>
          <div className="translucent-bg"></div>

          <div className="comparisionModal">
            <img className="modal-close-button" src="/assets/icons/close.svg" onClick={() => { setIsComparisionModelOpen(false); }}></img>
            <p className="heading4 center">Select Two Deployments For Comparision</p>
            <div className="flex">
              <DropdownButton
                as={ButtonGroup}
                key="0"
                title={comparisionSelectedIndexes[0] != -1 ? virginDeploymentApiData[comparisionSelectedIndexes[0]].name : "Deployment 1"}
                variant=""
                bsPrefix={"client-id-dropdown" + " " + "buttonText"}
                onSelect={(selectedIndex) => {
                  setComparisionSelectedIndexes([Number(selectedIndex), comparisionSelectedIndexes[1]]);

                }}
                children={virginDeploymentApiData.map((item, idx) => (
                  <Dropdown.Item key={idx} eventKey={idx}>
                    {item.name}
                  </Dropdown.Item>
                ))}
              ></DropdownButton>

              <DropdownButton
                as={ButtonGroup}
                key="0"
                id="000"
                size="lg"
                title={comparisionSelectedIndexes[1] != -1 ? virginDeploymentApiData[comparisionSelectedIndexes[1]].name : "Deployment 2"}
                variant=""
                bsPrefix={"client-id-dropdown" + " " + "buttonText"}
                onSelect={(selectedIndex) => {
                  setComparisionSelectedIndexes([comparisionSelectedIndexes[0], Number(selectedIndex)]);
                }}
                children={virginDeploymentApiData.map((item, idx) => (
                  <Dropdown.Item key={idx} eventKey={idx}>
                    {item.name}
                  </Dropdown.Item>
                ))}
              ></DropdownButton>

              <div className="proceed-button" onClick={() => {
                if (comparisionSelectedIndexes[0] != -1 && comparisionSelectedIndexes[1] != -1) {
                  setOnDiffPage(true);
                }
                else {
                  toast.error("Please select valid values");
                }

              }}>
                <p className="button-text2">➤</p>
              </div>

            </div>

          </div></div>}

        {isCreateNewModelOpen &&
          <Modal seriesInfo={{
            isSeries: true,
            hasNext: seriesIndex != 4,
            hasPrev: seriesIndex != 0,
            onNext: () => {
              if ((seriesIndex == 0 && (deploymentSelections.name == "" || deploymentSelections.description == "")) ||
                (seriesIndex == 1 && deploymentSelections.scriptIndex == -1) ||
                (seriesIndex == 2 && deploymentSelections.modelIndexes.length == 0) ||
                (seriesIndex == 3 && deploymentSelections.ctIndex == -1)
              ) {
                toast.error("Invalid values");
              }
              else {
                setSeriesIndex(seriesIndex + 1);
              }
            },
            onPrev: () => {
              setSeriesIndex(seriesIndex - 1);
            },
            onDone: () => {
              createDeployment();
              setIsCreateNewModelOpen(false);
            }
          }}
            isOpen={isCreateNewModelOpen} onClose={closeModal} closeButtonDisabled={false} customStyle={{ maxHeight: '90%', height: '654px' }} >
            <div className='tagsListModalContent'>
              <div className='tagsListModalHeader'>{seriesTitles[seriesIndex]}</div>

              <div className="progressIndicator">
                <div onClick={() => {
                  setSeriesIndex(0)
                }} className={`singleIndicator ${seriesIndex == 0 ? "inProgress" : "finished"}`}></div>
                <div onClick={() => {
                  if (seriesIndex > 1 || !(deploymentSelections.name == "" || deploymentSelections.description == "")) { setSeriesIndex(1) } else { toast.error("Invalid values"); }
                }} className={`singleIndicator ${seriesIndex < 1 ? "" : seriesIndex == 1 ? "inProgress" : "finished"}`}></div>
                <div onClick={() => {
                  if (seriesIndex > 2 || !(deploymentSelections.scriptIndex == -1)) { setSeriesIndex(2) } else { toast.error("Invalid values"); }
                }} className={`singleIndicator ${seriesIndex < 2 ? "" : seriesIndex == 2 ? "inProgress" : "finished"}`}></div>
                <div onClick={() => {
                  if (seriesIndex > 3 || !(deploymentSelections.modelIndexes.length == 0)) { setSeriesIndex(3) } else { toast.error("Invalid values"); }
                }} className={`singleIndicator ${seriesIndex < 3 ? "" : seriesIndex == 3 ? "inProgress" : "finished"}`}></div>
              </div>

              {seriesPages[seriesIndex]}

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

                  <div className="compareButton" onClick={() => {
                    setIsComparisionModelOpen(true);
                  }}>
                    <p className="buttonTextBlack">Compare</p>
                  </div>

                  <div className="new-admin-page-upload-btn cursorPointer" onClick={() => { setIsCreateNewModelOpen(true); setSeriesIndex(0); }}>
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
        </div></div>}
    </>
  )
};

export default DeploymentPage;
