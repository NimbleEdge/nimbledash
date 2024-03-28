import {
  ADMIN_PAGE_ROUTE,
  APPROVAL_PAGE_ROUTE,
  BILLING_PAGE_ROUTE,
  CONTACT_PAGE_ROUTE,
  DASHBOARD_PAGE_ROUTE,
  DEPLOYMENTS_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  RBAC_PAGE_ROUTE,
} from "presentation/routes/route-paths";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SideBar() {
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
    else if (window.location.href.includes(RBAC_PAGE_ROUTE)) {
      setCurrentTab(4);
    }
    else if (window.location.href.includes(BILLING_PAGE_ROUTE)) {
      setCurrentTab(5);
    }
    else if (window.location.href.includes(CONTACT_PAGE_ROUTE)) {
      setCurrentTab(6);
    } else {
      setCurrentTab(0);
    }
  });

  return (
    <div className="sidebar">
      <div className="sidebar-margin">
        <img className="sidebar-logo" src="/assets/logo.png"></img>
        <div
          className={
            (currentTab == 0 ? "sidebar-item-selected " : "") +
            "sidebar-item clickable"
          }
          onClick={() => {
            setCurrentTab(0);
            navigateTo(DASHBOARD_PAGE_ROUTE);
          }}
        >
          <img
            className="sidebar-icon"
            src={
              currentTab == 0
                ? "/assets/icons/dashboard_selected.svg"
                : "/assets/icons/dashboard.svg"
            }
          ></img>
          <p
            className={
              (currentTab == 0 ? "selected-desc " : "") + "sidebar-item-desc"
            }
          >
            Dashboard
          </p>
        </div>

        <div
          className={
            (currentTab == 1 ? "sidebar-item-selected " : "") +
            "sidebar-item clickable"
          }
          onClick={() => {
            setCurrentTab(1);
            navigateTo(ADMIN_PAGE_ROUTE);
          }}
        >
          <img
            className="sidebar-icon"
            src={
              currentTab == 1
                ? "/assets/icons/admin_selected.svg"
                : "/assets/icons/admin.svg"
            }
          ></img>
          <p
            className={
              (currentTab == 1 ? "selected-desc " : "") + "sidebar-item-desc"
            }
          >
            {'Model Management'}
          </p>
        </div>


        <div
          className={
            (currentTab == 2 ? "sidebar-item-selected " : "") +
            "sidebar-item clickable"
          }
          onClick={() => {
            setCurrentTab(2);
            navigateTo(DEPLOYMENTS_PAGE_ROUTE);
          }}
        >
          <img
            className="sidebar-icon"
            src={
              currentTab == 2
                ? "/assets/icons/deployments_selected.svg"
                : "/assets/icons/deployments.svg"
            }
          ></img>
          <p
            className={
              (currentTab == 2 ? "selected-desc " : "") + "sidebar-item-desc"
            }
          >
            {'Deployments'}
          </p>
        </div>



        <div
          className={
            (currentTab == 3 ? "sidebar-item-selected " : "") +
            "sidebar-item clickable"
          }
          onClick={() => {
            setCurrentTab(3);
            navigateTo(APPROVAL_PAGE_ROUTE);
          }}
        >
          <img
            className="sidebar-icon"
            src={
              currentTab == 3
                ? "/assets/icons/approval_selected.svg"
                : "/assets/icons/approval.svg"
            }
          ></img>
          <p
            className={
              (currentTab == 3 ? "selected-desc " : "") + "sidebar-item-desc"
            }
          >
            {'Approvals'}
          </p>
        </div>


        <div
          className={
            (currentTab == 4 ? "sidebar-item-selected " : "") +
            "sidebar-item clickable"
          }
          onClick={() => {
            setCurrentTab(4);
            navigateTo(RBAC_PAGE_ROUTE);
          }}
        >
          <img
            className="sidebar-icon"
            src={
              currentTab == 4
                ? "/assets/icons/rbac_selected.svg"
                : "/assets/icons/rbac.svg"
            }
          ></img>
          <p
            className={
              (currentTab == 4 ? "selected-desc " : "") + "sidebar-item-desc"
            }
          >
            Access control
          </p>
        </div>


        <div
          className={
            (currentTab == 5 ? "sidebar-item-selected " : "") +
            "sidebar-item clickable"
          }
          onClick={() => {
            setCurrentTab(5);
            navigateTo(BILLING_PAGE_ROUTE);
          }}
        >
          <img
            className="sidebar-icon"
            src={
              currentTab == 5
                ? "/assets/icons/billing_selected.svg"
                : "/assets/icons/billing.svg"
            }
          ></img>
          <p
            className={
              (currentTab == 5 ? "selected-desc " : "") + "sidebar-item-desc"
            }
          >
            {'Billing'}
          </p>
        </div>

        <div
          className={
            (currentTab == 6 ? "sidebar-item-selected " : "") +
            "sidebar-item clickable"
          }
          onClick={() => {
            setCurrentTab(6);
            navigateTo(CONTACT_PAGE_ROUTE);
          }}
        >
          <img
            className="sidebar-icon"
            src={
              currentTab == 6
                ? "/assets/icons/contact_us_selected.svg"
                : "/assets/icons/contact_us.svg"
            }
          ></img>
          <p
            className={
              (currentTab == 6 ? "selected-desc " : "") + "sidebar-item-desc"
            }
          >
            Contact Us
          </p>
        </div>

        <div
          className="sidebar-item"
          onClick={() => {
            localStorage.clear();
            navigateTo(LOGIN_PAGE_ROUTE);
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
