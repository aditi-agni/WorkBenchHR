import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthHomeLink } from "../components/AuthHomeLink";
import { BrandMark } from "../components/BrandMark";
import { supabase } from "../lib/supabase";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (!authError) {
      navigate("/dashboard");
      return;
    }

    // Supabase returns "Invalid login credentials" for both wrong password
    // and non-existent email. Redirect to sign-up so the user can create an account.
    if (
      authError.message.toLowerCase().includes("invalid login credentials") ||
      authError.message.toLowerCase().includes("user not found")
    ) {
      navigate(`/signup?email=${encodeURIComponent(email)}`);
      return;
    }

    setError(authError.message);
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
                required
              />
            </label>
            <label className="wb-field">
              <span className="wb-field__label">Password</span>
              <input
                className="wb-input"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>
            {error && <p className="wb-form__error">{error}</p>}
            <div className="wb-split__form-row">
              <label className="wb-split__remember">
                <input type="checkbox" name="remember" defaultChecked />
                <span>Keep me signed in</span>
              </label>
              <Link to="/forgot-password" className="wb-split__forgot">
                Forgot password?
              </Link>
            </div>
            <button
              type="submit"
              className="wb-btn wb-btn--dark wb-btn--block"
              disabled={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
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
