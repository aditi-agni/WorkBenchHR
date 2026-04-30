import { Link, useNavigate } from "react-router-dom";
import { SkipForNow } from "../components/SkipForNow";
import { assetPath } from "../lib/assetPath";

const items = [
  {
    title: "1. Core Service Functionality",
    body: "We use employee data, such as names, roles, and tax identifiers, to power essential HR features",
    image: assetPath("/dp1.png"),
  },
  {
    title: "2. Analytics & Performance Insights",
    body: "De-identified data helps generate WorkBench Insights, allowing you to track workforce growth",
    image: assetPath("/dp2.png"),
  },
  {
    title: "3. Security & Fraud Prevention",
    body: "Login activity and system logs help us detect unauthorized access and maintain security",
    image: assetPath("/dp3.png"),
  },
  {
    title: "4. Personalization & Platform Optimization",
    body: "We analyze how you use WorkBench to personalize your dashboard and streamline your workflow",
    image: assetPath("/dp4.png"),
  },
];

export function DataPrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="wb-page wb-onboarding wb-privacy">
      <div className="wb-privacy__top">
        <SkipForNow to="/settings/profile" />
      </div>
      <h1 className="wb-onboarding__title wb-privacy__title">
        Data &amp; Privacy Overview
      </h1>
      <p className="wb-privacy__lede">
        WorkBench HR uses intelligent software to learn your company&apos;s
        specific needs and tone!
      </p>
      <h2 className="wb-privacy__section-title">
        Here&apos;s how your data works for you:
      </h2>

      <ul className="wb-privacy-grid">
        {items.map((item) => (
          <li key={item.title} className="wb-privacy-card">
            <div className="wb-privacy-card__icon" aria-hidden>
              <img src={item.image} alt="" width={40} height={40} decoding="async" />
            </div>
            <div>
              <h3 className="wb-privacy-card__title">{item.title}</h3>
              <p className="wb-privacy-card__body">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="wb-privacy__footer">
        <Link
          to="/terms"
          state={{
            backTo: "/onboarding/privacy",
            backLabel: "← Back to Data & Privacy",
          }}
          className="wb-link wb-link--underline"
        >
          View the full terms and conditions
        </Link>
        <div className="wb-privacy__buttons">
          <button
            type="button"
            className="wb-btn wb-btn--muted"
            onClick={() => navigate("/onboarding/opt-out-confirm")}
          >
            Opt Out
          </button>
          <button
            type="button"
            className="wb-btn wb-btn--primary"
            onClick={() => navigate("/onboarding/learning")}
          >
            Accept &amp; Continue <span aria-hidden>›</span>
          </button>
        </div>
      </div>
    </div>
  );
}
