import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHomeLink } from "../components/AuthHomeLink";
import { BrandMark } from "../components/BrandMark";

export function SignUpPage() {
  const navigate = useNavigate();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate("/onboarding/goal");
  }

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
            Finally, an HR tool that works as hard as you do!
          </p>
          <form className="wb-form" onSubmit={onSubmit}>
            <label className="wb-field">
              <span className="wb-field__label">Name</span>
              <input className="wb-input" name="name" autoComplete="name" />
            </label>
            <label className="wb-field">
              <span className="wb-field__label">Email</span>
              <input
                className="wb-input"
                name="email"
                type="email"
                autoComplete="email"
              />
            </label>
            <label className="wb-field">
              <span className="wb-field__label">Password</span>
              <input
                className="wb-input"
                name="password"
                type="password"
                autoComplete="new-password"
              />
            </label>
            <label className="wb-field">
              <span className="wb-field__label">Company Name</span>
              <input className="wb-input" name="company" autoComplete="organization" />
            </label>
            <button type="submit" className="wb-btn wb-btn--dark wb-btn--block">
              Create Account
            </button>
          </form>
          <p className="wb-split__footer">
            Already have an account?{" "}
            <Link to="/login" className="wb-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
