import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthHomeLink } from "../components/AuthHomeLink";
import { BrandMark } from "../components/BrandMark";
import { supabase } from "../lib/supabase";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash and fires a PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirm") as HTMLInputElement).value;

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => navigate("/login"), 2500);
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

          {done ? (
            <p className="wb-split__tagline">
              Password updated! Redirecting you to sign in…
            </p>
          ) : !ready ? (
            <p className="wb-split__tagline">
              Verifying your reset link…
            </p>
          ) : (
            <>
              <p className="wb-split__tagline">
                Choose a new password for your account.
              </p>
              <form className="wb-form" onSubmit={onSubmit}>
                <label className="wb-field">
                  <span className="wb-field__label">New password</span>
                  <input
                    className="wb-input"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </label>
                <label className="wb-field">
                  <span className="wb-field__label">Confirm password</span>
                  <input
                    className="wb-input"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </label>
                {error && <p className="wb-form__error">{error}</p>}
                <button
                  type="submit"
                  className="wb-btn wb-btn--dark wb-btn--block"
                  disabled={loading}
                >
                  {loading ? "Updating…" : "Update password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
