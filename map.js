let map;
let userMarker;
let busMarker;
const busId = "bus_101"; // Change if needed
let pollingInterval;

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        map = new google.maps.Map(document.getElementById("map"), {
          center: userLocation,
          zoom: 15
        });

        userMarker = new google.maps.Marker({
          position: userLocation,
          map: map,
          title: "You are here",
          icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        const busHalts = [
          { name: "Fort Bus Halt", lat: 6.9336, lng: 79.8500 },
          { name: "Pettah Bus Halt", lat: 6.9344, lng: 79.8470 },
          { name: "Slave Island Halt", lat: 6.9210, lng: 79.8565 }
        ];

        busHalts.forEach(halt => {
          const marker = new google.maps.Marker({
            position: { lat: halt.lat, lng: halt.lng },
            map: map,
            title: halt.name,
            icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          });

          marker.addListener("click", () => {
            const request = {
              origin: userLocation,
              destination: { lat: halt.lat, lng: halt.lng },
              travelMode: "WALKING"
            };

            directionsService.route(request, (result, status) => {
              if (status === "OK") {
                directionsRenderer.setDirections(result);
              } else {
                alert("Could not find route: " + status);
              }
            });
          });
        });

        // 🟢 Start polling bus location
        pollingInterval = setInterval(() => {
          fetch(`/api/location?busId=${busId}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.latitude && data.longitude) {
                const busPos = { lat: data.latitude, lng: data.longitude };

                if (!busMarker) {
                  busMarker = new google.maps.Marker({
                    position: busPos,
                    map: map,
                    title: "Live Bus",
                    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                  });
                } else {
                  busMarker.setPosition(busPos);
                }
              }
            })
            .catch(err => console.error("❌ Error fetching bus location:", err));
        }, 5000); // every 5s

      },
      () => alert("Geolocation failed!")
    );
  } else {
    alert("Geolocation not supported by your browser");
  }
}
