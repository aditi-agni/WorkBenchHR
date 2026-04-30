import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthHomeLink } from "../components/AuthHomeLink";
import { BrandMark } from "../components/BrandMark";
import { supabase } from "../lib/supabase";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function SignUpPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [defaultEmail, setDefaultEmail] = useState("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setDefaultEmail(emailParam);
  }, [searchParams]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const company = (form.elements.namedItem("company") as HTMLInputElement).value.trim();

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, company_name: company },
      },
    });

    setLoading(false);

    if (authError) {
      if (authError.message.toLowerCase().includes("already registered")) {
        setError("An account with this email already exists. Please sign in instead.");
      } else {
        setError(authError.message);
      }
      return;
    }

    navigate(`/confirm-email?email=${encodeURIComponent(email)}`);
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
              <input className="wb-input" name="name" autoComplete="name" required />
            </label>
            <label className="wb-field">
              <span className="wb-field__label">Email</span>
              <input
                className="wb-input"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={defaultEmail}
                required
              />
            </label>
            <label className="wb-field">
              <span className="wb-field__label">Password</span>
              <input
                className="wb-input"
                name="password"
                type="password"
                autoComplete="new-password"
                required
              />
            </label>
            <label className="wb-field">
              <span className="wb-field__label">Company Name</span>
              <input className="wb-input" name="company" autoComplete="organization" />
            </label>
            {error && <p className="wb-form__error">{error}</p>}
            <button
              type="submit"
              className="wb-btn wb-btn--dark wb-btn--block"
              disabled={loading}
            >
              {loading ? "Creating account…" : "Create Account"}
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
