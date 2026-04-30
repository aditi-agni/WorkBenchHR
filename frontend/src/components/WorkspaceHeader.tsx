import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { assetPath } from "../lib/assetPath";
import { supabase } from "../lib/supabase";
import { fetchProfile } from "../lib/profile";

type WorkspaceHeaderProps = {
  title?: string;
  lead?: ReactNode;
};

export function WorkspaceHeader({ title, lead }: WorkspaceHeaderProps) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initial, setInitial] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const profile = await fetchProfile(user.id);
      if (profile?.avatar_url) {
        setAvatarUrl(profile.avatar_url);
      } else {
        const name = profile?.first_name ?? user.email ?? "?";
        setInitial(name.charAt(0).toUpperCase());
      }
    });
  }, []);

  return (
    <header className="wb-dash__header">
      {lead ? <div className="wb-dash__header-lead">{lead}</div> : <h1 className="wb-dash__title">{title}</h1>}
      <div className="wb-dash__header-actions">
        <Link to="/settings/profile" className="wb-dash__icon-btn" aria-label="Settings">
          <img
            src={assetPath("/settings.png")}
            alt=""
            width={20}
            height={20}
            className="wb-dash__settings-icon"
            decoding="async"
          />
          <span className="wb-dash__icon-btn-label">Settings</span>
        </Link>
        <Link to="/settings/profile" className="wb-dash__avatar" aria-label="Your profile">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" width={40} height={40} />
          ) : (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "#2d6a4f",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
              }}
              aria-hidden
            >
              {initial}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
