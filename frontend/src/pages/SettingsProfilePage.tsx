import { FormEvent, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { fetchProfile, upsertProfile, type Profile } from "../lib/profile";

const PHONE_COUNTRIES = [
  { id: "us", dial: "+1", flag: "🇺🇸", name: "United States" },
  { id: "ca", dial: "+1", flag: "🇨🇦", name: "Canada" },
  { id: "gb", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { id: "au", dial: "+61", flag: "🇦🇺", name: "Australia" },
  { id: "de", dial: "+49", flag: "🇩🇪", name: "Germany" },
  { id: "fr", dial: "+33", flag: "🇫🇷", name: "France" },
  { id: "in", dial: "+91", flag: "🇮🇳", name: "India" },
  { id: "jp", dial: "+81", flag: "🇯🇵", name: "Japan" },
  { id: "mx", dial: "+52", flag: "🇲🇽", name: "Mexico" },
  { id: "br", dial: "+55", flag: "🇧🇷", name: "Brazil" },
] as const;

function DeleteAccountConfirmModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const titleId = useId();
  const passwordId = useId();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPassword("");
    setError(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const p = password.trim();
    if (!p) {
      setError("Enter your password to confirm account deletion.");
      return;
    }
    setError(null);
    await supabase.auth.signOut();
    onClose();
    navigate("/login", { replace: true });
  };

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="wb-dash-reminder wb-profile-delete-modal" role="presentation">
      <button type="button" className="wb-dash-reminder__backdrop" onClick={onClose} aria-label="Close" />
      <div
        className="wb-dash-reminder__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={`${titleId}-desc`}
      >
        <div className="wb-dash-reminder__head">
          <h2 className="wb-dash-reminder__title" id={titleId}>
            Delete your account?
          </h2>
          <button type="button" className="wb-dash-reminder__close" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        <p className="wb-dash-reminder__lede" id={`${titleId}-desc`}>
          This action is permanent. Please read the following before you continue.
        </p>
        <div className="wb-profile-delete-warning" role="alert">
          <strong>Warning</strong>
          <ul>
            <li>Your Workbench HR access for this organization will end immediately.</li>
            <li>Personal settings, notifications, and activity tied to this login may be removed.</li>
            <li>This cannot be undone from your side once the account is deleted.</li>
          </ul>
        </div>
        <p className="wb-dash-reminder__lede wb-profile-delete-modal__hint">
          If you still want to delete your account, type your <strong>password</strong> below to confirm it is really you.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="wb-profile-delete-modal__field">
            <label className="wb-profile-delete-modal__label" htmlFor={passwordId}>
              Password
            </label>
            <input
              id={passwordId}
              type="password"
              className="wb-input"
              autoComplete="current-password"
              value={password}
              onChange={(ev) => {
                setPassword(ev.target.value);
                if (error) setError(null);
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${passwordId}-err` : undefined}
            />
            {error ? (
              <p className="wb-profile-delete-modal__error" id={`${passwordId}-err`} role="alert">
                {error}
              </p>
            ) : null}
          </div>
          <div className="wb-profile-delete-modal__actions">
            <button type="button" className="wb-btn wb-btn--muted" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="wb-btn wb-btn--danger-outline">
              Delete my account
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export function SettingsProfilePage() {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { navigate("/login", { replace: true }); return; }
      setUserId(user.id);
      const p = await fetchProfile(user.id);
      setProfile(p);
      setLoading(false);
    });
  }, [navigate]);

  async function handleSaveField(field: keyof Profile, value: string) {
    if (!userId) return;
    const updated = { ...profile, id: userId, [field]: value } as Profile;
    setProfile(updated);
    await upsertProfile({ id: userId, [field]: value });
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    setUploading(true);
    setAvatarError(null);
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Upload session:", session);
    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("Avatars")
      .upload(path, file, { upsert: true });
    if (uploadError) {
      console.error("Avatar upload error:", uploadError);
      setAvatarError(uploadError.message);
    } else {
      const { data } = supabase.storage.from("Avatars").getPublicUrl(path);
      const url = `${data.publicUrl}?t=${Date.now()}`;
      await upsertProfile({ id: userId, avatar_url: url });
      setProfile((prev) => prev ? { ...prev, avatar_url: url } : prev);
    }
    setUploading(false);
    e.target.value = "";
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || "Your Name";
  const roleDisplay = [profile?.company_name, profile?.role_title].filter(Boolean).join(" | ") || "";

  if (loading) {
    return <div className="wb-profile" style={{ padding: "2rem" }}>Loading…</div>;
  }

  return (
    <div className="wb-profile">
      <div className="wb-profile__banner">
        <div
          className="wb-profile__banner-bg"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1400&h=220&fit=crop)",
          }}
        />
      </div>

      <div className="wb-profile__identity">
        <div className="wb-profile__avatar-wrap">
          <img
            src={profile?.avatar_url ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=200&background=2d6a4f&color=fff`}
            width={120}
            height={120}
            alt=""
            className="wb-profile__avatar"
          />
          <button
            type="button"
            className="wb-profile__avatar-edit"
            aria-label="Edit photo"
            disabled={uploading}
            onClick={() => avatarInputRef.current?.click()}
          >
            {uploading ? "…" : "✎"}
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>
        {avatarError && (
          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "0.5rem" }}>{avatarError}</p>
        )}
        <div className="wb-profile__name-block">
          <h1 className="wb-profile__name">{fullName}</h1>
          {roleDisplay ? <p className="wb-profile__role">{roleDisplay}</p> : null}
        </div>
      </div>

      <section className="wb-profile__section">
        <header className="wb-profile__section-head">
          <h2>Personal Information</h2>
          <p>Add your personal information</p>
        </header>
        <div className="wb-profile__grid">
          <ProfileField
            label="First Name"
            value={profile?.first_name ?? ""}
            onSave={(v) => handleSaveField("first_name", v)}
          />
          <ProfileField
            label="Last Name"
            value={profile?.last_name ?? ""}
            onSave={(v) => handleSaveField("last_name", v)}
          />
          <ProfileField
            label="Email Address"
            value={profile?.email ?? ""}
            onSave={(v) => handleSaveField("email", v)}
          />
          <ProfilePhoneField
            label="Mobile Number"
            value={profile?.mobile_number ?? ""}
            onSave={(v) => handleSaveField("mobile_number", v)}
          />
          <ProfileField
            label="Employee ID"
            value={profile?.employee_id ?? ""}
            locked
          />
          <ProfileField
            label="Date of Hire"
            value={profile?.date_of_hire ?? ""}
            locked
          />
        </div>
      </section>

      <footer className="wb-profile__footer">
        <div className="wb-profile__danger">
          <button
            type="button"
            className="wb-btn wb-btn--outline"
            onClick={handleSignOut}
          >
            Sign out
          </button>
          <button
            type="button"
            className="wb-btn wb-btn--danger-outline"
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Account
          </button>
        </div>
        <p className="wb-profile__last-login">Last Login: {new Date().toLocaleDateString()}</p>
      </footer>

      <DeleteAccountConfirmModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} />
    </div>
  );
}

