import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHomeLink } from "../components/AuthHomeLink";
import { BrandMark } from "../components/BrandMark";

export function LoginPage() {
  const navigate = useNavigate();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate("/dashboard");
  }

  return (
    <div className="wb-split">
      <AuthHomeLink />
      <div
        className="wb-split__visual"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=1200&h=1600&fit=crop)",
        }}
        role="img"
        aria-label="Colleagues greeting each other in a bright workspace"
      />
      <div className="wb-split__panel">
        <div className="wb-split__inner wb-split__card">
          <BrandMark to={null} size={44} />
          <p className="wb-split__tagline">
            Welcome back! Sign in to pick up where you left off. Your team, tasks, and HR
            tools are right here when you need them.
          </p>
          <form className="wb-form" onSubmit={onSubmit}>
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
                autoComplete="current-password"
              />
            </label>
            <div className="wb-split__form-row">
              <label className="wb-split__remember">
                <input type="checkbox" name="remember" defaultChecked />
                <span>Keep me signed in</span>
              </label>
              <Link to="/forgot-password" className="wb-split__forgot">
                Forgot password?
              </Link>
            </div>
            <button type="submit" className="wb-btn wb-btn--dark wb-btn--block">
              Sign in
            </button>
          </form>
          <p className="wb-split__footer">
            New to Workbench HR?{" "}
            <Link to="/signup" className="wb-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
