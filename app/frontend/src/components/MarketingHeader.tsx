import { Link } from "react-router-dom";
import { assetPath } from "../lib/assetPath";

const TABS: { id: string; label: string; hash?: string }[] = [
  { id: "home", label: "Home", hash: "#home" },
  { id: "platform", label: "Platform", hash: "#platform" },
];

type Props = {
  activeSection: string;
  /** Updates active tab immediately on click (smooth scroll still uses href hash). */
  onSectionClick?: (sectionId: string) => void;
  /**
   * When set, the Platform tab uses this instead of the default # anchor jump
   * (e.g. to scroll the section to the vertical center of the viewport).
   */
  onPlatformSectionNavigate?: () => void;
};

export function MarketingHeader({
  activeSection,
  onSectionClick,
  onPlatformSectionNavigate,
}: Props) {
  return (
    <header className="wb-mkt-header">
      <div className="wb-mkt-header__inner">
        <Link to="/" className="wb-mkt-logo">
          <img src={assetPath("/branding/logo.png")} width={36} height={36} alt="" />
          <span className="wb-mkt-logo__text">Workbench HR</span>
        </Link>

        <nav className="wb-mkt-tabs" aria-label="Site sections">
          {TABS.map((tab) => {
            const isActive = activeSection === tab.id;
            const useCenteredPlatform = tab.id === "platform" && onPlatformSectionNavigate;
            return (
              <a
                key={tab.id}
                href={tab.hash}
                className={`wb-mkt-tab${isActive ? " wb-mkt-tab--active" : ""}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(e) => {
                  if (useCenteredPlatform) {
                    e.preventDefault();
                    onPlatformSectionNavigate();
                  }
                  onSectionClick?.(tab.id);
                }}
              >
                {tab.label}
              </a>
            );
          })}
          <a
            href="#request-demo"
            className={`wb-mkt-tab${activeSection === "request-demo" ? " wb-mkt-tab--active" : ""}`}
            aria-current={activeSection === "request-demo" ? "location" : undefined}
            onClick={() => onSectionClick?.("request-demo")}
          >
            Request a demo
          </a>
        </nav>

        <div className="wb-mkt-header__actions">
          <Link to="/login" className="wb-mkt-ghost">
            Sign in
          </Link>
          <Link to="/signup" className="wb-mkt-cta">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
