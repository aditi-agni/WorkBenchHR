import { Link, useSearchParams } from "react-router-dom";
import { AuthHomeLink } from "../components/AuthHomeLink";
import { BrandMark } from "../components/BrandMark";

export function ConfirmEmailPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="wb-split">
      <AuthHomeLink />
      <div
        className="wb-split__visual"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=1600&fit=crop)",
        }}
        role="img"
        aria-label="Team collaborating in an office"
      />
      <div className="wb-split__panel">
        <div className="wb-split__inner wb-split__card">
          <BrandMark to={null} size={44} />
          <p className="wb-split__tagline">
            Check your inbox to confirm your account.
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--wb-forest-mid)", margin: 0 }}>
            We sent a confirmation link to{" "}
            <strong>{email ?? "your email address"}</strong>. Click the link in
            that email to activate your account, then come back here to sign in.
          </p>
          <Link to="/login" className="wb-btn wb-btn--dark wb-btn--block" style={{ marginTop: "1rem" }}>
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
