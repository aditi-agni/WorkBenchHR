import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { AuthHomeLink } from "../components/AuthHomeLink";
import { BrandMark } from "../components/BrandMark";

export function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="wb-split">
      <AuthHomeLink />
      <div
        className="wb-split__visual"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=1600&fit=crop)",
        }}
        role="img"
        aria-label="Bright modern office workspace"
      />
      <div className="wb-split__panel">
        <div className="wb-split__inner wb-split__card">
          <BrandMark to={null} size={44} />
          <p className="wb-split__tagline">
            {submitted
              ? "Check your inbox. We sent a link to reset your password if an account exists for that email."
              : "No worries, it happens. Enter your work email and we will send you a link to reset your password."}
          </p>
          {submitted ? (
            <div className="wb-forgot__actions">
              <Link to="/login" className="wb-btn wb-btn--dark wb-btn--block">
                Back to sign in
              </Link>
            </div>
          ) : (
            <form className="wb-form" onSubmit={onSubmit}>
              <label className="wb-field">
                <span className="wb-field__label">Work email</span>
                <input
                  className="wb-input"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </label>
              <button type="submit" className="wb-btn wb-btn--dark wb-btn--block">
                Send reset link
              </button>
            </form>
          )}
          <p className="wb-split__footer">
            Remember your password?{" "}
            <Link to="/login" className="wb-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
