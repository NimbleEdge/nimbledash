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

const ApprovalPage = () => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(1);
  const [reload, setReload] = useState(true);
  const defaultDeploymentSelections = {
    name: "",
    description: "",
    scriptIndex: -1,
    modelIndexes: [],
    ctIndex: -1,
  };
  const dispatch = useDispatch();

  const [deploymentViewData, updateDeploymentViewData] = useState({
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

  const preprocessDeploymentData = async (data) => {
    var processedData = [];

    for (let deployment of data) {
      processedData.push([
        {
          Component: TextOnlyComponent,
          data: {
            text: "State 1",
            onClick: () => {
              setSelectedRowIndex(0);
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
            text: "This is a random description",
            onClick: () => {
              setSelectedRowIndex(0);
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
            text: "naman.anand@nimbleedgehq.ai",
            onClick: () => {
              setSelectedRowIndex(0);
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
            text: "21/06/1999",
            onClick: () => {
              setSelectedRowIndex(0);
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
            text: "3",
            onClick: () => {
              setSelectedRowIndex(0);
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
            text: "5",
            onClick: () => {
              setSelectedRowIndex(0);
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
            text: "PENDING",
            onClick: () => {
              setSelectedRowIndex(0);
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

    const newData = { ...deploymentViewData, body: processedData };
    updateDeploymentViewData(newData);
    dispatch(loaderActions.toggleLoader(false));
  };

  useEffect(() => {
    preprocessDeploymentData([1, 2, 3, 4]);
  }, [reload]);

  return (
    <>
      <div className={`flexColumn adminPage relative`}>
        <div className={`flexColumn adminPageHeader`}>
          <div className={`adminPageTitle`}>Edge Deployment Management</div>
          <div className={`adminPageSubtitle`}>Manage Deployments</div>
        </div>
        <div className="lineDivider"></div>
        <div className={`approvalPageContent`}>
          {/* {selectedRowIndex == -1 && (
            <div>
              <div className={`subHeader flexRow`}>
                <div className={`subHeaderText`}>Correlations</div>
                {
                  <div className="subHeaderActions">
                    <Dropdown
                      options={["Raised Requests", "My Requests"]}
                      handleSelection={(_view) => {}}
                      defaultSelectedOption={"Raised Requests"}
                    />
                  </div>
                }
              </div>

              <div className={`tasksTableView flexColumn overflowAuto`}>
                <Table data={deploymentViewData} />
              </div>
            </div>
          )} */}

          {selectedRowIndex != -1 && (
            <div className="leftPane">
              <div className={`subHeader flexRow`}>
                <div style={{ display: "flex" }}>
                  <img
                    src={"/assets/icons/backArrow.svg"}
                    onClick={() => {}}
                    style={{
                      marginRight: "12px",
                      cursor: "pointer",
                    }}
                  />
                  <div className={`subHeaderText`}>Correlations</div>
                </div>
              </div>

              <div className="deploymentDetails">
                <p className="deploymentDetailsLine">
                  <span className="bold">Name:</span> dep_state1
                </p>
                <p className="deploymentDetailsLine">
                  <span className="bold">Description:</span> Lorem Ipsum is
                  simply dummy text of the printing and typesetting industry.
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s, when an unknown printer took a galley of type
                  and scrambled it to make a type specimen book. It has survived
                  not only five centuries, but also the leap into electronic
                  typesetting, remaining essentially unchanged. It was
                  popularised in the 1960s with the release of Letraset sheets
                  containing Lorem Ipsum passages, and more recently with
                  desktop publishing software like Aldus PageMaker including
                  versions of Lorem Ipsum.
                </p>
                <p className="deploymentDetailsLine">
                  <span className="bold">Compatiblity Tag:</span> experience-app
                </p>
                <p className="deploymentDetailsLine">
                  <span className="bold">Script:</span> v20.0.0
                </p>
                <p className="deploymentDetailsLine">
                  <span className="bold">Models:</span> nudenet(v1.0.0),
                  efficient-net-lite0(v3.0.0)
                </p>
              </div>
            </div>
          )}

          <div className="commentSection">
            <div className={`subHeader`}>
              <div className={`subHeaderText`}>Review History</div>
              <p className="reviewHistorySubtitile">
                2 more approvals required for the promotion.
              </p>
            </div>

            <div className="commentBox rejectBox">
              <p className="commentTitle">d11-poc-prod</p>
              <p className="commentBody">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old.
              </p>
              <div className="commentFooter">
                <p className="commentTime">24th December, 2024 | 20:45 IST</p>
                <p className="commentStatus rejectedText">REJECTED</p>
              </div>
            </div>

            <div className="commentBox approvedBox">
              <p className="commentTitle">d11-poc-prod</p>
              <p className="commentBody">
                Contrary to popular belief, Lorem Ipsum is not simply random
                text. It has roots in a piece of classical Latin literature from
                45 BC, making it over 2000 years old.
              </p>
              <div className="commentFooter">
                <p className="commentTime">24th December, 2024 | 20:45 IST</p>
                <p className="commentStatus acceptedText">APPROVED</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApprovalPage;
