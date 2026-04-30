import { useId, useRef } from "react";
import { ProfileField, ProfilePhoneField } from "./SettingsProfilePage";

const INDUSTRIES = [
  "Restaurant / Food Services",
  "Retail",
  "Technology",
  "Healthcare",
  "Professional Services",
  "Other",
] as const;

function EatuniqueMark({ className }: { className?: string }) {
  return (
    <div className={`wb-company-mark ${className ?? ""}`.trim()} aria-hidden>
      <span className="wb-company-mark__text">eatunique</span>
    </div>
  );
}

export function CompanyInformationPage() {
  const logoInputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="wb-company-page">
      <header className="wb-company-page__hero">
        <EatuniqueMark />
        <h1 className="wb-company-page__title">eatunique</h1>
      </header>

      <div className="wb-company-card">
        <header className="wb-company-card__head">
          <h2 className="wb-company-card__title">Company Information</h2>
          <p className="wb-company-card__sub">Add your company information</p>
        </header>

        <section className="wb-company-card__block">
          <h3 className="wb-company-card__section-label">General info</h3>
          <div className="wb-profile__grid">
            <ProfileField label="Legal Company Name" value="eatunique" locked />
            <div className="wb-profile-field">
              <span className="wb-profile-field__label-row">
                <span>Industry type</span>
              </span>
              <div className="wb-profile-field__input-row">
                <select
                  className="wb-company-industry"
                  defaultValue={INDUSTRIES[0]}
                  aria-label="Industry type"
                >
                  {INDUSTRIES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        <hr className="wb-company-card__rule" />

        <section className="wb-company-card__block">
          <h3 className="wb-company-card__section-label">Primary address &amp; contact</h3>
          <div className="wb-profile__grid">
            <ProfileField
              label="Headquarters Address"
              value="305 S Craig St, Pittsburgh, PA 15213"
            />
            <ProfilePhoneField
              label="Corporate Number"
              defaultCountryId="us"
              defaultNational="(412) 683-9993"
            />
          </div>
          <div className="wb-company-card__full-row">
            <ProfileField label="Primary Website" value="https://www.eatuniquecafe.com/" />
          </div>
        </section>

        <hr className="wb-company-card__rule" />

        <section className="wb-company-card__block wb-company-card__block--logo">
          <h3 className="wb-company-card__section-label">Company logo</h3>
          <div className="wb-company-logo-row">
            <EatuniqueMark className="wb-company-mark--preview" />
            <div className="wb-company-logo-actions">
              <label htmlFor={logoInputId} className="visually-hidden">
                Upload company logo
              </label>
              <input
                ref={fileRef}
                id={logoInputId}
                type="file"
                accept="image/*"
                className="wb-company-logo-file"
              />
              <button
                type="button"
                className="wb-btn wb-btn--outline wb-company-upload-btn"
                onClick={() => fileRef.current?.click()}
              >
                <span aria-hidden className="wb-company-upload-icon">
                  ⬆
                </span>
                Upload New Logo
              </button>
              <p className="wb-company-logo-meta">Last Updated: 01/01/2026</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
