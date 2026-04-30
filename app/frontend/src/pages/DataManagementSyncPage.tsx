import { useCallback, useId, useRef, useState, type ReactNode } from "react";
import { assetPath } from "../lib/assetPath";

export function DataManagementSyncPage() {
  const [slackOn, setSlackOn] = useState(true);
  const [googleOn, setGoogleOn] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>("Updated_Mission.pdf");
  const fileInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.name) setUploadedName(f.name);
  }, []);

  return (
    <div className="wb-data-page">
      <div className="wb-data-page__intro">
        <h1 className="wb-data-page__title">Data Management &amp; Sync</h1>
        <p className="wb-data-page__sub">
          Manage manual imports, exports, and system synchronization settings
        </p>
      </div>

      <section className="wb-data-health" aria-label="System health">
        <div className="wb-data-health__left">
          <span className="wb-data-health__badge">
            <span className="wb-data-health__badge-icon" aria-hidden>
              ✓
            </span>
            All Systems Operational
          </span>
          <p className="wb-data-health__meta">Last synced 12 minutes ago.</p>
        </div>
        <button type="button" className="wb-btn wb-data-sync-now">
          Sync Now
        </button>
      </section>

      <section className="wb-data-integrations" aria-label="Integrations">
        <IntegrationCard
          title="Slack"
          status="Syncing in real-time"
          icon={<IntegrationLogo src={assetPath("/integrations/slack.png")} />}
          on={slackOn}
          onToggle={() => setSlackOn((v) => !v)}
        />
        <IntegrationCard
          title="Google Calendar"
          status="Syncing in hourly"
          icon={<IntegrationLogo src={assetPath("/integrations/google-calendar.png")} />}
          on={googleOn}
          onToggle={() => setGoogleOn((v) => !v)}
        />
      </section>

      <div className="wb-data-split">
        <section className="wb-data-panel wb-data-panel--upload" aria-label="Data export and import">
          <h2 className="wb-data-panel__heading">Data export &amp; import</h2>
          <div
            className={`wb-data-drop${dragOver ? " wb-data-drop--active" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            role="presentation"
          >
            <label htmlFor={fileInputId} className="visually-hidden">
              Upload data file
            </label>
            <input
              ref={fileRef}
              id={fileInputId}
              type="file"
              className="wb-data-drop__input"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setUploadedName(f.name);
                e.target.value = "";
              }}
            />
            <div className="wb-data-drop__icon" aria-hidden>
              <svg viewBox="0 0 48 48" width="44" height="44" fill="none">
                <rect
                  x="10"
                  y="6"
                  width="28"
                  height="36"
                  rx="4"
                  stroke="var(--wb-green)"
                  strokeWidth="2.2"
                />
                <path
                  d="M24 30V14M16 22l8-8 8 8"
                  stroke="var(--wb-green)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="wb-data-drop__title">Drag and Drop your Files or Click to Upload!</p>
            <button type="button" className="wb-link wb-data-drop__browse" onClick={() => fileRef.current?.click()}>
              Choose file
            </button>
          </div>
          {uploadedName ? (
            <p className="wb-data-file-status">
              <span className="wb-data-file-status__icon" aria-hidden>
                ✓
              </span>
              {uploadedName}
            </p>
          ) : null}
          <button type="button" className="wb-btn wb-btn--primary wb-data-train">
            Train my Workbench <span aria-hidden>›</span>
          </button>
        </section>

        <aside className="wb-data-ai" aria-label="AI overview">
          <div className="wb-data-ai__head">
            <span className="wb-data-ai__sparkle" aria-hidden>
              ✦
            </span>
            <h2 className="wb-data-ai__title">AI Overview</h2>
          </div>
          <div className="wb-data-ai__card">
            <div className="wb-data-ai__card-top">
              <h3 className="wb-data-ai__card-title">Anomaly Detection Alert</h3>
              <span className="wb-data-ai__pill">Optimization Opportunity</span>
            </div>
            <p className="wb-data-ai__desc">
              Suggested Action: Generate a Mapping Reconciliation Report to align &apos;People Ops&apos;
              with &apos;Human Resources&apos; across all integrated platforms.
            </p>
            <button type="button" className="wb-btn wb-btn--primary wb-data-ai__cta">
              View suggestions <span aria-hidden>›</span>
            </button>
            <p className="wb-data-ai__foot">Flagged 12 Discrepancies</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function IntegrationLogo({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      width={40}
      height={40}
      className="wb-data-int-card__img"
      loading="lazy"
      decoding="async"
    />
  );
}

function IntegrationCard({
  title,
  status,
  icon,
  on,
  onToggle,
}: {
  title: string;
  status: string;
  icon: ReactNode;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="wb-data-int-card">
      <div className="wb-data-int-card__brand">{icon}</div>
      <div className="wb-data-int-card__body">
        <h3 className="wb-data-int-card__title">{title}</h3>
        <p className="wb-data-int-card__status">{status}</p>
        <button type="button" className="wb-data-int-card__configure">
          Configure <span aria-hidden>›</span>
        </button>
      </div>
      <button
        type="button"
        className={`wb-toggle${on ? " wb-toggle--on" : ""}`}
        onClick={onToggle}
        aria-pressed={on}
        aria-label={`${title} sync ${on ? "on" : "off"}`}
      >
        <span className="wb-toggle__knob" />
      </button>
    </article>
  );
}
