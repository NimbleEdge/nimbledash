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
const clientsWithNewView = ['testclient', 'siddharth-test', 'yash-test', 'saket-test', 'palash-test', 'kushal-test', 'naman-test','nimon-rulezzz','mobile-test-client'];

export const showOldView = () => {
    const currentClientId = localStorage.getItem(CLIENT_ID);
    clientsWithOldView.forEach(clientId => {
        if(isSubstring(currentClientId, clientId)) return true;
    });
    return false;
}

export const showNewView = () => {
    const currentCientId = localStorage.getItem(CLIENT_ID);
    let ans = false;
    clientsWithNewView.forEach(client => {
        if(currentCientId == client) ans = true;
    })
    return ans;
}

const AdminPage = () => {
    const [currentView, setCurrentView] = useState(null);
    useEffect(() => {
        if(localStorage.getItem("HACK") == "007") setCurrentView(View.OLD);
        else if(showNewView()) setCurrentView(View.NEW);
        else setCurrentView(View.OLD);
    }, [])
    return (
        <>
            {currentView == View.OLD && <OldAdminPage />}
            {currentView == View.NEW && <NewAdminPage />}
        </>
    )
}

export default AdminPage;