import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const PROFILE_STORAGE_KEY = "traveloop_profile";
const DESTINATIONS_STORAGE_KEY = "traveloop_saved_destinations";

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Japanese",
];

const DEFAULT_DESTINATIONS = ["Lisbon", "Seoul", "Reykjavik"];

const getStoredValue = (key, fallback) => {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
};

const ProfilePage = () => {
  const auth = useAuth();
  const user = auth?.user || null;
  const logout = auth?.logout || null;

  const [profile, setProfile] = useState(() =>
    getStoredValue(PROFILE_STORAGE_KEY, {
      name: user?.username || "",
      email: user?.email || "",
      language: "English",
      photo: "",
      privacy: "private",
    }),
  );
  const [savedDestinations, setSavedDestinations] = useState(() =>
    getStoredValue(DESTINATIONS_STORAGE_KEY, DEFAULT_DESTINATIONS),
  );
  const [newDestination, setNewDestination] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    setProfile((prev) => ({
      ...prev,
      name: prev.name || user.username || "",
      email: prev.email || user.email || "",
    }));
  }, [user]);

  const packedProfile = useMemo(
    () => ({
      ...profile,
      name: profile.name.trim(),
      email: profile.email.trim(),
    }),
    [profile],
  );

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
    setStatusMessage("");
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      handleProfileChange("photo", String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!packedProfile.name || !packedProfile.email) {
      setStatusMessage("Name and email are required.");
      return;
    }
    setIsSaving(true);
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(packedProfile));
    localStorage.setItem(
      DESTINATIONS_STORAGE_KEY,
      JSON.stringify(savedDestinations),
    );
    setTimeout(() => {
      setIsSaving(false);
      setStatusMessage("Profile saved.");
    }, 400);
  };

  const handleAddDestination = (event) => {
    event.preventDefault();
    const trimmed = newDestination.trim();
    if (!trimmed) {
      return;
    }
    const exists = savedDestinations.some(
      (destination) => destination.toLowerCase() === trimmed.toLowerCase(),
    );
    if (exists) {
      setNewDestination("");
      return;
    }
    setSavedDestinations((prev) => [trimmed, ...prev]);
    setNewDestination("");
  };

  const handleRemoveDestination = (destination) => {
    setSavedDestinations((prev) =>
      prev.filter((item) => item !== destination),
    );
  };

  const handleDeleteAccount = () => {
    const shouldDelete = window.confirm(
      "Delete your account and saved data? This cannot be undone.",
    );
    if (!shouldDelete) {
      return;
    }
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(DESTINATIONS_STORAGE_KEY);
    if (logout) {
      logout();
    }
    setProfile({
      name: "",
      email: "",
      language: "English",
      photo: "",
      privacy: "private",
    });
    setSavedDestinations([]);
    setStatusMessage("Account data cleared locally.");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <form
        className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]"
        onSubmit={handleSave}
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
          User profile
        </p>
        <h2 className="mt-3 text-2xl">Profile settings</h2>
        <p className="mt-2 text-sm text-[var(--slate)]">
          Update your profile info and preferences.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-5">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-[var(--sand)]">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
                Photo
              </div>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Profile photo
            </label>
            <div className="flex flex-wrap gap-2">
              <label className="cursor-pointer rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--indigo)]">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
              <button
                type="button"
                className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--slate)]"
                onClick={() => handleProfileChange("photo", "")}
                disabled={!profile.photo}
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Full name
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
              value={profile.name}
              onChange={(event) =>
                handleProfileChange("name", event.target.value)
              }
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Email address
            </label>
            <input
              className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
              value={profile.email}
              onChange={(event) =>
                handleProfileChange("email", event.target.value)
              }
              placeholder="you@example.com"
              type="email"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Language preference
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
              value={profile.language}
              onChange={(event) =>
                handleProfileChange("language", event.target.value)
              }
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
              Privacy
            </label>
            <select
              className="mt-2 w-full rounded-xl border border-[var(--border)] px-4 py-2 text-sm"
              value={profile.privacy}
              onChange={(event) =>
                handleProfileChange("privacy", event.target.value)
              }
            >
              <option value="private">Private</option>
              <option value="friends">Friends only</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              isSaving
                ? "cursor-not-allowed bg-[var(--border)] text-[var(--slate)]"
                : "bg-[var(--indigo)] text-white"
            }`}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save changes"}
          </button>
          {statusMessage ? (
            <span className="text-xs text-[var(--slate)]">{statusMessage}</span>
          ) : null}
        </div>
      </form>

      <div className="space-y-6">
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--sand)]/60 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
                Saved destinations
              </p>
              <h3 className="mt-3 text-lg">Places you want to revisit</h3>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--slate)]">
              {savedDestinations.length} saved
            </span>
          </div>

          <form
            className="mt-4 flex flex-wrap gap-2"
            onSubmit={handleAddDestination}
          >
            <input
              className="flex-1 rounded-full border border-[var(--border)] px-4 py-2 text-sm"
              placeholder="Add destination"
              value={newDestination}
              onChange={(event) => setNewDestination(event.target.value)}
            />
            <button
              className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                newDestination.trim()
                  ? "bg-[var(--indigo)] text-white"
                  : "cursor-not-allowed bg-[var(--border)] text-[var(--slate)]"
              }`}
              type="submit"
              disabled={!newDestination.trim()}
            >
              Add
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {savedDestinations.length === 0 ? (
              <div className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--slate)]">
                No destinations saved yet.
              </div>
            ) : (
              savedDestinations.map((destination) => (
                <div
                  key={destination}
                  className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm"
                >
                  <span>{destination}</span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-[var(--slate)]"
                    onClick={() => handleRemoveDestination(destination)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--slate)]">
            Account actions
          </p>
          <p className="mt-3 text-sm text-[var(--slate)]">
            Manage your account and privacy controls.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-xs font-semibold text-[var(--slate)]"
              onClick={() => handleProfileChange("privacy", "private")}
            >
              Set private
            </button>
            <button
              type="button"
              className="rounded-full bg-[var(--indigo)] px-4 py-2 text-xs font-semibold text-white"
              onClick={handleDeleteAccount}
            >
              Delete account
            </button>
          </div>
          <p className="mt-3 text-xs text-[var(--slate)]">
            Deleting only clears local data in this demo.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
