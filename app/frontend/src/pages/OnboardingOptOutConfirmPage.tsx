import { useNavigate } from "react-router-dom";
import { assetPath } from "../lib/assetPath";

const optOutCards = [
  {
    image: assetPath("/oo1.png"),
    body: (
      <>
        <strong>Custom Tone Analysis:</strong> The AI will no longer mimic your company&apos;s
        specific brand voice or cultural nuances.
      </>
    ),
  },
  {
    image: assetPath("/oo2.png"),
    body: (
      <>
        <strong>Policy Auto-fill:</strong> Automated drafting of contracts and handbooks based on
        your internal rules will be disabled.
      </>
    ),
  },
  {
    image: assetPath("/oo3.png"),
    body: (
      <>
        <strong>Document Tailoring:</strong> You&apos;ll lose the ability to generate
        hyper-personalized offer letters and termination docs.
      </>
    ),
  },
];

export function OnboardingOptOutConfirmPage() {
  const navigate = useNavigate();

  return (
    <div className="wb-page wb-onboarding wb-optout">
      <h1 className="wb-onboarding__title wb-optout__title">Are you sure?</h1>
      <p className="wb-optout__lede">
        By opting out, WorkBench will no longer be able to draft documents using your company&apos;s
        specific tone, handbook, or culture. All uploaded training files will be removed from the AI
        model.
      </p>

      <ul className="wb-optout__cards">
        {optOutCards.map((card) => (
          <li key={card.image} className="wb-optout__card">
            <div className="wb-optout__card-icon" aria-hidden>
              <img src={card.image} alt="" width={28} height={28} decoding="async" />
            </div>
            <p className="wb-optout__card-text">{card.body}</p>
          </li>
        ))}
      </ul>

      <div className="wb-optout__footer">
        <button
          type="button"
          className="wb-btn wb-btn--muted wb-optout__btn-back"
          onClick={() => navigate("/dashboard")}
        >
          <span aria-hidden className="wb-optout__chev">
            ‹
          </span>{" "}
          Opt Out Anyway
        </button>
        <button
          type="button"
          className="wb-btn wb-btn--primary"
          onClick={() => navigate("/onboarding/learning")}
        >
          Stay Synced <span aria-hidden>›</span>
        </button>
      </div>
    </div>
  );
}
