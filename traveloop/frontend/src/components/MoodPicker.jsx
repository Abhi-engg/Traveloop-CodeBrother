const moods = ["Relaxed", "Adventurous", "Romantic", "Cultural", "Foodie"];

const MoodPicker = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {moods.map((mood) => (
        <button
          key={mood}
          className={`rounded-full border px-4 py-2 text-sm ${
            value === mood
              ? "border-transparent bg-gradient-to-r from-[var(--coral)] via-[var(--coral-soft)] to-[var(--coral-sun)] text-white"
              : "border-[var(--border)] bg-white text-[var(--slate)]"
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
