// Initialize the map and set its view
const map = L.map('map').setView([0, 0], 13);

// Add a tile layer (using OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to handle success when geolocation is found
function onLocationFound(e) {
  const latlng = e.latlng;
  console.log(latlng)

  // Create a marker at the user's location
  const marker = L.marker([latlng.lat, latlng.lng]).addTo(map);

  // Add popup with location details
  marker.bindPopup(`You are here: <br> Latitude: ${latlng.lat}, Longitude: ${latlng.lng}`).openPopup();

  // Set the map view to user's location
  map.setView([latlng.lat, latlng.lng], 13);
  
  const circleMarker = L.circleMarker([-6.200000, 106.816666], {
    radius: 8,        // Size of the dot
    color: '#ff0000', // Border color of the dot
    fillColor: '#ff6666', // Fill color of the dot
    fillOpacity: 0.9  // Opacity of the fill
  }).addTo(map);

  // Add popup to the circle marker
  circleMarker.bindPopup('<b>Jakarta</b><br>This is a dot marker.').openPopup();

}

// Function to handle geolocation error
function onLocationError(e) {
  alert(e.message);
}

// Request user's location
map.locate({setView: true, maxZoom: 16});

// Event listeners for location found and error
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);
