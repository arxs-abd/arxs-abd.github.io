// Color Themes - Stored in an array as requested
const colorThemes = [
    {
        name: "default",
        primary: "#ff5470",
        secondary: "#ffe74c",
        accent: "#06d6a0"
    },
    {
        name: "blue",
        primary: "#5271ff",
        secondary: "#ffca85",
        accent: "#43dde6"
    },
    {
        name: "green",
        primary: "#0cca4a",
        secondary: "#ffdd4a",
        accent: "#ff5e5b"
    },
    {
        name: "purple",
        primary: "#9e15ff",
        secondary: "#ffdd4a",
        accent: "#01c5c4"
    },
    {
        name: "orange",
        primary: "#ff8e3c",
        secondary: "#b8f9d3",
        accent: "#2667ff"
    },
    {
        name: "yellow",
        primary: "#f8e71c",
        secondary: "#ffeb3b",
        accent: "#f5d93d"
    },
    {
        name: "pink",
        primary: "#f78fb3",
        secondary: "#ffe0e9",
        accent: "#c44569"
    },
    {
        name: "mint",
        primary: "#a8e6cf",
        secondary: "#dcedc1",
        accent: "#ffaaa5"
    },
    {
        name: "sky",
        primary: "#89c9f9",
        secondary: "#e0f7fa",
        accent: "#ffd3b6"
    },
    {
        name: "lavender",
        primary: "#b39ddb",
        secondary: "#e1bee7",
        accent: "#ce93d8"
    },
    {
        name: "peach",
        primary: "#ffc1a1",
        secondary: "#fff1e6",
        accent: "#ffb085"
    }
];

// DOM Elements
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const colorPickerToggle = document.getElementById('color-picker-toggle');
const colorPickerDropdown = document.querySelector('.color-picker-dropdown');
const colorButtons = document.querySelectorAll('.color-picker-dropdown .color-btn');
const filterButtons = document.querySelectorAll('.filter-btn');
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme preferences from localStorage if available
    loadThemePreferences();
    
    // Set the active color theme to the toggle button
    updateColorPickerToggle();
    
    // Initialize custom cursor
    initCustomCursor();
    
    // Initialize form submission
    initContactForm();
});

// Theme Toggle (Light/Dark Mode)
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode');
    
    // Save preference to localStorage
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
});

// Color Picker Toggle
colorPickerToggle.addEventListener('click', () => {
    colorPickerDropdown.classList.toggle('active');
});

// Close color picker when clicking outside
document.addEventListener('click', (e) => {
    if (!colorPickerToggle.contains(e.target) && !colorPickerDropdown.contains(e.target)) {
        colorPickerDropdown.classList.remove('active');
    }
});

// Color Theme Selection
colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Get theme name from data attribute
        const themeName = button.getAttribute('data-theme');
        
        // Remove all theme classes
        colorThemes.forEach(theme => {
            body.classList.remove(`theme-${theme.name}`);
        });
        
        // Add selected theme class
        if (themeName !== 'default') {
            body.classList.add(`theme-${themeName}`);
        }
        
        // Update the toggle button color
        updateColorPickerToggle(themeName);
        
        // Save preference to localStorage
        localStorage.setItem('colorTheme', themeName);
        
        // Close the dropdown
        colorPickerDropdown.classList.remove('active');
    });
});

// Update color picker toggle button to match active theme
function updateColorPickerToggle(themeName = null) {
    // If no theme name provided, get it from localStorage or use default
    if (!themeName) {
        themeName = localStorage.getItem('colorTheme') || 'default';
    }
    
    // Find the theme in our array
    const theme = colorThemes.find(t => t.name === themeName);
    
    // Update the toggle button color
    if (theme) {
        colorPickerToggle.style.backgroundColor = theme.primary;
    }
}

// Project Filtering
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        const filter = button.getAttribute('data-filter');
        
        // Display filtered projects
        displayProjects(filter);
    });
});

// Custom Cursor
function initCustomCursor() {
    document.addEventListener('mousemove', (e) => {
        // Update cursor position
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
        
        // Update cursor follower with slight delay
        setTimeout(() => {
            cursorFollower.style.left = `${e.clientX}px`;
            cursorFollower.style.top = `${e.clientY}px`;
        }, 50);
    });
    
    // Add hover effect for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .social-link, input, textarea');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.width = '15px';
            cursor.style.height = '15px';
            cursorFollower.style.width = '40px';
            cursorFollower.style.height = '40px';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.width = '10px';
            cursor.style.height = '10px';
            cursorFollower.style.width = '30px';
            cursorFollower.style.height = '30px';
        });
    });
}

// Contact Form
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For this demo, we'll just show an alert
            alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
            
            // Reset form
            contactForm.reset();
        });
    }
}

// Load Theme Preferences from localStorage
function loadThemePreferences() {
    // Load dark/light mode preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    }
    
    // Load color theme preference
    const savedColorTheme = localStorage.getItem('colorTheme');
    if (savedColorTheme) {
        // Remove all theme classes
        colorThemes.forEach(theme => {
            body.classList.remove(`theme-${theme.name}`);
        });
        
        // Add saved theme class if not default
        if (savedColorTheme !== 'default') {
            body.classList.add(`theme-${savedColorTheme}`);
        }
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
});