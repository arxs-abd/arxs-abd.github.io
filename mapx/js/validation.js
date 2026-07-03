/**
 * validation.js
 * Bertugas membaca & memvalidasi query parameter koordinat tujuan dari URL
 * SEBELUM aplikasi utama dimuat. Jika tidak valid, aplikasi tidak pernah
 * dijalankan sama sekali dan hanya layar "Akses Ditolak" yang tampil.
 */

/** Ambil raw value lat/lng dari query string, mendukung 2 format nama param */
function readRawCoordinates() {
  const params = new URLSearchParams(window.location.search);
  const latRaw = params.get("lat") ?? params.get("latitude");
  const lngRaw = params.get("lng") ?? params.get("longitude");
  return { latRaw, lngRaw };
}

/**
 * Validasi penuh koordinat tujuan.
 * Mengembalikan { valid: true, lat, lng } jika lolos semua aturan,
 * atau { valid: false } jika salah satu aturan gagal.
 */
export function validateDestinationCoordinates() {
  const { latRaw, lngRaw } = readRawCoordinates();

  // Wajib ada dan tidak kosong
  if (latRaw === null || lngRaw === null) return { valid: false };
  if (String(latRaw).trim() === "" || String(lngRaw).trim() === "") {
    return { valid: false };
  }

  const lat = Number(latRaw);
  const lng = Number(lngRaw);

  // Wajib berupa angka
  if (Number.isNaN(lat) || Number.isNaN(lng)) return { valid: false };

  // Rentang valid koordinat geografis
  if (lat < -90 || lat > 90) return { valid: false };
  if (lng < -180 || lng > 180) return { valid: false };

  return { valid: true, lat, lng };
}

/** Tampilkan layar "Akses Ditolak" dan pastikan aplikasi utama tidak muncul */
export function renderAccessDenied() {
  const deniedEl = document.getElementById("denied-screen");
  const appEl = document.getElementById("app");
  appEl.classList.add("hidden");
  appEl.setAttribute("aria-hidden", "true");
  deniedEl.classList.remove("hidden");
  deniedEl.setAttribute("aria-hidden", "false");
}

/** Tampilkan aplikasi utama (dipanggil hanya setelah validasi lolos) */
export function renderApp() {
  const deniedEl = document.getElementById("denied-screen");
  const appEl = document.getElementById("app");
  deniedEl.classList.add("hidden");
  deniedEl.setAttribute("aria-hidden", "true");
  appEl.classList.remove("hidden");
  appEl.setAttribute("aria-hidden", "false");
}
