// Project Data - Stored in an array as requested
const projectsData = [
    {
        title: "NoParkeeMart",
        description: "A minimalist website for show minimarket without pay to parking.",
        category: "web",
        tags: ["Node.js", "Express", "PostgreSQL"],
        demoLink: "https://noparkemart.my.id/", 
    },
    {
        title: "ARXS Phone",
        description: "A stylish and modern phone app for show the phone. This website is inspired by GSM Arena",
        category: "web",
        tags: ["Node.js", "React", "Next JS", "Express", "PostgreSQL"],
        demoLink: "https://phones.noparkeemart.my.id/",
    },
    {
        title: "Arxs Chat",
        description: "A website like ChatGPT for asking questions and chatting with the Gemini API.",
        category: "web",
        tags: ["Node.js", "Express", "PostgreSQL"],
        demoLink: "https://chat.noparkeemart.my.id/",
    },
    {
        title: "Minesweeper",
        description: "A website for playing Minesweeper game",
        category: "game",
        tags: ["HTML", "CSS", "JavaScript"],
        demoLink: "https://arxs-abd.github.io/minesweper/",
    },
    {
        title: "Chess",
        description: "A website for playing Chess game",
        category: "game",
        tags: ["HTML", "CSS", "JavaScript"],
        demoLink: "https://arxs-abd.github.io/chess/",
    },
    {
        title: "Al Quran Website",
        description: "A website for reading the Quran",
        category: "web",
        tags: ["HTML", "CSS", "JavaScript"],
        demoLink: "https://arxs-abd.github.io/quran/",
    },
    {
        title: "Money App",
        description: "A simple app for tracking your expenses and income.",
        category: "web",
        tags: ["Node.js", "React"],
        demoLink: "https://money.noparkeemart.my.id/",
    },
    {
        title: "Timer for PlayStation Rental",
        description: "A simple timer app for tracking the rental time of a PlayStation console.",
        category: "website",
        tags: ["HTML", "CSS", "JavaScript"],
        demoLink: "https://arxs-abd.github.io/rental-ps/",
    },
    {
        title: "Scoreboard for Football Game",
        description: "A simple scoreboard app for tracking the scores of a football game, with controller or setting like name of team, score, time even VAR checking.",
        category: "website",
        tags: ["HTML", "CSS", "JavaScript"],
        demoLink: "https://arxs-abd.github.io/scoreboard/settings.html",
    }
];
const projects = projectsData.map((project, index) => {
    return {
        id: index + 1,
        ...project,
    }
})

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
const projectsContainer = document.getElementById('projects-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme preferences from localStorage if available
    loadThemePreferences();
    
    // Set the active color theme to the toggle button
    updateColorPickerToggle();
    
    // Populate projects
    displayProjects('all');
    
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

// Display Projects Function - Updated for text-only cards
function displayProjects(filter) {
    // Clear projects container
    projectsContainer.innerHTML = '';
    
    // Filter projects based on category
    const filteredProjects = filter === 'all' 
        ? projects 
        : projects.filter(project => project.category === filter);
    
    // Create project cards
    filteredProjects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        // Create tags HTML
        const tagsHTML = project.tags.map(tag => 
            `<span class="project-tag">${tag}</span>`
        ).join('');
        
        // Format project number with leading zeros
        const formattedNumber = project.id.toString().padStart(2, '0');
        
        // Set project card HTML - no image
        projectCard.innerHTML = `
            <div class="project-number">${formattedNumber}</div>
            <div class="project-tags">
                ${tagsHTML}
            </div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-links">
                <a href="${project.demoLink}" class="project-link" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    Demo
                </a>
            </div>
        `;
        
        // Add project card to container
        projectsContainer.appendChild(projectCard);
    });
    
    // Show message if no projects match the filter
    if (filteredProjects.length === 0) {
        projectsContainer.innerHTML = `
            <div class="no-projects">
                <p>No projects found in this category.</p>
            </div>
        `;
    }
}

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