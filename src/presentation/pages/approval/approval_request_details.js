import { APP_BASE_MDS_URL, VERDICT_APPROVE, VERDICT_REJECT } from "core/constants";
import { deleteRequest, fetchHeaders, getRequest, postRequest } from "data/remote_datasource";
import Dropdown from "presentation/components/DropdownInternal/dropdown";
import React, { useEffect, useState } from "react";
import tagDescription from "../admin/tagsTable/TagsDescription/tagDescription";
import { useDispatch } from "react-redux";
import store, { loaderActions } from "presentation/redux/stores/store";
import { toast } from "react-toastify";
import { useRef } from "react";


export default function ApprovalRequestDetails(props) {
    const setSelectedDeploymentData = props.setSelectedDeploymentData;
    const deploymentData = props.deploymentData;
    const forceUpdateData = props.forceUpdateData;
    const [details, setDetails] = useState({
        name: null,
        description: "-1",
        compatibilityTag: "-1",
        tasks: {
            "DEFAULT_SCRIPT": "-1"
        },
        models: {},

    });
    const isMyRequest = props.isMyRequest;
    const comments = deploymentData.reviews;
    const dispatch = useDispatch();
    var currentVerdict = VERDICT_REJECT;
    const inputRef = useRef(null);

    useEffect(() => {
        fetchRequestDetails();
    }, []);

    const fetchRequestDetails = async () => {
        dispatch(loaderActions.toggleLoader(true));
        const currentState = store.getState().userReducer;

        var clientId = currentState.clientId;
        var clientPairs = currentState.orgData[currentState.org].clientPairs;
        var counterClientId = "";
        for (var pair of clientPairs) {
            if (pair.prodClient!=null && pair.prodClient.id == clientId) {
                counterClientId = pair.testClient.id;
                break;
            }
        }

        var headers = {
            ...fetchHeaders(), ClientId: counterClientId,
        };
        const res = await getRequest(APP_BASE_MDS_URL, `api/v2/admin/deployments/${deploymentData.deploymentId}`, headers);
        if (res != null) {
            setDetails(res.data);
        }
        dispatch(loaderActions.toggleLoader(false));
    }

    const handleReview = async (verdict, message) => {
        dispatch(loaderActions.toggleLoader(true));
        const res = await postRequest(APP_BASE_MDS_URL, 'api/v2/admin/request/review', {
            "requestId": deploymentData.id,
            "verdict": verdict,
            "comments": message
        });
        dispatch(loaderActions.toggleLoader(false));

        if (200 <= res.status && res.status < 300) {
            toast.success("Request Submitted");
            forceUpdateData();
        }
    }

    const handleDeleteRequest = async () => {
        dispatch(loaderActions.toggleLoader(true));
        const res = await deleteRequest(APP_BASE_MDS_URL, 'api/v2/admin/request', {
            "requestId": deploymentData.id,
        });
        dispatch(loaderActions.toggleLoader(false));

        if (200 <= res.status && res.status < 300) {
            toast.success("Request Deleted");
            forceUpdateData();
            setSelectedDeploymentData(-1);
        }
    }

    const handleProcessRequest = async () => {
        dispatch(loaderActions.toggleLoader(true));
        const res = await postRequest(APP_BASE_MDS_URL, 'api/v2/admin/request/process', {
            "requestId": deploymentData.id,
        });
        dispatch(loaderActions.toggleLoader(false));

        if (200 <= res.status && res.status < 300) {
            toast.success("Request Processed");
            forceUpdateData();
        }
    }

    return (
        <div>
            {(details.name != null) && <div className={`approvalPageContent`}>
                <div className="leftPane">
                    <div className={`subHeader flexRow`}>
                        <div
                            onClick={() => {
                                setSelectedDeploymentData(-1);
                            }}
                            style={{ display: "flex" }}
                        >
                            <img
                                src={"/assets/icons/backArrow.svg"}
                                onClick={() => { }}
                                style={{
                                    marginRight: "12px",
                                    cursor: "pointer",
                                }}
                            />
                            <div className={`subHeaderText`}>Details</div>
                        </div>
                    </div>

                    <div className="deploymentDetails">
                        <div>
                            <p className="deploymentDetailsLine">
                                <span className="bold">Id:</span> {deploymentData.deploymentId}
                            </p>
                            <p className="deploymentDetailsLine">
                                <span className="bold">Name:</span> {details.name}
                            </p>
                            <p className="deploymentDetailsLine">
                                <span className="bold">Description:</span> {details.description}
                            </p>
                            <p className="deploymentDetailsLine">
                                <span className="bold">Compatiblity Tag:</span> {details.compatibilityTag}
                            </p>
                            <p className="deploymentDetailsLine">
                                <span className="bold">Script:</span> {details.tasks.DEFAULT_SCRIPT}
                            </p>
                            <p className="deploymentDetailsLine">
                                <span className="bold">Models: </span>
                                {Object.entries(details.models).map(([key, value]) => `${key}(v${value})`).join(', ')}

                            </p>
                        </div>

                        {isMyRequest && <div className="deleteRequestBox" onClick={handleDeleteRequest}>
                            <p className="warningText">DELETE THIS REQUEST</p>
                        </div>}

                        {!isMyRequest && <div className="processRequestBox" onClick={handleProcessRequest}>
                            <p className="warningText">PROCESS THIS REQUEST</p>
                        </div>}
                    </div>
                </div>

                <div className="commentSection">
                    <div>
                        <div className={`subHeader`}>
                            <div className={`subHeaderText`}>Review History</div>
                            <p className="reviewHistorySubtitile">
                                null more approvals required for the promotion.
                            </p>
                        </div>

                        {comments.map((comment) => createCommentMessageBox(comment.reviewer, comment.comments, comment.verdict, comment.postedAt))}
                    </div>

                    {!isMyRequest && <div className="inputCommentBox">
                        <div className="subHeaderActions">
                            <Dropdown
                                options={[VERDICT_APPROVE, VERDICT_REJECT]}
                                handleSelection={(_view) => {
                                    currentVerdict = _view;
                                }}
                                defaultSelectedOption={currentVerdict}
                            />
                        </div>
                        <input
                            type="text"
                            name="reviewMessage"
                            className="inputModal-textfield commentInput"
                            placeholder={"Write comment to support your verdict"}
                            ref={inputRef}
                        />
                        <div className="submitCommentButton" onClick={() => {
                            handleReview(currentVerdict, inputRef.current.value);
                        }}>
                            <img
                                src="/assets/icons/minimal_submit.svg"
                                style={{ height: "16px" }}
                                className="submitIcon"
                            ></img>
                        </div>
                    </div>}
                </div>

            </div>}
        </div>
    );
}

const createCommentMessageBox = (author, message, verdict, creationTimestamp) => {
    const parsedDate = new Date(creationTimestamp);
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

    return (<div>
        <div className={"commentBox " + (verdict == VERDICT_APPROVE ? 'approvedBox' : 'rejectBox')}>
            <p className="commentTitle">{author}</p>
            <p className="commentBody">
                {message}
            </p>
            <div className="commentFooter">
                <p className="commentTime">
                    {createdAt}
                </p>
                <p className={"commentStatus " + (verdict == VERDICT_APPROVE ? 'acceptedText' : 'rejectedText')}>{verdict}</p>
            </div>
        </div>
    </div>);
}