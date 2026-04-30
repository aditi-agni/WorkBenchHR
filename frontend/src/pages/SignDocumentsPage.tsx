import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { WorkspaceHeader } from "../components/WorkspaceHeader";

type FieldKey =
  | "offerSigner"
  | "offerTitle"
  | "offerDate"
  | "ndaSigner"
  | "ndaEntity"
  | "ndaDate";

const EMPTY: Record<FieldKey, string> = {
  offerSigner: "",
  offerTitle: "",
  offerDate: "",
  ndaSigner: "",
  ndaEntity: "",
  ndaDate: "",
};

export function SignDocumentsPage() {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const crumbs = useMemo(
    () => (
      <nav className="wb-create-doc__crumbs" aria-label="Breadcrumb">
        <Link to="/dashboard" className="wb-create-doc__crumb-link">
          Dashboard
        </Link>
        <span className="wb-create-doc__crumb-sep" aria-hidden>
          {" "}
          &gt;{" "}
        </span>
        <span className="wb-create-doc__crumb-current">Sign documents</span>
      </nav>
    ),
    [],
  );

  const setField = useCallback((key: FieldKey, v: string) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    setError(null);
  }, []);

  const handleComplete = useCallback(() => {
    const missing: string[] = [];
    if (!values.offerSigner.trim()) missing.push("Offer letter — signer name");
    if (!values.offerTitle.trim()) missing.push("Offer letter — your title");
    if (!values.offerDate.trim()) missing.push("Offer letter — date");
    if (!values.ndaSigner.trim()) missing.push("NDA — signer name");
    if (!values.ndaEntity.trim()) missing.push("NDA — company legal name");
    if (!values.ndaDate.trim()) missing.push("NDA — date");
    if (missing.length > 0) {
      setError(`Please fill in: ${missing.join("; ")}.`);
      return;
    }
    setCompleted(true);
    setError(null);
  }, [values]);

  return (
    <>
      <WorkspaceHeader lead={crumbs} />

      <div className="wb-sign-doc-page">
        <div className="wb-sign-doc">
          {completed ? (
            <div className="wb-sign-doc__done">
              <span className="wb-sign-doc__done-icon" aria-hidden>
                <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
                  <circle cx="16" cy="16" r="14" fill="rgba(0, 200, 117, 0.18)" stroke="var(--wb-green)" strokeWidth="1.5" />
                  <path
                    d="M9 16.5l4.5 4.5L23 11.5"
                    stroke="var(--wb-forest)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="wb-sign-doc__eyebrow">All set</p>
              <h1 className="wb-sign-doc__title">Signing complete</h1>
              <p className="wb-sign-doc__lede">
                Your entries for Marcus Lee&apos;s offer letter and Priya Patel&apos;s NDA are saved in this
                preview. In a full build, these would sync to your document provider.
              </p>
              <Link to="/dashboard" className="wb-btn wb-btn--primary wb-sign-doc__back-link">
                Back to dashboard
              </Link>
            </div>
          ) : (
            <>
              <header className="wb-sign-doc__intro">
                <span className="wb-sign-doc__intro-accent" aria-hidden />
                <div className="wb-sign-doc__intro-body">
                  <p className="wb-sign-doc__eyebrow">Needs attention</p>
                  <h1 className="wb-sign-doc__title">Sign pending documents</h1>
                  <p className="wb-sign-doc__lede">
                    Complete the fields for each document below. Use Tab to move between fields. When
                    everything looks right, confirm to finish.
                  </p>
                </div>
              </header>

            {error ? (
              <p className="wb-sign-doc__error" role="alert">
                {error}
              </p>
            ) : null}

            <section className="wb-sign-doc__sheet" aria-labelledby="sign-offer-heading">
              <h2 className="wb-sign-doc__sheet-title" id="sign-offer-heading">
                Offer letter — Marcus Lee
              </h2>
              <p className="wb-sign-doc__sheet-meta">Preview · fields are editable</p>
              <div className="wb-sign-doc__fields">
                <label className="wb-sign-doc__label" htmlFor="sign-offer-signer">
                  Full name (typed signature)
                </label>
                <input
                  id="sign-offer-signer"
                  className="wb-sign-doc__input"
                  autoComplete="name"
                  value={values.offerSigner}
                  onChange={(e) => setField("offerSigner", e.target.value)}
                  placeholder="Type your full legal name"
                />
                <label className="wb-sign-doc__label" htmlFor="sign-offer-title">
                  Your title
                </label>
                <input
                  id="sign-offer-title"
                  className="wb-sign-doc__input"
                  value={values.offerTitle}
                  onChange={(e) => setField("offerTitle", e.target.value)}
                  placeholder="e.g. Director of Operations"
                />
                <label className="wb-sign-doc__label" htmlFor="sign-offer-date">
                  Date signed
                </label>
                <input
                  id="sign-offer-date"
                  className="wb-sign-doc__input"
                  type="date"
                  value={values.offerDate}
                  onChange={(e) => setField("offerDate", e.target.value)}
                />
              </div>
            </section>

            <section className="wb-sign-doc__sheet" aria-labelledby="sign-nda-heading">
              <h2 className="wb-sign-doc__sheet-title" id="sign-nda-heading">
                Mutual NDA — Priya Patel
              </h2>
              <p className="wb-sign-doc__sheet-meta">Preview · fields are editable</p>
              <div className="wb-sign-doc__fields">
                <label className="wb-sign-doc__label" htmlFor="sign-nda-signer">
                  Full name (typed signature)
                </label>
                <input
                  id="sign-nda-signer"
                  className="wb-sign-doc__input"
                  autoComplete="name"
                  value={values.ndaSigner}
                  onChange={(e) => setField("ndaSigner", e.target.value)}
                  placeholder="Type your full legal name"
                />
                <label className="wb-sign-doc__label" htmlFor="sign-nda-entity">
                  Company legal name
                </label>
                <input
                  id="sign-nda-entity"
                  className="wb-sign-doc__input"
                  value={values.ndaEntity}
                  onChange={(e) => setField("ndaEntity", e.target.value)}
                  placeholder="e.g. eatunique LLC"
                />
                <label className="wb-sign-doc__label" htmlFor="sign-nda-date">
                  Effective date
                </label>
                <input
                  id="sign-nda-date"
                  className="wb-sign-doc__input"
                  type="date"
                  value={values.ndaDate}
                  onChange={(e) => setField("ndaDate", e.target.value)}
                />
              </div>
            </section>

            <div className="wb-sign-doc__footer">
              <button type="button" className="wb-btn wb-btn--primary wb-sign-doc__submit" onClick={handleComplete}>
                Confirm and complete signing
              </button>
              <Link to="/dashboard" className="wb-btn wb-btn--muted wb-sign-doc__cancel">
                Cancel
              </Link>
            </div>
          </>
          )}
        </div>
      </div>
    </>
  );
}
