// search.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const resultsBox = document.getElementById("busResults");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const from = document.getElementById("fromInput").value.trim();
    const to = document.getElementById("toInput").value.trim();

    if (!from || !to) {
      alert("Please fill both origin and destination.");
      return;
    }

    const routeQuery = `${from} - ${to}`; // Format assumed by backend
    resultsBox.innerHTML = `<p>Loading buses...</p>`;

    try {
      const response = await fetch(`/api/buses?route=${encodeURIComponent(routeQuery)}`);
      const buses = await response.json();

      if (!Array.isArray(buses) || buses.length === 0) {
        resultsBox.innerHTML = `<p>No buses found on this route.</p>`;
        return;
      }

      resultsBox.innerHTML = ""; // Clear previous results

      buses.forEach(bus => {
        const card = document.createElement("div");
        card.className = "bus-card";
        card.innerHTML = `
          <h3>Bus #${bus.bus_number}</h3>
          <p>Route: ${routeQuery}</p>
          <p>Model: ${bus.model || 'Unknown'}</p>
          <p>ETA: ${bus.eta || 'Calculating...'}</p>
          <button class="app-button secondary" onclick="viewMap('${bus.routeId || ''}')">Track on Map</button>
        `;
        resultsBox.appendChild(card);
      });

    } catch (error) {
      console.error("Search error:", error);
      resultsBox.innerHTML = `<p>Server error. Please try again later.</p>`;
    }
  });
});

function findNearestHalts() {
  window.location.href = "passengerMap.html"; // or another page
}

function viewMap(routeId) {
  if (!routeId) {
    alert("Invalid route ID.");
    return;
  }
  window.location.href = `passengerMap.html?route=${routeId}`;
}
