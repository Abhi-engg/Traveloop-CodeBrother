const ActivityCard = ({ activity }) => {
  if (!activity) {
    return null;
  }

  return (
    <article className="rounded-lg border bg-white p-3">
      <h4 className="font-medium">{activity.name}</h4>
      <p className="text-xs text-slate-500">{activity.category || "General"}</p>
    </article>
  );
};

export default ActivityCard;
