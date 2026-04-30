import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BrandMark } from "./BrandMark";

type LegalDocLayoutProps = {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
  /** Where the header “back” link goes (default: home). */
  backTo?: string;
  backLabel?: string;
};

export function LegalDocLayout({
  title,
  lastUpdated = "April 12, 2026",
  children,
  backTo = "/",
  backLabel = "← Back to home",
}: LegalDocLayoutProps) {
  return (
    <div className="wb-legal">
      <header className="wb-legal__top">
        <div className="wb-legal__top-inner">
          <Link to={backTo} className="wb-legal__back">
            {backLabel}
          </Link>
          <BrandMark to="/" size={36} wordmarkClassName="wb-legal__brand-text" />
        </div>
      </header>

      <main className="wb-legal__main">
        <article className="wb-legal__article">
          <h1 className="wb-legal__title">{title}</h1>
          <p className="wb-legal__meta">Last updated: {lastUpdated}</p>
          <p className="wb-legal__notice">
            <strong>Note:</strong> This is sample placeholder content for development and layout only. It
            does not constitute legal advice and will be replaced with final policies before launch.
          </p>
          {children}
        </article>
      </main>
    </div>
  );
}
