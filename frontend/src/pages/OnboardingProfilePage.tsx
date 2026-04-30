import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrandMark } from "../components/BrandMark";
import { supabase } from "../lib/supabase";
import { upsertProfile } from "../lib/profile";

export function OnboardingProfilePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { navigate("/login", { replace: true }); return; }
      setUserId(user.id);
      setEmail(user.email ?? "");
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement).value.trim();

    setLoading(true);

    await upsertProfile({
      id: userId,
      first_name: get("first_name"),
      last_name: get("last_name"),
      email,
      mobile_number: get("mobile_number"),
      employee_id: get("employee_id"),
      date_of_hire: get("date_of_hire") || null,
      company_name: get("company_name"),
      role_title: get("role_title"),
    });

    setLoading(false);
    navigate("/dashboard");
  }

  return (
    <div className="wb-split">
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
          <p className="wb-split__tagline">Set up your profile to get started.</p>

          <form className="wb-form" onSubmit={onSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <label className="wb-field">
                <span className="wb-field__label">First Name</span>
                <input className="wb-input" name="first_name" required />
              </label>
              <label className="wb-field">
                <span className="wb-field__label">Last Name</span>
                <input className="wb-input" name="last_name" required />
              </label>
            </div>

            <label className="wb-field">
              <span className="wb-field__label">Email Address</span>
              <input
                className="wb-input"
                name="email"
                type="email"
                value={email}
                readOnly
                style={{ opacity: 0.6 }}
              />
            </label>

            <label className="wb-field">
              <span className="wb-field__label">Mobile Number</span>
              <input className="wb-input" name="mobile_number" type="tel" />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <label className="wb-field">
                <span className="wb-field__label">Employee ID</span>
                <input className="wb-input" name="employee_id" />
              </label>
              <label className="wb-field">
                <span className="wb-field__label">Date of Hire</span>
                <input className="wb-input" name="date_of_hire" type="date" />
              </label>
            </div>

            <label className="wb-field">
              <span className="wb-field__label">Company Name</span>
              <input className="wb-input" name="company_name" required />
            </label>

            <label className="wb-field">
              <span className="wb-field__label">Role / Title</span>
              <input className="wb-input" name="role_title" />
            </label>

            {error && <p className="wb-form__error">{error}</p>}

            <button
              type="submit"
              className="wb-btn wb-btn--dark wb-btn--block"
              disabled={loading}
            >
              {loading ? "Saving…" : "Continue to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
