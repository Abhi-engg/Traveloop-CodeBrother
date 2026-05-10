import { useState } from "react";
import { useCities, useCreateStop } from "../../../api/itinerary";

const AddStopModal = ({ tripId, onClose }) => {
  const { data: cities = [], isLoading } = useCities();
  const createStop = useCreateStop();
  const [cityId, setCityId] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cityId) return;

    createStop.mutate(
      {
        tripId,
        data: {
          city_id: Number(cityId),
          arrival_date: arrival || null,
          departure_date: departure || null,
        },
      },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="ib-modal-overlay" onClick={onClose}>
      <div className="ib-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="ib-modal__title">Add a new stop</h3>

        <form onSubmit={handleSubmit}>
          <div className="ib-modal__field">
            <label className="ib-modal__label">City</label>
            <select
              className="ib-modal__select"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              required
              id="add-stop-city-select"
            >
              <option value="">
                {isLoading ? "Loading cities…" : "Select a city"}
              </option>
              {cities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}, {c.country}
                </option>
              ))}
            </select>
          </div>

          <div className="ib-modal__row">
            <div className="ib-modal__field">
              <label className="ib-modal__label">Arrival</label>
              <input
                type="date"
                className="ib-modal__input"
                value={arrival}
                onChange={(e) => setArrival(e.target.value)}
                id="add-stop-arrival"
              />
            </div>
            <div className="ib-modal__field">
              <label className="ib-modal__label">Departure</label>
              <input
                type="date"
                className="ib-modal__input"
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
                id="add-stop-departure"
              />
            </div>
          </div>

          <div className="ib-modal__actions">
            <button type="button" className="ib-modal__btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="ib-modal__btn ib-modal__btn--primary"
              disabled={!cityId || createStop.isPending}
              id="add-stop-submit"
            >
              {createStop.isPending ? "Adding…" : "Add stop"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStopModal;
