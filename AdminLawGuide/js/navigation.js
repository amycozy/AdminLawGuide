// AdminLawGuide/js/navigation.js

// This file will handle main page navigation and subsection smooth scrolling.
// Note: This is an intermediate step in refactoring. `loadSection` currently
// calls functions like `setupInteractiveElements` which are defined in main.js
// or will be moved to other modules. Dependencies will be cleaned up later.

function setupSubsectionNavigation() {
    // Select links within section-navigation divs that are anchor links
    const subsectionLinks = document.querySelectorAll('.section-navigation a[href^="#"]');

    subsectionLinks.forEach(link => {
        // Prevent re-initializing if already done
        if (link.dataset.navInitialized) return;
        link.dataset.navInitialized = 'true';

        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', this.href);
            }
        });
    });
}

function setupNavigation() {
    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) {
        console.error("Content container not found for navigation setup.");
        return;
    }
    
    const navLinks = document.querySelectorAll('a[data-section]');
    
    navLinks.forEach(link => {
        // Prevent re-initializing if already done
        if (link.dataset.navInitialized) return;
        link.dataset.navInitialized = 'true';

        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionName = this.getAttribute('data-section');
            loadSection(sectionName); // loadSection will be defined in main.js or passed
            window.location.hash = this.getAttribute('href');
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Initial section load logic (to be called from main.js)
    // This part needs to be callable after navLinks are processed.
    // loadInitialSection(); // This will be called from main.js after setupNavigation is run.
}

// loadSection is assumed to be globally available from main.js for now,
// or will be passed as a dependency.
// It's responsible for fetching content and then calling relevant setup functions
// for the new content, like setupInteractiveElements, setupSubsectionNavigation etc.

// Example of how main.js might call these:
// document.addEventListener('DOMContentLoaded', function() {
//     setupNavigation(); // Sets up main nav links
//     loadInitialSection(); // Loads initial content, defined in main.js or navigation.js
//     setupSubsectionNavigation(); // Sets up initial subsection links
// });
