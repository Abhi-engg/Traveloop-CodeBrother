/**
 * TripTipsCard — Helpful tips shown alongside the Create Trip form.
 */
const tips = [
  {
    icon: "✈️",
    iconClass: "trip-tips-card__icon--coral",
    text: "Give your trip a catchy name — you'll thank yourself when browsing your travel history later!",
  },
  {
    icon: "📅",
    iconClass: "trip-tips-card__icon--teal",
    text: "Flexible dates? No worries — you can always update them later from the trip details page.",
  },
  {
    icon: "📸",
    iconClass: "trip-tips-card__icon--lavender",
    text: "A cover photo makes your trip card stand out. Try a photo that captures the vibe of your destination!",
  },
];

const TripTipsCard = () => {
  return (
    <div className="trip-tips-card" id="trip-tips-card">
      <p className="trip-tips-card__label">Pro tips</p>
      <h3 className="trip-tips-card__title">Make it yours</h3>
      <ul className="trip-tips-card__list">
        {tips.map((tip, i) => (
          <li key={i} className="trip-tips-card__item">
            <span className={`trip-tips-card__icon ${tip.iconClass}`}>
              {tip.icon}
            </span>
            <span>{tip.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripTipsCard;
