import { Link } from "react-router-dom";

type Props = {
  to: string;
};

export function SkipForNow({ to }: Props) {
  return (
    <Link to={to} className="skip-for-now">
      <span>Skip for now</span>
      <span className="skip-for-now__icon" aria-hidden>
        →
      </span>
    </Link>
  );
}
