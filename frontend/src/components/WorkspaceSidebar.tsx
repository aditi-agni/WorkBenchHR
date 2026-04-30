import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import robotIconUrl from "../../Designs/robot.png";
import { BrandMark } from "./BrandMark";
import { DnaSyncSidebarWidget } from "./DnaSyncSidebarWidget";
import { TrainingDoneModal } from "./TrainingDoneModal";
import { getUploadedDocuments } from "../lib/documentLibrary";
import { isDnaSyncWidgetPending } from "../lib/dnaSyncWidget";

function IconDashboard() {
  return (
    <svg className="wb-dash__nav-svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"
        opacity="0.92"
      />
    </svg>
  );
}

function IconEmployees() {
  return (
    <svg className="wb-dash__nav-svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <circle cx="12" cy="8" r="3.2" fill="currentColor" opacity="0.92" />
      <path fill="currentColor" d="M5 20v-1c0-2.2 3.1-4 7-4s7 1.8 7 4v1" opacity="0.92" />
    </svg>
  );
}

function IconDocuments() {
  return (
    <svg className="wb-dash__nav-svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 1.5L18.5 8H14V3.5zM6 20V4h7v5h5v11H6z"
        opacity="0.92"
      />
    </svg>
  );
}

function IconHiring() {
  return (
    <svg className="wb-dash__nav-svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden>
      <path
        fill="currentColor"
        d="M12 2l2.4 7.4h7.8l-6.3 4.6 2.4 7.4L12 16.8 5.7 21.4 8.1 14 1.8 9.4h7.8L12 2z"
        opacity="0.92"
      />
    </svg>
  );
}

export function WorkspaceSidebar() {
  const location = useLocation();
  const [showDnaWidget, setShowDnaWidget] = useState(false);
  const [trainingDoneModalOpen, setTrainingDoneModalOpen] = useState(false);
  const [docCount, setDocCount] = useState(0);

  useEffect(() => {
    const onPath = location.pathname === "/dashboard";
    setShowDnaWidget(onPath && isDnaSyncWidgetPending());
  }, [location.pathname]);

  useEffect(() => {
    setDocCount(getUploadedDocuments().length);
  }, [location.pathname]);

  const hideDnaWidget = useCallback(() => setShowDnaWidget(false), []);

  return (
    <aside className="wb-dash__sidebar" aria-label="Workspace navigation">
      <div className="wb-dash__brand">
        <BrandMark to="/dashboard" size={34} wordmarkClassName="wb-dash__brand-text" />
      </div>

      <div className="wb-dash__cta-row">
        <Link to="/create-document/template" className="wb-dash__btn wb-dash__btn--primary">
          + Create Document
        </Link>
        <button type="button" className="wb-dash__btn wb-dash__btn--outline">
          + Add Employee
        </button>
      </div>

      <div className="wb-dash__nav-section">
        <p className="wb-dash__nav-label">Workspace</p>
        <nav className="wb-dash__nav" aria-label="Workspace">
          <NavLink
            to="/dashboard"
            end
            className={({ isActive }) =>
              `wb-dash__nav-link${isActive ? " wb-dash__nav-link--active" : ""}`
            }
          >
            <IconDashboard />
            <span className="wb-dash__nav-text">Dashboard</span>
          </NavLink>
          <NavLink
            to="/dashboard/employees"
            className={({ isActive }) =>
              `wb-dash__nav-link${isActive ? " wb-dash__nav-link--active" : ""}`
            }
          >
            <IconEmployees />
            <span className="wb-dash__nav-text">Employees</span>
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `wb-dash__nav-link${isActive ? " wb-dash__nav-link--active" : ""}`
            }
          >
            <IconDocuments />
            <span className="wb-dash__nav-text">Documents</span>
            {docCount > 0 ? <span className="wb-dash__nav-badge">{docCount}</span> : null}
          </NavLink>
        </nav>
      </div>

      <div className="wb-dash__nav-section wb-dash__nav-section--recruiting">
        <p className="wb-dash__nav-label">Recruiting</p>
        <nav className="wb-dash__nav" aria-label="Recruiting">
          <NavLink
            to="/hiring"
            className={({ isActive }) =>
              `wb-dash__nav-link${isActive ? " wb-dash__nav-link--active" : ""}`
            }
          >
            <IconHiring />
            <span className="wb-dash__nav-text">Hiring</span>
          </NavLink>
        </nav>
      </div>

      <div className="wb-dash__sidebar-spacer" />

      <div className="wb-dash__sidebar-footer">
        {showDnaWidget ? (
          <DnaSyncSidebarWidget
            onDismissed={hideDnaWidget}
            onTrainingFinished={() => setTrainingDoneModalOpen(true)}
          />
        ) : null}
        <button type="button" className="wb-dash__btn wb-dash__btn--primary wb-dash__btn--assistant-bar">
          AI Assistant
          <span className="wb-dash__assistant-icon" aria-hidden>
            <img
              src={robotIconUrl}
              alt=""
              width={20}
              height={20}
              className="wb-dash__assistant-img"
              decoding="async"
            />
          </span>
        </button>
      </div>

      <TrainingDoneModal open={trainingDoneModalOpen} onClose={() => setTrainingDoneModalOpen(false)} />
    </aside>
  );
}
