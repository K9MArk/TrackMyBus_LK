// eta.js

const GOOGLE_API_KEY = "AIzaSyBylJ_h2gF61lVuPCOIDGvupcSnad5-1Hw"; // use securely in production

/**
 * Get ETA (duration) between two points using Google Distance Matrix API.
 * @param {Object} origin - { lat, lng }
 * @param {Object} destination - { lat, lng }
 * @param {Function} callback - function(durationText)
 */
function getETA(origin, destination, callback) {
  const originStr = `${origin.lat},${origin.lng}`;
  const destStr = `${destination.lat},${destination.lng}`;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originStr}&destinations=${destStr}&mode=driving&key=${GOOGLE_API_KEY}`;

  // WARNING: This fetch will NOT work directly from browser (CORS issue).
  // Must be proxied via your Node.js backend or Firebase Cloud Function.

  fetch(`/api/proxy/eta?origin=${originStr}&destination=${destStr}`)
    .then(res => res.json())
    .then(data => {
      const duration = data.rows[0].elements[0].duration.text;
      callback(duration);
    })
    .catch(err => {
      console.error("Failed to fetch ETA:", err);
      callback("Unknown");
    });
}
