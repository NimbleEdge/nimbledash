import { CLIENT_ID } from 'core/constants';
import '../../../common.css';
import './admin_page.css';
import React, { useEffect, useState } from "react";
import OldAdminPage from './old_admin_page';
import NewAdminPage from './new_admin_page';

export const DEFAULT_TASK_NAME = 'DEFAULT_SCRIPT';


export const View = {
    OLD: 0,
    NEW: 1
}

function isSubstring(str, substr) {
    return str.includes(substr);
}  

const clientsWithOldView = ['dream11', 'sostronk'];
const clientsWithNewView = ['testclient'];

export const showOldView1 = () => {
    const currentClientId = localStorage.getItem(CLIENT_ID);
    clientsWithOldView.forEach(clientId => {
        if(isSubstring(currentClientId, clientId)) return true;
    });
    return false;
}

export const showOldView2 = () => {
    const currentCientId = localStorage.getItem(CLIENT_ID);
    if(currentCientId == 'testclient') return false;
    return true;
}

const AdminPage = () => {
    const [currentView, setCurrentView] = useState(null);
    useEffect(() => {
        // if(showOldView()) setCurrentView(View.OLD)
        // else setCurrentView(View.NEW);
        if(showOldView2()) setCurrentView(View.OLD);
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