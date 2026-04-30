import { useNavigate } from "react-router-dom";
import { SkipForNow } from "../components/SkipForNow";
import { setDnaSyncWidgetPending } from "../lib/dnaSyncWidget";

const SYNCED = 5;
const TOTAL = 13;
const PCT = 30;
const RING_R = 52;
const RING_LEN = 2 * Math.PI * RING_R;

export function OnboardingTrainingPage() {
  const navigate = useNavigate();

  return (
    <div className="wb-page wb-onboarding wb-training">
      <div className="wb-privacy__top">
        <SkipForNow to="/dashboard" />
      </div>

      <h1 className="wb-onboarding__title wb-training__title">
        Got it! Your training is in progress!
      </h1>
      <p className="wb-onboarding__sub wb-training__sub">
        While we finish your setup, follow your progress using the WorkBenchHR training widget in the
        bottom right corner.
      </p>

      <div className="wb-training__layout">
        <div className="wb-training__card">
          <div className="wb-training__ring-wrap" aria-label={`${PCT} percent complete`}>
            <svg className="wb-training__ring" viewBox="0 0 120 120" aria-hidden>
              <circle
                className="wb-training__ring-bg"
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="10"
              />
              <circle
                className="wb-training__ring-fill"
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={RING_LEN}
                strokeDashoffset={RING_LEN * (1 - PCT / 100)}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <span className="wb-training__ring-label">{PCT}%</span>
          </div>
          <h2 className="wb-training__card-title">HR DNA Syncing...</h2>
          <p className="wb-training__card-desc">
            Analyzing {TOTAL - SYNCED} more documents to learn your company voice.
          </p>
          <p className="wb-training__card-foot">
            {SYNCED}/{TOTAL} Documents Synced
          </p>
        </div>

        <div className="wb-training__preview" aria-hidden>
          <div className="wb-training__preview-sidebar">
            <span className="wb-training__preview-logo" />
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`wb-training__preview-nav${i === 1 ? " wb-training__preview-nav--active" : ""}`}
              />
            ))}
          </div>
          <div className="wb-training__preview-main">
            <span className="wb-training__preview-bar" />
            <div className="wb-training__preview-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="wb-training__preview-tile" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="wb-onboarding__actions wb-training__actions">
        <button
          type="button"
          className="wb-btn wb-btn--primary"
          onClick={() => {
            setDnaSyncWidgetPending();
            navigate("/dashboard");
          }}
        >
          Let&apos;s Get Started! <span aria-hidden>›</span>
        </button>
      </div>
    </div>
  );
}
