import { Link } from "react-router-dom";

export function SettingsPlaceholderPage({
  title,
  showEyebrow = true,
}: {
  title: string;
  showEyebrow?: boolean;
}) {
  return (
    <div className="wb-profile wb-placeholder-settings">
      {showEyebrow ? <p className="wb-eyebrow">Coming soon</p> : null}
      <h1 className="wb-onboarding__title">{title}</h1>
      <p className="wb-placeholder-settings__text">
        This section is still in development. You&apos;ll be able to use it here once it
        ships—we appreciate your patience.
      </p>
      <Link to="/settings/profile" className="wb-link">
        Back to Profile
      </Link>
    </div>
  );
}
