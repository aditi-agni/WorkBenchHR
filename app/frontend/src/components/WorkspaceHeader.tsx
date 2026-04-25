import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { assetPath } from "../lib/assetPath";

type WorkspaceHeaderProps = {
  title?: string;
  /** When set, replaces the page H1 (e.g. breadcrumb row). */
  lead?: ReactNode;
};

export function WorkspaceHeader({ title, lead }: WorkspaceHeaderProps) {
  return (
    <header className="wb-dash__header">
      {lead ? <div className="wb-dash__header-lead">{lead}</div> : <h1 className="wb-dash__title">{title}</h1>}
      <div className="wb-dash__header-actions">
        <Link to="/settings/profile" className="wb-dash__icon-btn" aria-label="Settings">
          <img
            src={assetPath("/settings.png")}
            alt=""
            width={20}
            height={20}
            className="wb-dash__settings-icon"
            decoding="async"
          />
          <span className="wb-dash__icon-btn-label">Settings</span>
        </Link>
        <span className="wb-dash__avatar" aria-hidden>
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face"
            alt=""
            width={40}
            height={40}
          />
        </span>
      </div>
    </header>
  );
}
