// tracking.js

let trackingInterval = null;

function startLocationTracking() {
  const busNumber = document.getElementById('busNumber').value.trim();
  const routeName = document.getElementById('routeName').value.trim();
  const statusEl = document.getElementById('statusMessage');

  if (!busNumber || !routeName) {
    alert("Please enter both Bus Number and Route.");
    return;
  }

  if (!navigator.geolocation) {
    alert("Geolocation not supported by your browser.");
    return;
  }

  statusEl.textContent = "📡 Tracking started...";

  trackingInterval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Send to server
        fetch('/api/location/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            busNumber: busNumber,
            lat: lat,
            lng: lng
          })
        })
        .then(response => response.json())
        .then(data => {
          console.log("Location sent:", data);
        })
        .catch(error => {
          console.error("Error sending location:", error);
          statusEl.textContent = "⚠️ Failed to send location.";
        });

      },
      (error) => {
        console.error("Geolocation error:", error);
        statusEl.textContent = "⚠️ Geolocation error: " + error.message;
      }
    );
  }, 10000); // Every 10 seconds
}

function stopLocationTracking() {
  clearInterval(trackingInterval);
  trackingInterval = null;

  const statusEl = document.getElementById('statusMessage');
  statusEl.textContent = "🛑 Tracking stopped.";
}
