const RAJKOT_DEALERSHIP_COORDS = { lat: 22.3039, lng: 70.8022 };

const CITY_COORDINATES = {
  rajkot: { lat: 22.3039, lng: 70.8022 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  ahmadabad: { lat: 23.0225, lng: 72.5714 },
  surat: { lat: 21.1702, lng: 72.8311 },
  vadodara: { lat: 22.3072, lng: 73.1812 },
  baroda: { lat: 22.3072, lng: 73.1812 },
  gandhinagar: { lat: 23.2156, lng: 72.6369 },
  bhavnagar: { lat: 21.7645, lng: 72.1519 },
  jamnagar: { lat: 22.4707, lng: 70.0577 },
  junagadh: { lat: 21.5222, lng: 70.4579 },
  anand: { lat: 22.5645, lng: 72.9289 },
  nadiad: { lat: 22.6916, lng: 72.8634 },
  morbi: { lat: 22.8173, lng: 70.8358 },
  bhuj: { lat: 23.2420, lng: 69.6669 },
  vapi: { lat: 20.3893, lng: 72.9106 },
  mumbai: { lat: 19.0760, lng: 72.8777 },
  pune: { lat: 18.5204, lng: 73.8567 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  nashik: { lat: 19.9975, lng: 73.7898 },
  delhi: { lat: 28.6139, lng: 77.2090 },
  newdelhi: { lat: 28.6139, lng: 77.2090 },
  gurgaon: { lat: 28.4595, lng: 77.0266 },
  noida: { lat: 28.5355, lng: 77.3910 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  udaipur: { lat: 24.5854, lng: 73.7125 },
  jodhpur: { lat: 26.2389, lng: 73.0243 },
  bengaluru: { lat: 12.9716, lng: 77.5946 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.3850, lng: 78.4867 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  indore: { lat: 22.7196, lng: 75.8577 },
  bhopal: { lat: 23.2599, lng: 77.4126 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
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
  const raw = (cityName || "").trim().toLowerCase();
  const normalized = raw.replace(/[^a-z0-9]/g, "");

  let coords = CITY_COORDINATES[normalized];

  if (!coords && normalized.length > 0) {
    // Fuzzy matching against known keys
    const matchedKey = Object.keys(CITY_COORDINATES).find(
      (key) => normalized.includes(key) || key.includes(normalized)
    );
    if (matchedKey) {
      coords = CITY_COORDINATES[matchedKey];
    }
  }

  // Fallback to Ahmedabad coords if city uncatalogued so map route is always present
  if (!coords) {
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
