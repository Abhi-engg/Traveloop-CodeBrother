import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import { useProfile } from "../hooks/useProfile";

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Japanese",
];

const DEFAULT_DESTINATIONS = ["Lisbon", "Seoul", "Reykjavik"];

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const auth = useAuth();
  const user = auth?.user || null;
  const logout = auth?.logout || null;
  const { data: profileData, isLoading: profileLoading } = useProfile();

  const [profile, setProfile] = useState({
    name: user?.username || "",
    email: user?.email || "",
    language: "English",
    photo_url: "",
    privacy: "private",
  });
  const [savedDestinations, setSavedDestinations] = useState(
    DEFAULT_DESTINATIONS,
  );
  const [newDestination, setNewDestination] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (hasLoaded || profileLoading) {
      return;
    }
    if (profileData) {
      setProfile({
        name: profileData.name || user?.username || "",
        email: profileData.email || user?.email || "",
        language: profileData.language || "English",
        photo_url: profileData.photo_url || "",
        privacy: profileData.privacy || "private",
      });
      setSavedDestinations(
        profileData.saved_destinations?.length
          ? profileData.saved_destinations
          : DEFAULT_DESTINATIONS,
      );
      setHasLoaded(true);
    }
  }, [profileData, profileLoading, hasLoaded, user]);

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
      handleProfileChange("photo_url", String(reader.result || ""));
    };
    reader.readAsDataURL(file);
  };

  const updateMutation = useMutation({
    mutationFn: (payload) => apiClient.put("/profile/", payload),
    onSuccess: (response) => {
      queryClient.setQueryData(["profile"], response.data);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete("/profile/"),
  });

  const handleSave = async (event) => {
    event.preventDefault();
    if (!packedProfile.name || !packedProfile.email) {
      setStatusMessage("Name and email are required.");
      return;
    }
    setIsSaving(true);
    updateMutation.mutate(
      {
        name: packedProfile.name,
        email: packedProfile.email,
        language: profile.language,
        photo_url: profile.photo_url,
        privacy: profile.privacy,
        saved_destinations: savedDestinations,
      },
      {
        onSuccess: () => {
          setStatusMessage("Profile saved.");
        },
        onError: () => {
          setStatusMessage("Unable to save profile.");
        },
        onSettled: () => setIsSaving(false),
      },
    );
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
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        if (logout) {
          logout();
        }
        setProfile({
          name: "",
          email: "",
          language: "English",
          photo_url: "",
          privacy: "private",
        });
        setSavedDestinations([]);
        setStatusMessage("Account deleted.");
      },
      onError: () => {
        setStatusMessage("Unable to delete account.");
      },
    });
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
            {profile.photo_url ? (
              <img
                src={profile.photo_url}
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
                onClick={() => handleProfileChange("photo_url", "")}
                disabled={!profile.photo_url}
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
              isSaving || profileLoading
                ? "cursor-not-allowed bg-[var(--border)] text-[var(--slate)]"
                : "bg-[var(--indigo)] text-white"
            }`}
            disabled={isSaving || profileLoading}
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
            Deleting removes your account and data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