function countryById(id: (typeof PHONE_COUNTRIES)[number]["id"]) {
  return PHONE_COUNTRIES.find((c) => c.id === id) ?? PHONE_COUNTRIES[0];
}

export function ProfilePhoneField({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string;
  onSave?: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [countryId, setCountryId] = useState<(typeof PHONE_COUNTRIES)[number]["id"]>("us");
  const [national, setNational] = useState(value);
  const countrySelectId = useId();
  const nationalInputId = useId();
  const legendId = `${nationalInputId}-legend`;
  const country = countryById(countryId);
  const displayValue = national ? `${country.flag} ${country.dial} ${national}` : "";

  useEffect(() => { setNational(value); }, [value]);

  function handleDone() {
    setIsEditing(false);
    onSave?.(`${country.dial} ${national}`);
  }

  return (
    <div className="wb-profile-field">
      <span className="wb-profile-field__label-row">
        <span id={legendId}>{label}</span>
        <button
          type="button"
          className="wb-profile-field__edit"
          aria-pressed={isEditing}
          aria-label={isEditing ? `Stop editing ${label}` : `Edit ${label}`}
          onClick={() => isEditing ? handleDone() : setIsEditing(true)}
        >
          {isEditing ? "Done" : "Edit"} ✎
        </button>
      </span>
      {isEditing ? (
        <div
          className="wb-profile-field__input-row wb-profile-field__input-row--phone wb-profile-field__input-row--editing"
          role="group"
          aria-labelledby={legendId}
        >
          <div className="wb-profile-phone">
            <label htmlFor={countrySelectId} className="visually-hidden">Country calling code</label>
            <select
              id={countrySelectId}
              className="wb-profile-phone__select"
              value={countryId}
              onChange={(e) => setCountryId(e.target.value as (typeof PHONE_COUNTRIES)[number]["id"])}
              aria-label="Country calling code"
            >
              {PHONE_COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>{c.flag} {c.dial}</option>
              ))}
            </select>
            <label htmlFor={nationalInputId} className="visually-hidden">Phone number without country code</label>
            <input
              id={nationalInputId}
              type="tel"
              className="wb-input wb-input--profile wb-profile-phone__national"
              value={national}
              onChange={(e) => setNational(e.target.value)}
              autoComplete="tel-national"
              aria-label="Phone number"
            />
          </div>
        </div>
      ) : (
        <div className="wb-profile-field__input-row" role="group" aria-labelledby={legendId}>
          <input
            type="text"
            className="wb-input wb-input--profile"
            readOnly
            value={displayValue}
            aria-label={`${label}, ${displayValue}`}
            aria-readonly
          />
        </div>
      )}
    </div>
  );
}

export function ProfileField({
  label,
  value,
  locked,
  onSave,
}: {
  label: string;
  value: string;
  locked?: boolean;
  onSave?: (value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => { setLocalValue(value); }, [value]);

  function handleDone() {
    setIsEditing(false);
    onSave?.(localValue);
  }

  const readOnly = Boolean(locked) || !isEditing;

  return (
    <label className="wb-profile-field">
      <span className="wb-profile-field__label-row">
        <span>{label}</span>
        {locked ? null : (
          <button
            type="button"
            className="wb-profile-field__edit"
            aria-pressed={isEditing}
            aria-label={isEditing ? `Stop editing ${label}` : `Edit ${label}`}
            onClick={() => isEditing ? handleDone() : setIsEditing(true)}
          >
            {isEditing ? "Done" : "Edit"} ✎
          </button>
        )}
      </span>
      <div
        className={
          "wb-profile-field__input-row" +
          (!locked && isEditing ? " wb-profile-field__input-row--editing" : "")
        }
      >
        <input
          className="wb-input wb-input--profile"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          readOnly={readOnly}
          aria-readonly={readOnly}
        />
        {locked ? <span className="wb-profile-field__lock" aria-hidden>🔒</span> : null}
      </div>
    </label>
  );
}
