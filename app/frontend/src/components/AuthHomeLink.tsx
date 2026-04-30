import { Link } from "react-router-dom";

export function AuthHomeLink() {
  return (
    <Link to="/" className="wb-split__home" aria-label="Back to homepage">
      <span className="wb-split__home-arrow" aria-hidden>
        ←
      </span>
      Home
    </Link>
  );
}
