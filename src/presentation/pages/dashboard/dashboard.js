import React, { useEffect } from "react";
import "./dashboard_page.css";
import "react-dropdown/style.css";
import DropdownComponent from "../../components/dropdownMenu/dropdown";
import { useState } from "react";
import InputModal from "../../components/inputModal/inputModal";
import { useNavigate } from "react-router-dom";
import {
    ACCESS_TOKEN,
    APP_BASE_MDS_URL,
    CLIENT_ID,
    FORM_PASSWORD,
    FORM_USERNAME,
} from "core/constants";
import { useDispatch, useSelector } from "react-redux";
import store, {
    loaderActions,
    userActions,
} from "presentation/redux/stores/store";
import "react-toastify/dist/ReactToastify.css";
import { LOGIN_PAGE_ROUTE } from "presentation/routes/route-paths";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { fetchClientIDList, fetchModelList } from "data/apis";
import DashboardMetrics from "./dashboardMetrics";
import { getRequest } from "data/remote_datasource";

const subtractDays = (date, days) => {
    date.setDate(date.getDate() - days);
    return date;
};

const getIntervalString = (intervalObject) => {
    const intervalString =
        intervalObject["startDate"].getDate() +
        "/" +
        (
            parseInt(intervalObject["startDate"].getMonth()) + 1
        ).toString() +
        "/" +
        intervalObject["startDate"].getFullYear() +
        " - " +
        intervalObject["endDate"].getDate() +
        "/" +
        (
            parseInt(intervalObject["endDate"].getMonth()) + 1
        ).toString() +
        "/" +
        intervalObject["endDate"].getFullYear()
    return intervalString;
}

const DashboardPage = () => {
    const [modelJson, setModelJson] = useState({});
    const [selectedModelIndex, setSelectedModelIndex] = useState(0);
    const [selectedVersionIndex, setSelectedVersionIndex] = useState(0);
    const [isModalVisible, setModalVisiblity] = useState(true);
    const [internalInterval, setInternalInterval] = useState({
        startDate: subtractDays(new Date(), 7),
        endDate: new Date(),
        key: "selection",
    });
    const [interval, setInterval] = useState({
        startDate: subtractDays(new Date(), 7),
        endDate: new Date(),
        key: "selection",
    });
    const [isDatePickerVisible, toggleDatePicker] = useState(false);
    const dispatch = useDispatch();
    
    // @ts-ignore
    const globalUserState = useSelector((state) => state.userReducer);

    const handleClientIDChange = (input) => {
        localStorage.setItem(CLIENT_ID, input);

        //@ts-ignore
        dispatch(userActions.setUser({
            ...globalUserState,
            clientId: input
        }));

        setModalVisiblity(false);
    };

    const closeModalCallback = () => {
        setModalVisiblity(false);
    };

    const handleSelect = (ranges) => {
        setInternalInterval(ranges["selection"])
    };

    const handleModelListUpdate = (modelsList) => {
        const tempJson = {};
        tempJson["All Models"] = ["Latest"];
        modelsList.forEach((modelNameVersionMap) => {
            var key = modelNameVersionMap.modelName;
            if (tempJson.hasOwnProperty(key)) {
                tempJson[key].push(modelNameVersionMap.modelVersion);
            } else {
                tempJson[key] = ["All Versions", modelNameVersionMap.modelVersion];
            }
        });
        setModelJson(tempJson);
    }

    useEffect(() => {
        dispatch(loaderActions.toggleLoader(true));
        if (globalUserState.clientIdList.length == 0) {
            getRequest(APP_BASE_MDS_URL, 'api/v2/admin/user/clients').then((res) => {

                // @ts-ignore
                dispatch(userActions.setUser({
                    ...globalUserState,
                    clientIdList: res.data.Clients
                }));
                dispatch(loaderActions.toggleLoader(false));
            });
        }

        if (globalUserState.clientId != 'null' && globalUserState.clientId != null) {
            setModalVisiblity(false);
            getRequest(APP_BASE_MDS_URL,"api/v2/admin/models").then((res) => {
                handleModelListUpdate(res.data.models);
                dispatch(loaderActions.toggleLoader(false));
            });
        }

        if(globalUserState.clientId == 'null' || globalUserState.clientId == null){
            dispatch(loaderActions.toggleLoader(false));
        }

    }, [globalUserState]);

    return (
        <div className="dashboardPage">
            {
                isModalVisible &&
                <InputModal
                    clientIDList={globalUserState.clientIdList}
                    title={"Enter clientID"}
                    subTitle={
                        "Entered clientId will be verified from our backend services"
                    }
                    initValue={globalUserState.clientId == null ? "Select" : globalUserState.clientId}
                    getInputCallback={handleClientIDChange}
                    closeModalCallback={closeModalCallback}>
                </InputModal>
            }
            {
                Object.keys(modelJson).length != 0 &&
                <div className="dashboard-content">
                    <div className="page-title">
                        <p className="heading3">Dashboard</p>
                        <p className="subHeading">Analytics Overview.</p>
                    </div>
                    <div className="dropdown-array">
                        <div className="clientID-selector" onClick={() => setModalVisiblity(true)}>
                            <p className="buttonText spinner-text">{"Client ID"}</p>
                        </div>
                        <div>
                            <DropdownComponent itemList={Object.keys(modelJson)} customClass={"custom-dropdown"} selectedItemIndex={selectedModelIndex}
                                onChangeCallback={(modelIndex) => {
                                    setSelectedModelIndex(modelIndex);
                                    setSelectedVersionIndex(0);
                                }}>
                            </DropdownComponent>
                            <DropdownComponent itemList={modelJson[Object.keys(modelJson)[selectedModelIndex]]} customClass={"custom-dropdown"} selectedItemIndex={selectedVersionIndex}
                                onChangeCallback={(versionIndex) => {
                                    setSelectedVersionIndex(versionIndex);
                                }}>
                            </DropdownComponent>
                        </div>
                        <div className="interval-box">
                            <p className="buttonText intervalText" onClick={() => toggleDatePicker(true)}>
                                {getIntervalString(interval)}
                            </p>
                            {isDatePickerVisible && (
                                <div>
                                    <DateRangePicker className="datePicker" ranges={[internalInterval]} onChange={handleSelect} />
                                    <div className="datePickerApply" onClick={async () => {
                                        toggleDatePicker(false);
                                        setInterval(internalInterval);
                                    }}>
                                        <p className="centerText">Apply</p>
                                    </div>
                                    <div className="datePickerCancel" onClick={() => {
                                        toggleDatePicker(false);
                                        setInternalInterval(interval);
                                    }}>
                                        <p className="centerText">Cancel</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <DashboardMetrics clientID={globalUserState.clientId} selectedModelIndex={selectedModelIndex} selectedVersionIndex={selectedVersionIndex} intervalObject={interval} modelJson={modelJson} />
                </div>
            }
        </div>
    );
}

export default DashboardPage;
