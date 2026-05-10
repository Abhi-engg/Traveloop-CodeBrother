import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useCreateTrip } from "../../api/trips";
import MoodPicker from "../../components/MoodPicker";
import {
  CoverPhotoUpload,
  TripPreviewCard,
  TripTipsCard,
} from "./components";
import "./CreateTripPage.css";

/**
 * CreateTripPage — Full-featured form to initiate a new trip
 * with name, dates, description, cover photo, and mood selection.
 *
 * Features:
 * - React Hook Form validation
 * - Live preview sidebar
 * - Drag-and-drop cover photo
 * - Success overlay with navigation
 * - Fully responsive layout
 */
const CreateTripPage = () => {
  const navigate = useNavigate();
  const createTrip = useCreateTrip();

  const [mood, setMood] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTripId, setCreatedTripId] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  // Watch fields for live preview
  const watchedName = watch("name");
  const watchedDescription = watch("description");
  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");

  // Generate cover preview URL
  useEffect(() => {
    if (!coverPhoto) {
      setCoverPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverPhoto);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverPhoto]);

  const handleCoverChange = useCallback((file) => {
    setCoverPhoto(file);
  }, []);

  const onSubmit = async (values) => {
    try {
      const tripData = {
        name: values.name.trim(),
        description: values.description?.trim() || "",
        start_date: values.startDate,
        end_date: values.endDate || null,
        mood_tag: mood || "",
      };

      const result = await createTrip.mutateAsync({
        data: tripData,
        coverPhoto,
      });

      setCreatedTripId(result.id);
      setShowSuccess(true);
    } catch (error) {
      console.error("Failed to create trip:", error);
    }
  };

  // Get today's date as minimum for the date picker
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      <div className="create-trip-page" id="create-trip-page">
        {/* ── Left: Form Card ──────────────────────────────── */}
        <div className="create-trip-form-card" id="create-trip-form">
          <div className="create-trip-header">
            <p className="create-trip-header__label">Create trip</p>
            <h1 className="create-trip-header__title">
              Build a new loop
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="create-trip-fields">
              {/* Trip Name */}
              <div className="form-group">
                <label
                  className="form-group__label form-group__label--required"
                  htmlFor="trip-name"
                >
                  Trip Name
                </label>
                <input
                  id="trip-name"
                  className={`form-group__input ${
                    errors.name ? "form-group__input--error" : ""
                  }`}
                  placeholder="Mediterranean Escape"
                  {...register("name", {
                    required: "Give your trip a name",
                    minLength: {
                      value: 2,
                      message: "At least 2 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Keep it under 100 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="form-group__error">{errors.name.message}</p>
                )}
              </div>

              {/* Dates Row */}
              <div className="create-trip-dates-row">
                <div className="form-group">
                  <label
                    className="form-group__label form-group__label--required"
                    htmlFor="trip-start-date"
                  >
                    Start Date
                  </label>
                  <input
                    id="trip-start-date"
                    type="date"
                    min={today}
                    className={`form-group__input ${
                      errors.startDate ? "form-group__input--error" : ""
                    }`}
                    {...register("startDate", {
                      required: "Pick a start date",
                    })}
                  />
                  {errors.startDate && (
                    <p className="form-group__error">
                      {errors.startDate.message}
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <label
                    className="form-group__label"
                    htmlFor="trip-end-date"
                  >
                    End Date
                  </label>
                  <input
                    id="trip-end-date"
                    type="date"
                    min={watchedStartDate || today}
                    className={`form-group__input ${
                      errors.endDate ? "form-group__input--error" : ""
                    }`}
                    {...register("endDate", {
                      validate: (value) => {
                        if (value && watchedStartDate && value < watchedStartDate) {
                          return "End date can't be before start";
                        }
                        return true;
                      },
                    })}
                  />
                  {errors.endDate && (
                    <p className="form-group__error">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label
                  className="form-group__label"
                  htmlFor="trip-description"
                >
                  Description
                </label>
                <textarea
                  id="trip-description"
                  className="form-group__textarea"
                  placeholder="Coral coast, vineyards, late-night tapas — a sun-soaked loop through southern Europe..."
                  rows={4}
                  {...register("description", {
                    maxLength: {
                      value: 500,
                      message: "Keep it under 500 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p className="form-group__error">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Cover Photo */}
              <CoverPhotoUpload
                value={coverPhoto}
                onChange={handleCoverChange}
              />
            </div>

            {/* Mood Picker */}
            <div className="create-trip-mood-section">
              <p className="create-trip-mood-section__label">Travel mood</p>
              <MoodPicker value={mood} onChange={setMood} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="create-trip-submit"
              disabled={createTrip.isPending}
              id="create-trip-submit-btn"
            >
              <span className="create-trip-submit__content">
                {createTrip.isPending ? (
                  <>
                    <span className="create-trip-spinner" />
                    Creating your trip...
                  </>
                ) : (
                  <>🚀 Create Trip</>
                )}
              </span>
            </button>

            {createTrip.isError && (
              <p
                className="form-group__error"
                style={{ marginTop: "0.75rem", textAlign: "center" }}
              >
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>

        {/* ── Right: Preview + Tips ────────────────────────── */}
        <div className="create-trip-sidebar">
          <TripPreviewCard
            formData={{
              name: watchedName,
              description: watchedDescription,
              startDate: watchedStartDate,
              endDate: watchedEndDate,
              mood,
            }}
            coverPreviewUrl={coverPreviewUrl}
          />
          <TripTipsCard />
        </div>
      </div>

      {/* ── Success Overlay ──────────────────────────────── */}
      {showSuccess && (
        <div className="create-trip-success" id="create-trip-success">
          <div className="create-trip-success__card">
            <div className="create-trip-success__icon">✓</div>
            <h2 className="create-trip-success__title">Trip Created!</h2>
            <p className="create-trip-success__text">
              Your new adventure is ready. Start adding stops and activities to
              bring your itinerary to life.
            </p>
            <div className="create-trip-success__actions">
              <button
                className="create-trip-success__btn create-trip-success__btn--primary"
                onClick={() => navigate("/trips")}
                id="success-view-trips"
              >
                View My Trips
              </button>
              <button
                className="create-trip-success__btn create-trip-success__btn--secondary"
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/trips/new");
                  window.location.reload();
                }}
                id="success-create-another"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateTripPage;
