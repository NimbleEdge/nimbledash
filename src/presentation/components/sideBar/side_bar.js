import { loaderActions } from "presentation/redux/stores/store";
import {
  ADMIN_PAGE_ROUTE,
  APPROVAL_PAGE_ROUTE,
  BILLING_PAGE_ROUTE,
  CONTACT_PAGE_ROUTE,
  DASHBOARD_PAGE_ROUTE,
  DEPLOYMENTS_PAGE_ROUTE,
  EVENTS_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  RBAC_PAGE_ROUTE,
} from "presentation/routes/route-paths";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function SideBar(props) {
  const navigateTo = useNavigate();
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    if (window.location.href.includes(ADMIN_PAGE_ROUTE)) {
      setCurrentTab(1);
    }
    else if (window.location.href.includes(DEPLOYMENTS_PAGE_ROUTE)) {
      setCurrentTab(2);
    }
    else if (window.location.href.includes(APPROVAL_PAGE_ROUTE)) {
      setCurrentTab(3);
    }
    else if (window.location.href.includes(EVENTS_PAGE_ROUTE)) {
      setCurrentTab(4);
    }
    else if (window.location.href.includes(RBAC_PAGE_ROUTE)) {
      setCurrentTab(5);
    }
    else if (window.location.href.includes(BILLING_PAGE_ROUTE)) {
      setCurrentTab(6);
    }
    else if (window.location.href.includes(CONTACT_PAGE_ROUTE)) {
      setCurrentTab(7);
    } else {
      setCurrentTab(0);
    }
  });

  const dispatch = useDispatch();
  const tabData = [
    {
      title: "Dashboard",
      route: DASHBOARD_PAGE_ROUTE,
      iconName: "dashboard",
    },
    {
      title: "Admin",
      route: ADMIN_PAGE_ROUTE,
      iconName: "admin",
    },
    {
      title: "Deployments",
      route: DEPLOYMENTS_PAGE_ROUTE,
      iconName: "deployments",
    },
    {
      title: "Approvals",
      route: APPROVAL_PAGE_ROUTE,
      iconName: "approval",
    },
    {
      title: "Events Control",
      route: EVENTS_PAGE_ROUTE,
      iconName: "events",
    },
    {
      title: "Access Control",
      route: RBAC_PAGE_ROUTE,
      iconName: "rbac",
    },
    {
      title: "Billing",
      route: BILLING_PAGE_ROUTE,
      iconName: "billing",
    },
    {
      title: "Contact Us",
      route: CONTACT_PAGE_ROUTE,
      iconName: "contact_us",
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-margin">
        <img className="sidebar-logo" src="/assets/logo.png"></img>

        {
          tabData.map((tab, index) => (
            <div
              className={
                (currentTab == index ? "sidebar-item-selected " : "") +
                "sidebar-item clickable"
              }
              onClick={() => {
                setCurrentTab(index);
                navigateTo(tab.route);
              }}
            >
              <img
                className="sidebar-icon"
                src={
                  currentTab == index
                    ? `/assets/icons/${tab.iconName}_selected.svg`
                    : `/assets/icons/${tab.iconName}.svg`
                }
              ></img>
              <p
                className={
                  (currentTab == index ? "selected-desc " : "") + "sidebar-item-desc"
                }
              >
                {tab.title}
              </p>
            </div>
          ))
        }

        {/* LOGOUT BUTTON */}
        <div
          className="sidebar-item"
          onClick={() => {
            localStorage.clear();
            props.setIsAuthenticated(false);
            navigateTo(LOGIN_PAGE_ROUTE);
            dispatch(loaderActions.toggleLoader(false));
          }}
        >
          <img className="sidebar-icon" src="/assets/icons/logout.svg"></img>
          <p className="sidebar-item-desc">Logout</p>
        </div>
      </div>
      <div className="divider"></div>
    </div>
  );
}

export default SideBar;
