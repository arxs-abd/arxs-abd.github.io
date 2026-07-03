/**
 * minimap.js
 * Mengatur transisi tampilan antara Mode 1 (navigasi fullscreen + minimap
 * kecil di kanan bawah) dan Mode 2 (peta fullscreen + panel navigasi
 * kecil mengambang di kiri atas). Menggunakan class CSS + transition agar
 * perpindahan terasa premium (transform, opacity, scale, ~300ms).
 */

export function setupModeToggle({ mapContainerEl, navPanelEl, mapController }) {
  let expanded = false;

  function expandToFullMap() {
    if (expanded) return;
    expanded = true;
    mapContainerEl.classList.remove("map-mini");
    mapContainerEl.classList.add("map-full");
    navPanelEl.classList.remove("nav-mode-full");
    navPanelEl.classList.add("nav-mode-compact");

    // Tunggu transisi CSS selesai (~300ms) sebelum recalculate ukuran peta
    window.setTimeout(() => mapController.invalidateSize(), 320);
  }

  function collapseToMiniMap() {
    if (!expanded) return;
    expanded = false;
    mapContainerEl.classList.remove("map-full");
    mapContainerEl.classList.add("map-mini");
    navPanelEl.classList.remove("nav-mode-compact");
    navPanelEl.classList.add("nav-mode-full");

    window.setTimeout(() => mapController.invalidateSize(), 320);
  }

  // Klik minimap (saat kecil) -> membesar ke Mode 2
  mapContainerEl.addEventListener("click", (e) => {
    if (!expanded) {
      expandToFullMap();
    }
  });

  // Klik panel navigasi kecil (saat Mode 2) -> kembali ke Mode 1
  navPanelEl.addEventListener("click", () => {
    if (expanded) {
      collapseToMiniMap();
    }
  });

  return {
    isExpanded: () => expanded,
    collapse: collapseToMiniMap,
    expand: expandToFullMap,
  };
}
