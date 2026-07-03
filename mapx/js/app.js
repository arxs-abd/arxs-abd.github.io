/**
 * app.js
 * Entry point aplikasi. Urutan eksekusi:
 * 1. Validasi query parameter koordinat tujuan.
 * 2. Jika tidak valid -> tampilkan layar "Akses Ditolak" dan STOP di sini.
 * 3. Jika valid -> render aplikasi navigasi dan inisialisasi seluruh modul.
 */

import { validateDestinationCoordinates, renderAccessDenied, renderApp } from "./validation.js";
import { LocationManager } from "./location.js";
import { CompassManager } from "./compass.js";
import { NavigationManager } from "./navigation.js";
import { MapController } from "./map.js";
import { setupModeToggle } from "./minimap.js";
import {
  showPermissionOverlay,
  hidePermissionOverlay,
  showPermissionDenied,
  showLocationError,
  showLocatingState,
  showOrientationUnsupportedBadge,
  setGpsStatus,
  updateInfoCard,
  initInfoCardToggle,
  onAllowLocationClick,
} from "./ui.js";

function bootstrap() {
  // Render ikon Lucide (baik untuk layar denied maupun layar app)
  if (window.lucide) window.lucide.createIcons();

  const result = validateDestinationCoordinates();

  if (!result.valid) {
    renderAccessDenied();
    return; // STOP — aplikasi navigasi tidak pernah dijalankan
  }

  renderApp();
  initApp(result.lat, result.lng);
}

function initApp(destLat, destLng) {
  const arrowEl = document.getElementById("nav-arrow");
  const distanceEl = document.getElementById("distance-text");
  const directionEl = document.getElementById("direction-text");
  const mapContainerEl = document.getElementById("map-container");
  const navPanelEl = document.getElementById("nav-panel");

  // --- Inisialisasi modul inti ---
  const navigation = new NavigationManager({ arrowEl, distanceEl, directionEl });
  navigation.setDestination(destLat, destLng);

  const mapController = new MapController("leaflet-map");
  mapController.setDestination(destLat, destLng);

  setupModeToggle({ mapContainerEl, navPanelEl, mapController });
  initInfoCardToggle();
  updateInfoCard({ destination: { lat: destLat, lng: destLng } });

  let latestBearing = null;
  let latestHeading = 0;

  const location = new LocationManager({
    onUpdate: (pos) => {
      setGpsStatus("active");
      hidePermissionOverlay();

      const calc = navigation.updateUserPosition(pos);
      mapController.updateUser(pos.lat, pos.lng);

      updateInfoCard({
        user: pos,
        bearing: calc ? calc.bearing : latestBearing,
        heading: latestHeading,
      });
      if (calc) latestBearing = calc.bearing;
    },
    onError: (error) => {
      setGpsStatus("error");
      if (error.code === 1) {
        // PERMISSION_DENIED
        showPermissionDenied();
      } else {
        // POSITION_UNAVAILABLE (2) atau TIMEOUT (3)
        showLocationError();
      }
    },
  });

  const compass = new CompassManager({
    onUpdate: (heading) => {
      latestHeading = heading;
      navigation.updateHeading(heading);
      updateInfoCard({ heading, bearing: latestBearing });
    },
    onUnsupported: () => {
      showOrientationUnsupportedBadge();
    },
  });

  if (!compass.isApiAvailable()) {
    showOrientationUnsupportedBadge();
  }

  // --- Alur permission ---
  setGpsStatus("searching");
  showPermissionOverlay();

  onAllowLocationClick(async () => {
    // Tampilkan state loading (spinner) sambil menunggu fix GPS pertama
    showLocatingState();

    // Wajib dipanggil di dalam user-gesture (klik) agar iOS mengizinkan sensor orientasi
    await compass.requestPermission();
    compass.start();
    location.start();
  });

  // Bersihkan resource saat halaman ditutup agar tidak memory leak
  window.addEventListener("beforeunload", () => {
    location.stop();
    compass.stop();
    navigation.destroy();
  });
}

document.addEventListener("DOMContentLoaded", bootstrap);
