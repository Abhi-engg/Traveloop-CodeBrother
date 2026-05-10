import { useState } from "react";
import {
  useActivities,
  useCreateStopActivity,
  useDeleteStopActivity,
  useStopActivities,
} from "../../../api/itinerary";

const ActivityList = ({ stopId, cityId }) => {
  const { data: stopActivities = [] } = useStopActivities(stopId);
  const { data: cityActivities = [] } = useActivities(cityId);
  const addActivity = useCreateStopActivity();
  const removeActivity = useDeleteStopActivity();
  const [open, setOpen] = useState(false);

  // Filter out activities already assigned
  const assignedIds = new Set(stopActivities.map((sa) => sa.activity_id));
  const available = cityActivities.filter((a) => !assignedIds.has(a.id));

  const handleAdd = (activityId) => {
    addActivity.mutate(
      { stopId, data: { activity_id: activityId } },
      { onSuccess: () => setOpen(false) }
    );
  };

  const handleRemove = (stopActivityId) => {
    removeActivity.mutate(stopActivityId);
  };

  return (
    <div className="ib-activities">
      <p className="ib-activities__label">Activities</p>

      {stopActivities.length === 0 && (
        <p style={{ fontSize: "0.78rem", color: "var(--slate)" }}>
          No activities yet — add one below
        </p>
      )}

      {stopActivities.map((sa) => {
        const activity = cityActivities.find((a) => a.id === sa.activity_id);
        return (
          <div key={sa.id} className="ib-activity">
            <div className="ib-activity__info">
              <span className="ib-activity__name">
                {activity?.name || `Activity #${sa.activity_id}`}
              </span>
              {activity?.duration_hours > 0 && (
                <span className="ib-activity__meta">
                  {activity.duration_hours}h
                </span>
              )}
              {activity?.avg_cost_usd > 0 && (
                <span className="ib-activity__meta">
                  ${activity.avg_cost_usd}
                </span>
              )}
            </div>
            <button
              className="ib-activity__remove"
              onClick={() => handleRemove(sa.id)}
              title="Remove activity"
            >
              ✕
            </button>
          </div>
        );
      })}

      <div className="ib-add-activity">
        <button
          className="ib-add-activity__trigger"
          onClick={() => setOpen(!open)}
        >
          <span>＋</span> Add activity
        </button>

        {open && (
          <div className="ib-add-activity__dropdown">
            {available.length === 0 ? (
              <p className="ib-add-activity__empty">
                {cityActivities.length === 0
                  ? "No activities for this city"
                  : "All activities assigned"}
              </p>
            ) : (
              available.map((a) => (
                <button
                  key={a.id}
                  className="ib-add-activity__item"
                  onClick={() => handleAdd(a.id)}
                >
                  <span>{a.name}</span>
                  {a.avg_cost_usd > 0 && (
                    <span style={{ fontSize: "0.7rem", color: "var(--slate)" }}>
                      ${a.avg_cost_usd}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityList;
