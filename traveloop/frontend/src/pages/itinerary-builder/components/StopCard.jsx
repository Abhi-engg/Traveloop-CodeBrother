import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCities, useDeleteStop, useUpdateStop } from "../../../api/itinerary";
import ActivityList from "./ActivityList";

const StopCard = ({ stop, index }) => {
  const { data: cities = [] } = useCities();
  const deleteStop = useDeleteStop();
  const updateStop = useUpdateStop();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const city = cities.find((c) => c.id === stop.city_id);
  const cityName = city ? `${city.name}, ${city.country}` : `City #${stop.city_id}`;

  const handleDateChange = (field, value) => {
    updateStop.mutate({
      stopId: stop.id,
      data: {
        city_id: stop.city_id,
        order: stop.order,
        arrival_date: field === "arrival" ? value || null : stop.arrival_date,
        departure_date: field === "departure" ? value || null : stop.departure_date,
      },
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Remove ${cityName} from this itinerary?`)) {
      deleteStop.mutate(stop.id);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`ib-stop ${isDragging ? "ib-stop--dragging" : ""}`}
    >
      {/* Timeline marker */}
      <div className="ib-stop__marker">
        <div className="ib-stop__dot" />
        <span className="ib-stop__order">#{index + 1}</span>
      </div>

      {/* Card */}
      <div className="ib-stop__card">
        <div className="ib-stop__head">
          <div>
            <h3 className="ib-stop__city">{cityName}</h3>
            <div className="ib-stop__dates">
              <input
                type="date"
                className="ib-stop__date-input"
                value={formatDate(stop.arrival_date)}
                onChange={(e) => handleDateChange("arrival", e.target.value)}
                title="Arrival date"
              />
              <span>→</span>
              <input
                type="date"
                className="ib-stop__date-input"
                value={formatDate(stop.departure_date)}
                onChange={(e) => handleDateChange("departure", e.target.value)}
                title="Departure date"
              />
            </div>
          </div>

          <div className="ib-stop__controls">
            <button
              className="ib-stop__btn-icon ib-stop__btn-icon--drag"
              title="Drag to reorder"
              {...attributes}
              {...listeners}
            >
              ⋮⋮
            </button>
            <button
              className="ib-stop__btn-icon ib-stop__btn-icon--danger"
              onClick={handleDelete}
              title="Remove stop"
            >
              🗑
            </button>
          </div>
        </div>

        {/* Activities */}
        <ActivityList stopId={stop.id} cityId={stop.city_id} />
      </div>
    </div>
  );
};

export default StopCard;
