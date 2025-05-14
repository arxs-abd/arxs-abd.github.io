/**
 * Theme management for PlayStation Rental Management
 * Handles dark mode toggle and persistence
 */

// Theme storage key
const THEME_STORAGE_KEY = "ps_rental_theme_preference"

// Theme options
const Themes = {
  LIGHT: "light",
  DARK: "dark",
}

// Initialize theme when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme()
  setupThemeToggle()
})

/**
 * Initialize theme based on stored preference or system preference
 */
function initializeTheme() {
  // Check for stored preference
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)

  if (storedTheme) {
    // Apply stored theme
    applyTheme(storedTheme)
  } else {
    // Check system preference
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    const initialTheme = prefersDarkMode ? Themes.DARK : Themes.LIGHT

    // Apply and save initial theme
    applyTheme(initialTheme)
    saveThemePreference(initialTheme)
  }
}

/**
 * Apply theme to document
 * @param {String} theme - Theme to apply (light or dark)
 */
function applyTheme(theme) {
  if (theme === Themes.DARK) {
    document.body.classList.add("dark-theme")
    // Update toggle switch if it exists
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.checked = true
    }
  } else {
    document.body.classList.remove("dark-theme")
    // Update toggle switch if it exists
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.checked = false
    }
  }
}

/**
 * Save theme preference to localStorage
 * @param {String} theme - Theme to save (light or dark)
 */
function saveThemePreference(theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme)
}

/**
 * Set up theme toggle event listener
 */
function setupThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle")

  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      const newTheme = themeToggle.checked ? Themes.DARK : Themes.LIGHT
      applyTheme(newTheme)
      saveThemePreference(newTheme)
    })
  }
}

/**
 * Toggle theme manually
 */
function toggleTheme() {
  const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || Themes.LIGHT
  const newTheme = currentTheme === Themes.LIGHT ? Themes.DARK : Themes.LIGHT

  applyTheme(newTheme)
  saveThemePreference(newTheme)
}
