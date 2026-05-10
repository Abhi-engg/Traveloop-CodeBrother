/**
 * RecommendedCities — Grid of popular destination chips.
 */

/* Country → flag emoji map for common destinations */
const countryFlags = {
  Portugal: "🇵🇹", Spain: "🇪🇸", France: "🇫🇷", Italy: "🇮🇹",
  Japan: "🇯🇵", Thailand: "🇹🇭", Greece: "🇬🇷", Turkey: "🇹🇷",
  USA: "🇺🇸", UK: "🇬🇧", Germany: "🇩🇪", Netherlands: "🇳🇱",
  Mexico: "🇲🇽", Brazil: "🇧🇷", Australia: "🇦🇺", India: "🇮🇳",
  Indonesia: "🇮🇩", Morocco: "🇲🇦", Egypt: "🇪🇬", Croatia: "🇭🇷",
  "South Korea": "🇰🇷", Vietnam: "🇻🇳", Colombia: "🇨🇴",
  "Czech Republic": "🇨🇿", Austria: "🇦🇹", Switzerland: "🇨🇭",
  Peru: "🇵🇪", Argentina: "🇦🇷", Norway: "🇳🇴", Sweden: "🇸🇪",
  Denmark: "🇩🇰", Ireland: "🇮🇪", Singapore: "🇸🇬", Malaysia: "🇲🇾",
  "New Zealand": "🇳🇿", Canada: "🇨🇦", Iceland: "🇮🇸",
};

/* Fallback cities shown when no DB cities exist */
const fallbackCities = [
  { id: "f1", name: "Lisbon", country: "Portugal" },
  { id: "f2", name: "Tokyo", country: "Japan" },
  { id: "f3", name: "Barcelona", country: "Spain" },
  { id: "f4", name: "Bali", country: "Indonesia" },
  { id: "f5", name: "Paris", country: "France" },
  { id: "f6", name: "Istanbul", country: "Turkey" },
];

const RecommendedCities = ({ cities = [] }) => {
  const displayCities = cities.length > 0 ? cities : fallbackCities;

  return (
    <div className="dash-cities" id="recommended-cities-card">
      <p className="dash-cities__label">Explore</p>
      <h3 className="dash-cities__title">Recommended Destinations</h3>
      <div className="dash-cities__grid">
        {displayCities.map((city) => (
          <div key={city.id} className="dash-city-chip" id={`city-chip-${city.id}`}>
            <span className="dash-city-chip__flag">
              {countryFlags[city.country] || "🌍"}
            </span>
            <div className="dash-city-chip__info">
              <p className="dash-city-chip__name">{city.name}</p>
              <p className="dash-city-chip__country">{city.country}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedCities;
