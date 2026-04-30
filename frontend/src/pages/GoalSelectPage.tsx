import { useState } from "react";
import { useNavigate } from "react-router-dom";

const goals = [
  {
    id: "docs",
    title: "Generate documents",
    hint: "Policies, letters, and HR packs tailored to your workplace.",
  },
  {
    id: "dashboard",
    title: "Viewing my employee dashboard",
    hint: "See teams, roles, and people data in one calm workspace.",
  },
  {
    id: "notifications",
    title: "Set up trigger notifications",
    hint: "Decide when WorkBench nudges you about reviews and tasks.",
  },
] as const;

export function GoalSelectPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <div className="wb-page wb-onboarding wb-goals-page">
      <header className="wb-goals__header">
        <p className="wb-goals__eyebrow">Get started</p>
        <h1 className="wb-onboarding__title wb-goals__title">What&apos;s your goal today?</h1>
        <p className="wb-onboarding__sub wb-goals__sub">
          Pick one path to begin. You can finish the rest of onboarding anytime from Settings.
        </p>
      </header>

      <ul className="wb-goals__grid" role="list">
        {goals.map((g) => {
          const isSelected = selected === g.id;
          return (
            <li key={g.id} className="wb-goals__cell">
              <button
                type="button"
                className={`wb-goals-card${isSelected ? " wb-goals-card--selected" : ""}`}
                onClick={() => setSelected(g.id)}
                aria-pressed={isSelected}
              >
                <span className="wb-goals-card__row">
                  <span className="wb-goals-card__icon" aria-hidden>
                    {g.id === "docs" && <GoalIconDocs />}
                    {g.id === "dashboard" && <GoalIconDashboard />}
                    {g.id === "notifications" && <GoalIconBell />}
                  </span>
                </span>
                <span className="wb-goals-card__title">{g.title}</span>
                <span className="wb-goals-card__hint">{g.hint}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="wb-goals__actions">
        <button
          type="button"
          className="wb-btn wb-btn--primary wb-goals__next"
          disabled={!selected}
          onClick={() => {
            if (!selected) return;
            if (selected === "notifications") {
              navigate("/onboarding/notifications");
              return;
            }
            if (selected === "dashboard") {
              navigate("/dashboard");
              return;
            }
            navigate("/onboarding/privacy");
          }}
        >
          Continue <span aria-hidden>›</span>
        </button>
      </div>
    </div>
  );
}

function GoalIconDocs() {
  return (
    <svg viewBox="0 0 48 48" width="28" height="28" fill="none" aria-hidden>
      <rect x="10" y="6" width="28" height="36" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M16 18h16M16 24h12M16 30h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M31 32l2 2 4-5"
        stroke="var(--wb-green)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoalIconDashboard() {
  return (
    <svg viewBox="0 0 48 48" width="28" height="28" fill="none" aria-hidden>
      <rect x="8" y="10" width="32" height="22" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M14 28v-6h6v6M22 28V16h6v12M30 28v-4h6v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GoalIconBell() {
  return (
    <svg viewBox="0 0 48 48" width="28" height="28" fill="none" aria-hidden>
      <path
        d="M24 10c-5 0-8 4-8 9v6l-3 5h22l-3-5V19c0-5-3-9-8-9z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M20 38h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
