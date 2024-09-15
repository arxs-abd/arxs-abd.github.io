// Initialize the map and set its view
const map = L.map('map').setView([0, 0], 13);

// Add a tile layer (using OpenStreetMap tiles)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to handle success when geolocation is found
function onLocationFound(e) {
  const latlng = e.latlng

  // Create a marker at the user's location
  const marker = L.marker([latlng.lat, latlng.lng]).addTo(map)

  // Add popup with location details
  marker.bindPopup(`Kamu Disini`)

  // Set the map view to user's location
  map.setView([latlng.lat, latlng.lng], 13)

  // Fungsi untuk membuat legenda
  const legend = L.control({ position: 'bottomright' })

  legend.onAdd = function (map) {
    const div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<i style="background: #2981ca"></i> Indomaret<br>'
    div.innerHTML += '<i style="background: #d7172e"></i> Alfamart<br>'
    div.innerHTML += '<i style="background: #340308"></i> Alfamidi<br>'
    return div
  };

  legend.addTo(map)

  // for (const data of DATAS) {
  for (const data of calculateDistancesFrom(latlng.lat, latlng.lng, DATAS)) {
    let color = '#2981ca' // Default Indomaret
    if (data.type === 'Alfamart') color = '#d7172e' // Alfamart 
    else if (data.type === 'Alfamidi') color = '#340308' // Alfamidi

    const circleMarker = L.circleMarker([data.lat, data.long], {
      radius: 6,        
      color: color,
      fillColor: color, 
      fillOpacity: 1
    }).addTo(map);
  
    // Add popup to the circle marker
    circleMarker.bindPopup(`<b>${data.type}</b><br>${data.name}. <a href="https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.long}" target="_blank">Lihat Rute</a>`);
  }
  

  let markerx = null

  map.on('click', function(e) {
    const lat = e.latlng.lat
    const lng = e.latlng.lng

    if (markerx) map.removeLayer(markerx)

    // Log koordinat yang diklik
    console.log(`Koordinat yang diklik: Latitude = ${lat}, Longitude = ${lng}`)

    // Tambahkan marker di lokasi yang diklik
    // markerx = L.marker([lat, lng]).addTo(map)
    //   .bindPopup(`Latitude: ${lat}, Longitude: ${lng}`).openPopup();
  });

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
