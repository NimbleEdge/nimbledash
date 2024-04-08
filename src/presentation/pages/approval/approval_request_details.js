import Dropdown from "presentation/components/DropdownInternal/dropdown";
import React from "react";


export default function ApprovalRequestDetails(props) {
    const setSelectedRowIndex = props.setSelectedRowIndex;
    const isMyRequest = props.isMyRequest;

    return (
        <div className={`approvalPageContent`}>
            <div className="leftPane">
                <div className={`subHeader flexRow`}>
                    <div
                        onClick={() => {
                            setSelectedRowIndex(-1);
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

                    {isMyRequest && <div className="deleteRequestBox">
                        <p className="warningText">DELETE THIS REQUEST</p>
                    </div>}
                </div>
            </div>

            <div className="commentSection">
                <div>
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
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.
                        </p>
                        <div className="commentFooter">
                            <p className="commentTime">
                                24th December, 2024 | 20:45 IST
                            </p>
                            <p className="commentStatus rejectedText">REJECTED</p>
                        </div>
                    </div>

                    <div className="commentBox approvedBox">
                        <p className="commentTitle">d11-poc-prod</p>
                        <p className="commentBody">
                            Contrary to popular belief, Lorem Ipsum is not simply random
                            text. It has roots in a piece of classical Latin literature
                            from 45 BC, making it over 2000 years old.
                        </p>
                        <div className="commentFooter">
                            <p className="commentTime">
                                24th December, 2024 | 20:45 IST
                            </p>
                            <p className="commentStatus acceptedText">APPROVED</p>
                        </div>
                    </div>
                </div>

                {!isMyRequest && <div className="inputCommentBox">
                    <div className="subHeaderActions">
                        <Dropdown
                            options={["Approve", "Reject"]}
                            handleSelection={(_view) => { }}
                            defaultSelectedOption={"Raised Requests"}
                        />
                    </div>
                    <input
                        type="text"
                        name="clientID"
                        className="inputModal-textfield commentInput"
                        placeholder={"Write comment to support your verdict"}
                    />
                    <div className="submitCommentButton">
                        <img
                            src="/assets/icons/minimal_submit.svg"
                            style={{ height: "16px" }}
                            className="submitIcon"
                        ></img>
                    </div>
                </div>}
            </div>

        </div>
    );
}