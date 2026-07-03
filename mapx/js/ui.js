/**
 * ui.js
 * Kumpulan fungsi untuk memanipulasi elemen UI non-peta: overlay
 * permission, floating info card, badge status GPS/orientasi, dan
 * toggle buka/tutup info card.
 */

import { formatCoord } from "./utils.js";

const els = {
  permissionOverlay: document.getElementById("permission-overlay"),
  permissionIconWrap: document.getElementById("permission-icon-wrap"),
  permissionIcon: document.getElementById("permission-icon"),
  permissionSpinner: document.getElementById("permission-spinner"),
  permissionTitle: document.getElementById("permission-title"),
  permissionMessage: document.getElementById("permission-message"),
  btnAllowLocation: document.getElementById("btn-allow-location"),

  orientationBadge: document.getElementById("orientation-badge"),

  gpsStatusDot: document.getElementById("gps-status-dot"),
  gpsStatusText: document.getElementById("gps-status-text"),

  infoToggleBtn: document.getElementById("info-toggle-btn"),
  infoCard: document.getElementById("info-card"),

  infoUserLat: document.getElementById("info-user-lat"),
  infoUserLng: document.getElementById("info-user-lng"),
  infoUserAcc: document.getElementById("info-user-acc"),
  infoDestLat: document.getElementById("info-dest-lat"),
  infoDestLng: document.getElementById("info-dest-lng"),
  infoBearing: document.getElementById("info-bearing"),
  infoHeading: document.getElementById("info-heading"),
};

/** Tampilkan overlay permission lokasi (state awal, sebelum diizinkan) */
export function showPermissionOverlay(message) {
  if (message) els.permissionMessage.textContent = message;
  els.permissionOverlay.classList.remove("hidden", "opacity-0", "pointer-events-none");
}

/** Sembunyikan overlay permission (dipanggil setelah GPS aktif) */
export function hidePermissionOverlay() {
  els.permissionOverlay.classList.add("opacity-0", "pointer-events-none");
  window.setTimeout(() => els.permissionOverlay.classList.add("hidden"), 300);
}

/** Kembalikan overlay ke tampilan ikon statis + tombol (lawan dari state loading) */
function resetOverlayToIdle(buttonLabel) {
  els.permissionSpinner.classList.add("hidden");
  els.permissionIcon.classList.remove("hidden");
  els.btnAllowLocation.classList.remove("hidden");
  els.btnAllowLocation.disabled = false;
  els.btnAllowLocation.textContent = buttonLabel;
}

/**
 * Tampilkan state "loading" setelah pengguna menekan tombol izinkan lokasi,
 * selagi menunggu fix GPS pertama (watchPosition) datang. Tombol disembunyikan
 * dan ikon diganti spinner berputar agar pengguna tahu prosesnya sedang berjalan.
 */
export function showLocatingState() {
  els.permissionIcon.classList.add("hidden");
  els.permissionSpinner.classList.remove("hidden");
  els.permissionTitle.textContent = "Mencari Lokasi...";
  els.permissionMessage.textContent =
    "Mohon tunggu sebentar, kami sedang mendeteksi posisi GPS Anda.";
  els.btnAllowLocation.classList.add("hidden");
}

/** Tampilkan pesan bahwa akses lokasi ditolak pengguna */
export function showPermissionDenied() {
  resetOverlayToIdle("Coba Lagi");
  showPermissionOverlay();
  els.permissionTitle.textContent = "Akses Lokasi Ditolak";
  els.permissionMessage.textContent = "Navigasi tidak dapat digunakan tanpa akses lokasi.";
}

/** Tampilkan pesan saat GPS gagal/timeout meski izin sudah diberikan */
export function showLocationError() {
  resetOverlayToIdle("Coba Lagi");
  showPermissionOverlay();
  els.permissionTitle.textContent = "Gagal Mendapatkan Lokasi";
  els.permissionMessage.textContent =
    "Pastikan GPS aktif dan koneksi internet stabil, lalu coba lagi.";
}

/** Tampilkan badge "Orientation tidak didukung" */
export function showOrientationUnsupportedBadge() {
  els.orientationBadge.classList.remove("hidden");
}

/** Update badge status GPS (aktif / mencari / error) */
export function setGpsStatus(state) {
  const map = {
    active: { dot: "bg-emerald-500", text: "GPS Aktif" },
    searching: { dot: "bg-amber-400", text: "Mencari sinyal GPS..." },
    error: { dot: "bg-rose-500", text: "GPS Bermasalah" },
  };
  const cfg = map[state] || map.searching;
  els.gpsStatusDot.className = `inline-block w-2.5 h-2.5 rounded-full ${cfg.dot}`;
  els.gpsStatusText.textContent = cfg.text;
}

/** Update seluruh isi floating info card */
export function updateInfoCard({ user, destination, bearing, heading }) {
  if (user) {
    els.infoUserLat.textContent = formatCoord(user.lat);
    els.infoUserLng.textContent = formatCoord(user.lng);
    els.infoUserAcc.textContent =
      user.accuracy != null ? `± ${Math.round(user.accuracy)} m` : "-";
  }
  if (destination) {
    els.infoDestLat.textContent = formatCoord(destination.lat);
    els.infoDestLng.textContent = formatCoord(destination.lng);
  }
  if (bearing != null) els.infoBearing.textContent = `${Math.round(bearing)}°`;
  if (heading != null) els.infoHeading.textContent = `${Math.round(heading)}°`;
}

/** Pasang toggle buka/tutup info card */
export function initInfoCardToggle() {
  let open = false;
  els.infoToggleBtn.addEventListener("click", () => {
    open = !open;
    els.infoCard.classList.toggle("info-card-open", open);
  });
}

export function onAllowLocationClick(handler) {
  els.btnAllowLocation.addEventListener("click", handler);
}
