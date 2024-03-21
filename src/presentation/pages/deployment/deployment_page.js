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

const generateClickableCard = (title, subtitle) => {
  return (
    <div className="selectableCard clickableItem">
      <img src={"/assets/icons/red_close.svg"} className='selectableCardCloseIcon' />
      <div className="selectableCardContent">
        <p className="selectableCardTitle">{title}</p>
        <p className="selectableCardSubTitle">{subtitle}</p>
      </div>
    </div>
  )
}

const generateClickableCardSelected = (title, subtitle, renderCloseButton = true) => {
  return (
    <div className="selectableCard clickableItem">
      <img src={"/assets/icons/red_close.svg"} className={`selectableCardCloseIcon ${renderCloseButton ? "cardCanBeDeleted" : ""}`} />
      <div className="selectableCardContent cardIsSelected">
        <p className="selectableCardTitle">{title}</p>
        <p className="selectableCardSubTitle">{subtitle}</p>
      </div>
    </div>
  )
}

const DeploymentPage = () => {
  const [seriesIndex, setSeriesIndex] = useState(0);
  const [isCreateNewModelOpen, setIsCreateNewModelOpen] = useState(true);
  const closeModal = () => {
    setIsCreateNewModelOpen(false);
  };
  const seriesTitles = [
    "Create A New Deployment - Enter Deployment Details",
    "Create A New Deployment - Select Script Version",
    "Create A New Deployment - Select Models",
    "Create A New Deployment - Select Compatibility Tag",
    "Create A New Deployment - Review Changes",
  ]
  const [deploymentViewData, updateDeploymentViewData] = useState({
    headers: [
      { text: 'State Name' },
      { text: 'Description' },
      { text: 'Compatability Tag' },
      { text: 'WorkflowScript' },
      { text: 'Models' },
      { text: 'Actions' }
    ],
    body: [
      [{ Component: TextOnlyComponent, data: { text: "State 1", customStyle: { fontWeight: 500, color: '#494949', fontSize: '14px' }, highlightOnHover: true } },
      { Component: TextOnlyComponent, data: { text: "This is a sample mfking description", customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
      {
        Component: TagsListComponent, data: {
          tags: ["ct-1-only"], tableData: {
            headers: [{ text: 'Name' }, { text: 'Description' }],
            body: [
              [{ Component: TextOnlyComponent, data: { text: 'v' + "34.0.0", customStyle: { fontWeight: '500', fontSize: '14px', color: '#494949', fontFamily: 'Poppins' } } }, { Component: TextOnlyComponent, data: { text: "This is a sample mfin description", customStyle: { fontWeight: '400', fontSize: '14px', color: '#74828F', fontFamily: 'Poppins' } } }]
            ]
          }, tableTitle: "Linked Compatiblity Tag Details", truncationLimit: 2, expandable: true, highlightOnHover: true
        }
      },
      {
        Component: TagsListComponent, data: {
          tags: ["v34.0.0"], tableData: {
            headers: [{ text: 'Name' }, { text: 'Description' }],
            body: [
              [{ Component: TextOnlyComponent, data: { text: 'v' + "34.0.0", customStyle: { fontWeight: '500', fontSize: '14px', color: '#494949', fontFamily: 'Poppins' } } }, { Component: TextOnlyComponent, data: { text: "This is a sample mfin description", customStyle: { fontWeight: '400', fontSize: '14px', color: '#74828F', fontFamily: 'Poppins' } } }]
            ]
          }, tableTitle: "Linked Script Details", truncationLimit: 2, expandable: true, highlightOnHover: true
        }
      },
      {
        Component: TagsListComponent, data: {
          tags: ["model-name-1", "model-name-2", "model-name-1", "model-name-2"], tableData: {
            headers: [{ text: 'Name' }, { text: 'Version' }, { text: 'Description' }],
            body: [
              [{ Component: TextOnlyComponent, data: { text: 'v' + "34.0.0", customStyle: { fontWeight: '500', fontSize: '14px', color: '#494949', fontFamily: 'Poppins' } } }, { Component: TextOnlyComponent, data: { text: "v1.4.3", customStyle: { fontWeight: '400', fontSize: '14px', color: '#74828F', fontFamily: 'Poppins' } } }, { Component: TextOnlyComponent, data: { text: "This is a sample mfin description", customStyle: { fontWeight: '400', fontSize: '14px', color: '#74828F', fontFamily: 'Poppins' } } }]
            ]
          }, tableTitle: "Linked Models Detail", truncationLimit: 2, expandable: true, highlightOnHover: true
        }
      },
      { Component: deploymentActions, data: { taskVersion: "v34.0.0" } }]
    ],
  });

  const seriesPages = [
    (<form className="expanded">
      <p className="modalSubHeading">Name</p>
      <input
        id="deploymentName"
        type="text"
        name="deploymentName"
        className="model-upload-custom-dropdown itemsPadding"
        placeholder={"Enter name here"}
      />

      <p className="modalSubHeading">Description</p>
      <textarea
        id="deploymentDescription"
        name="deploymentDescription"
        className="model-upload-custom-dropdown"
        placeholder={"Enter description here"}
        style={{
          height: "300px",
          paddingTop: "16px",
          outline: "none"
        }}
      />
    </form>),

    (<form className="expanded">
      <p className="modalSubHeading">Select Script</p>
      <input
        id="searchScript"
        type="text"
        name="searchScript"
        className="model-upload-custom-dropdown itemsPaddingVerySmall"
        placeholder={"Search scripts"}
      />
      <div className="selectableCardsRow itemsPadding">
        {generateClickableCardSelected("v65.0.0", "84883 users", false)}
        {generateClickableCard("v12.0.0", "183736 users")}
        {generateClickableCard("v43.0.0", "849 users")}
      </div>
    </form>),

    (<form className="expanded">
      <p className="modalSubHeading">Selected Models</p>
      <input
        id="searchSelectedModel"
        type="text"
        name="searchSelectedModel"
        className="model-upload-custom-dropdown itemsPaddingVerySmall"
        placeholder={"Search models"}
      />

      <div className="selectableCardsRow itemsPadding">
        {generateClickableCardSelected("nude_net (v2.7.1)", "84883 users")}
      </div>

      <p className="modalSubHeading">Select more</p>
      <input
        id="searchUnselectedModel"
        type="text"
        name="searchUnselectedModel"
        className="model-upload-custom-dropdown itemsPaddingVerySmall fadedBackground"
        placeholder={"Search models"}
      />
      <div className="selectableCardsRow itemsPadding">
        {generateClickableCard("res_med", "183736 users")}
        {generateClickableCard("eff_lite", "849 users")}
      </div>
    </form>),

    (<form className="expanded">
      <p className="modalSubHeading">Select Compatability Tag</p>
      <input
        id="searchCompatiblityTag"
        type="text"
        name="searchCompatiblityTag"
        className="model-upload-custom-dropdown itemsPaddingVerySmall"
        placeholder={"Search compatiblity tags"}
      />
      <div className="selectableCardsRow itemsPadding">
        {generateClickableCardSelected("frontend-no-inputs", "84883 users", false)}
        {generateClickableCard("broken-model", "183736 users")}
        {generateClickableCard("old-legacy", "849 users")}
      </div>
    </form>),

    (
      <div>
        <p className="modalSubHeading">Please review changes. You won’t be able to edit the values afterwards.</p>
        <div className="reviewRow" onClick={() => { setSeriesIndex(0) }}>
          <p className="reviewRowKey">Deployment Name</p>
          <p className="reviewRowValue">2.5.0</p>
        </div>

        <div className="reviewRow" onClick={() => { setSeriesIndex(0) }}>
          <p className="reviewRowKey">Deployment Description</p>
          <p className="reviewRowValue">This is an extremelty long description of the model, isse zyada badi description ki zaroorat nhi!</p>
        </div>


        <div className="reviewRow" onClick={() => { setSeriesIndex(1) }}>
          <p className="reviewRowKey">Workflow Script</p>
          <p className="reviewRowValue">v52.0.0</p>
        </div>

        <div className="reviewRow" onClick={() => { setSeriesIndex(2) }}>
          <p className="reviewRowKey">Models</p>
          <p className="reviewRowValue">efficient-lite-quant0(v2.3.4), efficient-lite-quant0(v2.3.4), efficient-lite-quant0(v2.3.4), efficient-lite-quant0(v2.3.4)</p>
        </div>

        <div className="reviewRow" onClick={() => { setSeriesIndex(3) }}>
          <p className="reviewRowKey">Compatiblity Tag</p>
          <p className="reviewRowValue">no-user-input-v3</p>
        </div>
      </div>
    )

  ];

  return (
    <>
      {isCreateNewModelOpen &&
        <Modal seriesInfo={{
          isSeries: true,
          hasNext: seriesIndex != 4,
          hasPrev: seriesIndex != 0,
          onNext: () => {
            setSeriesIndex(seriesIndex + 1);
          },
          onPrev: () => {
            setSeriesIndex(seriesIndex - 1);
          }
        }}
          isOpen={isCreateNewModelOpen} onClose={closeModal} closeButtonDisabled={false} customStyle={{ maxHeight: '90%', height: '654px' }} >
          <div className='tagsListModalContent'>
            <div className='tagsListModalHeader'>{seriesTitles[seriesIndex]}</div>

            <div className="progressIndicator">
              <div onClick={() => { setSeriesIndex(0) }} className={`singleIndicator ${seriesIndex == 0 ? "inProgress" : "finished"}`}></div>
              <div onClick={() => { setSeriesIndex(1) }} className={`singleIndicator ${seriesIndex < 1 ? "" : seriesIndex == 1 ? "inProgress" : "finished"}`}></div>
              <div onClick={() => { setSeriesIndex(2) }} className={`singleIndicator ${seriesIndex < 2 ? "" : seriesIndex == 2 ? "inProgress" : "finished"}`}></div>
              <div onClick={() => { setSeriesIndex(3) }} className={`singleIndicator ${seriesIndex < 3 ? "" : seriesIndex == 3 ? "inProgress" : "finished"}`}></div>
            </div>

            {seriesPages[seriesIndex]}

          </div>
        </Modal>
      }
      <div className={`flexColumn adminPage`}>
        <div className={`flexColumn adminPageHeader`}>
          <div className={`adminPageTitle`}>Deployment Management</div>
          <div className={`adminPageSubtitle`}>Create New Deployments</div>
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
                  />
                </form>

                <div className="new-admin-page-upload-btn cursorPointer" onClick={() => { setIsCreateNewModelOpen(true); setSeriesIndex(0); }}>
                  <img src={"/assets/icons/CreatePlus.svg"} className={``} />
                </div>
              </div>
              }
            </div>
          }
          <div className={`tasksTableView flexColumn overflowAuto`}>
            <Table data={deploymentViewData} />
          </div>
        </div>
      </div>
    </>
  )
};

export default DeploymentPage;
