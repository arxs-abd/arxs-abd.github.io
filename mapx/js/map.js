/**
 * map.js
 * Inti peta interaktif menggunakan Leaflet.js + OpenStreetMap.
 * Bertanggung jawab membuat instance map, marker user & tujuan, polyline
 * rute, serta auto fit bounds. Instance map ini dipakai bersama baik
 * dalam mode minimap (kecil) maupun mode peta fullscreen (besar) —
 * lihat minimap.js untuk logika perbesar/perkecil kontainernya.
 */

function createUserIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div class="relative flex items-center justify-center w-6 h-6">
        <span class="absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-40 animate-ping"></span>
        <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-600 border-2 border-white shadow"></span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function createDestinationIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div class="flex flex-col items-center -translate-y-1/2">
        <div class="w-4 h-4 rotate-45 bg-indigo-700 rounded-sm shadow-lg border-2 border-white"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 20],
  });
}

export class MapController {
  constructor(containerId) {
    this.map = L.map(containerId, {
      zoomControl: false,
      attributionControl: false,
      dragging: true,
      scrollWheelZoom: true,
    }).setView([0, 0], 15);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
    }).addTo(this.map);

    this.userMarker = L.marker([0, 0], { icon: createUserIcon() }).addTo(this.map);
    this.destMarker = L.marker([0, 0], { icon: createDestinationIcon() }).addTo(
      this.map
    );
    this.polyline = L.polyline([], {
      color: "#4F46E5",
      weight: 4,
      opacity: 0.85,
      dashArray: "1, 8",
      lineCap: "round",
    }).addTo(this.map);

    this._hasFitted = false;
  }

  setDestination(lat, lng) {
    this.destMarker.setLatLng([lat, lng]);
  }

  /** Update posisi user, polyline, dan auto fit bounds */
  updateUser(lat, lng) {
    this.userMarker.setLatLng([lat, lng]);
    const destLatLng = this.destMarker.getLatLng();
    this.polyline.setLatLngs([
      [lat, lng],
      [destLatLng.lat, destLatLng.lng],
    ]);

    const bounds = L.latLngBounds([
      [lat, lng],
      [destLatLng.lat, destLatLng.lng],
    ]);

    this.map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 17,
      animate: true,
    });
    this._hasFitted = true;
  }

  /** Wajib dipanggil setiap kali kontainer map berubah ukuran (mini <-> full) */
  invalidateSize() {
    this.map.invalidateSize({ animate: false });
  }
}
