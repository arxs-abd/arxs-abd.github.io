// Project Data - Stored in an array as requested
const projectsData = [
    {
        title: "NoParkeeMart",
        description: "A minimalist website for show minimarket without pay to parking.",
        category: "web",
        tags: ["Node.js", "Express", "PostgreSQL"],
        demoLink: "https://noparkeemart.my.id/", 
    },
    {
        title: "ARXS Phone",
        description: "A stylish and modern phone app for show the phone. This website is inspired by GSM Arena",
        category: "web",
        tags: ["Node.js", "React", "Next JS", "Express", "PostgreSQL"],
        demoLink: "https://phones.noparkeemart.my.id/",
    },
    {
        title: "ARXS GPT",
        description: "A website for using Ai Model using API",
        category: "web",
        tags: ["Node.js", "Express", "PostgreSQL"],
        demoLink: "https://gpt.noparkeemart.my.id/",
    },
    {
        title: "Arxs Chat",
        description: "A website like ChatGPT for asking questions and chatting with the ARXS GPT API",
        category: "web",
        tags: ["Node.js", "Express", "PostgreSQL"],
        demoLink: "https://chat.noparkeemart.my.id/",
    },
    {
        title: "DONEX",
        description: "A website to donate to people like saweria",
        category: "web",
        tags: ["Node.js", "Express", "PostgreSQL"],
        demoLink: "https://donex.noparkeemart.my.id/",
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
    },
    {
        title: "Battleship Game",
        description: "A simple battleship game for two players.",
        category: "game",
        tags: ["HTML", "CSS", "JavaScript", "Pusher"],
        demoLink: "https://arxs-abd.github.io/battleship/",
    },
    {
        title: "Jawab TTS",
        description: "A website for get answer from TTS",
        category: "web",
        tags: ["HTML", "CSS", "JavaScript"],
        demoLink: "https://arxs-abd.github.io/tts/",
    },
    {
        title: "Speedometer",
        description: "A website for tracking the speed of your device",
        category: "web",
        tags: ["HTML", "CSS", "JavaScript"],
        demoLink: "https://arxs-abd.github.io/speedometer/",
    }
];
const projects = projectsData.map((project, index) => {
    return {
        id: index + 1,
        ...project,
    }
})

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProjects('all');
})

const projectsContainer = document.getElementById('projects-container');

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