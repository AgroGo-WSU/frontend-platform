import { useEffect, useRef, useState } from "react";
import TopNav from "../TopNav"; 
import "../../stylesheets/ProfilePage.css";

type NotifPrefs = {
  warnings: boolean;
  general: boolean;
  success: boolean;
};

export default function ProfilePage() {
  // ---- demo state (swap with real user data later) ----
  const [name] = useState("Placeholder Name");
  const [createdAt] = useState("Placeholder Date");
  const [location, setLocation] = useState<string>(() => {
    return localStorage.getItem("agro.location") || "Detroit, MI";
  });

  // ---- avatar handling ----
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    return localStorage.getItem("agro.avatarUrl");
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ---- notification prefs (persist to localStorage) ----
  const [prefs, setPrefs] = useState<NotifPrefs>(() => {
    const raw = localStorage.getItem("agro.notifPrefs");
    return raw
      ? (JSON.parse(raw) as NotifPrefs)
      : { warnings: false, general: true, success: true };
  });

  useEffect(() => {
    localStorage.setItem("agro.location", location);
  }, [location]);

  useEffect(() => {
    localStorage.setItem("agro.notifPrefs", JSON.stringify(prefs));
  }, [prefs]);

  useEffect(() => {
    if (avatarUrl) localStorage.setItem("agro.avatarUrl", avatarUrl);
  }, [avatarUrl]);

  // ---- handlers ----
  const openFilePicker = () => fileInputRef.current?.click();

  const onAvatarSelected: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const editLocation = () => {
    const next = window.prompt("Enter your location:", location);
    if (next && next.trim()) setLocation(next.trim());
  };

  const togglePref = (key: keyof NotifPrefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <TopNav />

      <main className="profile-page">
        <div className="profile-grid">
          {/* LEFT COLUMN */}
          <div className="profile-left">
            <section className="profile-card">
              <h2>Profile</h2>
              <p><strong>{name}</strong></p>
              <p>Location: {location}</p>
              <p>Account Created: {createdAt}</p>
            </section>

            <section className="profile-card">
              <h2>Profile Edit</h2>

              <div className="action-list">
                {/* Edit profile picture */}
                <button
                  type="button"
                  className="agro-btn linky"
                  onClick={openFilePicker}
                  aria-label="Edit profile picture"
                >
                  Edit profile picture
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onAvatarSelected}
                  style={{ display: "none" }}
                />

                {/* Edit location */}
                <button
                  type="button"
                  className="agro-btn linky"
                  onClick={editLocation}
                  aria-label="Edit location"
                >
                  Edit location
                </button>

                {/* Edit notifications */}
                <div className="notif-section">
                  <div className="notif-title">Edit notifications:</div>

                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={prefs.warnings}
                      onChange={() => togglePref("warnings")}
                    />
                    <span>Warnings</span>
                  </label>

                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={prefs.general}
                      onChange={() => togglePref("general")}
                    />
                    <span>General Information</span>
                  </label>

                  <label className="check-row">
                    <input
                      type="checkbox"
                      checked={prefs.success}
                      onChange={() => togglePref("success")}
                    />
                    <span>Successful Operations</span>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: avatar (placeholder or image) */}
          <aside className="profile-avatar" aria-label="Profile picture area">
            <div
              className="avatar-circle"
              style={
                avatarUrl
                  ? { backgroundImage: `url(${avatarUrl})` }
                  : undefined
              }
              aria-label="Profile picture"
              role="img"
            />
          </aside>
        </div>
      </main>
    </>
  );
}
