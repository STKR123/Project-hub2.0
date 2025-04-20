// Simple filtering script
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Supabase client
    const supabaseUrl = 'https://ajvonlwnhsnmwjcidukb.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqdm9ubHduaHNubXdqY2lkdWtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODEwOTMsImV4cCI6MjA1OTc1NzA5M30.UZIAB1j2ZsKYNDLUrr08_NbzbLUzeuQWYacdaIcECz8';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    
    // Get DOM elements
    const projectsGrid = document.getElementById('projectsGrid');
    const departmentFilter = document.getElementById('departmentFilter');
    const yearFilter = document.getElementById('yearFilter');
    
    // Store all projects
    let allProjects = [];
    
    // Fetch all projects from Supabase
    async function fetchProjects() {
        try {
            console.log('Fetching projects from Supabase...');
            const { data, error } = await supabase.from('project1').select('*');
            
            if (error) {
                console.error('Error fetching projects:', error);
                return;
            }
            
            console.log(`Fetched ${data.length} projects`);
            allProjects = data;
            
            // Display all projects initially
            displayProjects(allProjects);
            
        } catch (err) {
            console.error('Error in fetchProjects:', err);
        }
    }
    
    // Display projects in the grid
    function displayProjects(projects) {
        // Clear the grid
        projectsGrid.innerHTML = '';
        
        console.log(`Displaying ${projects.length} projects`);
        
        if (projects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="no-projects">
                    <h3>No projects found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            return;
        }
        
        // Create a card for each project
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            card.innerHTML = `
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-content">
                    <span class="department-badge">${project.department}</span>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${Array.isArray(project.tags) ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
                    </div>
                    <div class="project-meta">
                        <div class="project-year">${project.year}</div>
                    </div>
                </div>
            `;
            
            // Add click event for modal
            card.addEventListener('click', () => {
                showModal(project);
            });
            
            projectsGrid.appendChild(card);
        });
    }
    
    // Filter projects based on department and year
    function filterProjects() {
        const department = departmentFilter.value;
        const year = yearFilter.value;
        
        console.log(`Filtering: department=${department}, year=${year}`);
        
        let filtered = [...allProjects];
        
        // Apply department filter
        if (department !== 'all') {
            filtered = filtered.filter(p => p.department === department);
            console.log(`After department filter: ${filtered.length} projects`);
        }
        
        // Apply year filter
        if (year !== 'all') {
            const yearNum = parseInt(year);
            filtered = filtered.filter(p => p.year === yearNum);
            console.log(`After year filter: ${filtered.length} projects`);
        }
        
        // Display filtered projects
        displayProjects(filtered);
    }
    
    // Update year filter options based on selected department
    function updateYearOptions(department) {
        // Save current selection if possible
        const currentYear = yearFilter.value;
        
        // Clear existing options
        yearFilter.innerHTML = '';
        
        // Always add 'All Years' option
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All Years';
        yearFilter.appendChild(allOption);
        
        // Add year options based on department
        let years = [];
        
        if (department === 'ACSE') {
            // For ACSE, only show 2022, 2023, 2024
            years = [2024, 2023, 2022];
        } else {
            // For other departments, show all years
            years = [2024, 2023, 2022, 2021];
        }
        
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
        
        // Try to restore previous selection if it exists in new options
        if (currentYear !== 'all') {
            const yearExists = years.includes(parseInt(currentYear));
            yearFilter.value = yearExists ? currentYear : 'all';
        }
    }
    
    // Add event listeners
    departmentFilter.addEventListener('change', (e) => {
        updateYearOptions(e.target.value);
        filterProjects();
    });
    
    yearFilter.addEventListener('change', filterProjects);
    
    // Initial setup
    updateYearOptions(departmentFilter.value);
    fetchProjects();
});
