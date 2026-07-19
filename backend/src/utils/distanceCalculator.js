const RAJKOT_DEALERSHIP_COORDS = { lat: 22.3039, lng: 70.8022 };

const CITY_COORDINATES = {
  rajkot: { lat: 22.3039, lng: 70.8022 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  surat: { lat: 21.1702, lng: 72.8311 },
  vadodara: { lat: 22.3072, lng: 73.1812 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
};

// Haversine formula for geodesic distance in kilometers
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

const getDeliveryDetailsForCity = (cityName) => {
  const normalized = (cityName || "").trim().toLowerCase();
  let coords = CITY_COORDINATES[normalized];

  if (!coords) {
    // Fallback based on hash or default to Ahmedabad coords
    coords = { lat: 23.0225, lng: 72.5714 };
  }

  const distanceKm = calculateDistanceKm(
    RAJKOT_DEALERSHIP_COORDS.lat,
    RAJKOT_DEALERSHIP_COORDS.lng,
    coords.lat,
    coords.lng
  );

  let deliveryDays = 1;
  if (distanceKm > 300 && distanceKm <= 750) deliveryDays = 2;
  else if (distanceKm > 750 && distanceKm <= 1500) deliveryDays = 3;
  else if (distanceKm > 1500) deliveryDays = 4;

  return {
    coords,
    distanceKm,
    deliveryDays,
  };
};

module.exports = {
  RAJKOT_DEALERSHIP_COORDS,
  CITY_COORDINATES,
  calculateDistanceKm,
  getDeliveryDetailsForCity,
};
