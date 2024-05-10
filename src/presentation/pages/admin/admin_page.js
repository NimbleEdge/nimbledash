import { CLIENT_ID } from 'core/constants';
import '../../../common.css';
import './admin_page.css';
import React, { useEffect, useState } from "react";
import OldAdminPage from './old_admin_page';
import NewAdminPage from './new_admin_page';
import store from 'presentation/redux/stores/store';

export const View = {
    OLD: 0,
    NEW: 1
}

function isSubstring(str, substr) {
    return str.includes(substr);
}  

const clientsWithOldView = ['dream11', 'sostronk'];


export const showOldView = () => {
    const currentState = store.getState().userReducer;
    const currentClientId = currentState.clientId;
    clientsWithOldView.forEach(clientId => {
        if(isSubstring(currentClientId, clientId)) return true;
    });
    return false;
}

const AdminPage = () => {
    const [currentView, setCurrentView] = useState(null);
    useEffect(() => {
        if(localStorage.getItem("HACK") == "007") setCurrentView(View.OLD);
        else if(showOldView()) setCurrentView(View.NEW);
        else setCurrentView(View.NEW);
    }, [])
    return (
        <>
            {currentView == View.OLD && <OldAdminPage />}
            {currentView == View.NEW && <NewAdminPage />}
        </>
    )
}

export default AdminPage;
