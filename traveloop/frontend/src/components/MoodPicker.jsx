const moods = ["Relaxed", "Adventurous", "Romantic", "Cultural", "Foodie"];

const MoodPicker = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <button
          key={mood}
          className={`rounded-full border px-4 py-2 text-sm ${
            value === mood
              ? "border-slate-900 bg-slate-900 text-white"
              : "bg-white"
          }`}
          onClick={() => onChange?.(mood)}
          type="button"
        >
          {mood}
        </button>
      ))}
    </div>
  );
};

export default MoodPicker;
