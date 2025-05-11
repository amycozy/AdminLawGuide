// Main functionality for Administrative Law Guide

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Mermaid for flowcharts
    initializeMermaid();
    
    // Set up navigation functionality (now from navigation.js)
    if (typeof setupNavigation === 'function') {
        setupNavigation(); // Sets up main nav links. loadInitialSection is called within setupNavigation if it's moved there, or called separately.
    } else {
        console.error('setupNavigation function not found. Ensure js/navigation.js is loaded.');
    }
    
    // Set up control buttons
    setupControlButtons();
    
    // Apply visual enhancements (function is now in js/uiEnhancements.js)
    if (typeof applyVisualEnhancements === 'function') {
        applyVisualEnhancements();
    } else {
        console.error('applyVisualEnhancements function not found. Ensure js/uiEnhancements.js is loaded.');
    }
    
    // Set up interactive elements (including tabs and toggles via components)
    setupInteractiveElements();
    
    // Set up visual knowledge maps interactions
    setupVisualKnowledgeMaps();

    // Set up subsection navigation (now from navigation.js)
    // This will apply to initially present subsection links.
    // loadSection will call it again for newly loaded content.
    if (typeof setupSubsectionNavigation === 'function') {
        setupSubsectionNavigation();
    } else {
        console.error('setupSubsectionNavigation function not found. Ensure js/navigation.js is loaded.');
    }
});

// Initialize Mermaid diagrams (function is now in js/mermaidHandler.js)
// The call initializeMermaid() remains in the DOMContentLoaded listener at the top of this file.
// The mermaid.init() call within loadSection also remains to re-render new diagrams.

// --- Navigation Core Logic (loadSection, loadInitialSection) remains in main.js for now ---
// setupNavigation (event listeners for main nav) is now in navigation.js
// setupSubsectionNavigation is now in navigation.js

// Function to load a section content (called by setupNavigation in navigation.js)
// and to load the initial section.
let navLinksForLoadSection; // To be populated by setupNavigation in navigation.js if needed, or re-queried.
let contentContainerForLoadSection; // To be populated

function initializeLoadSectionDependencies() {
    contentContainerForLoadSection = document.getElementById('content-container');
    navLinksForLoadSection = document.querySelectorAll('a[data-section]'); // Re-query or ensure it's passed
}

function loadInitialSection() {
    if (!contentContainerForLoadSection) initializeLoadSectionDependencies();
    if (!contentContainerForLoadSection) {
        console.error("Content container not found for initial load.");
        return;
    }

    let sectionToLoad = 'overview'; // Default section
    let activeLinkForInitialLoad = null;

    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const hashSectionLink = document.querySelector(`a[data-section][href="#${hash}"]`);
        
        if (hashSectionLink && hashSectionLink.getAttribute('data-section')) {
            sectionToLoad = hashSectionLink.getAttribute('data-section');
            activeLinkForInitialLoad = hashSectionLink;
        }
    } else {
        activeLinkForInitialLoad = document.querySelector('a[data-section="overview"]');
    }
    
    if (activeLinkForInitialLoad) {
        navLinksForLoadSection.forEach(l => l.classList.remove('active'));
        activeLinkForInitialLoad.classList.add('active');
    }
    
    loadSection(sectionToLoad);
}

function loadSection(sectionName) {
    if (!contentContainerForLoadSection) {
        // This might happen if called before DOMContentLoaded fully resolves dependencies
        // or if setupNavigation in navigation.js calls this before main.js initializes it.
        // Fallback to re-initializing.
        initializeLoadSectionDependencies();
        if (!contentContainerForLoadSection) {
            console.error("Content container still not found in loadSection.");
            return;
        }
    }

    contentContainerForLoadSection.innerHTML = '<div class="loading">Loading content...</div>';
    
    fetch(`sections/${sectionName}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Section not found');
                }
                return response.text();
            })
            .then(html => {
                contentContainerForLoadSection.innerHTML = html;
                
                // Initialize mermaid diagrams in the new content
                if (typeof initializeMermaid === 'function') { // Could be in mermaidHandler.js
                    mermaid.init(undefined, document.querySelectorAll('.mermaid')); // mermaid global might still be used
                } else if (typeof mermaid !== 'undefined' && typeof mermaid.init === 'function') {
                     mermaid.init(undefined, document.querySelectorAll('.mermaid'));
                }
                
                // Set up visual knowledge maps if this is the visual-knowledge-maps section
                if (sectionName === 'visual-knowledge-maps' && typeof setupVisualKnowledgeMaps === 'function') {
                    setupVisualKnowledgeMaps();
                }
                
                // Initialize interactive elements for the new content
                if (typeof setupInteractiveElements === 'function') {
                    setupInteractiveElements();
                }
                
                // Set up subsection navigation for the new content (from navigation.js)
                if (typeof setupSubsectionNavigation === 'function') {
                    setupSubsectionNavigation();
                } else {
                     console.error('setupSubsectionNavigation function not found after loadSection. Ensure js/navigation.js is loaded.');
                }

                // Scroll to top
                window.scrollTo(0, 0);
            })
            .catch(error => {
                console.error('Error loading section:', error);
                if (contentContainerForLoadSection) {
                    contentContainerForLoadSection.innerHTML = `
                        <div class="warning">
                            <h3>Error Loading Content</h3>
                            <p>Sorry, we couldn't load the ${sectionName} section. Please try again later.</p>
                        </div>
                    `;
                }
            });
}

// Call loadInitialSection after setupNavigation has had a chance to run and populate navLinks
document.addEventListener('DOMContentLoaded', function() {
    // Ensure dependencies for loadInitialSection are ready
    initializeLoadSectionDependencies(); 
    // Call loadInitialSection after other initial setups like main nav listeners
    // This assumes setupNavigation in navigation.js has run and navLinksForLoadSection is populated,
    // or loadInitialSection re-queries them.
    if (typeof setupNavigation === 'function') { // Check if navigation.js's setupNavigation is present
        // setupNavigation(); // This is called at the top of DOMContentLoaded
        loadInitialSection(); // Now call this to load the content
    }


    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        loadInitialSection();
    });
});


// Set up control buttons functionality
function setupControlButtons() {
    // Refresh diagrams button
    const refreshButton = document.getElementById('refresh-diagrams');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        });
    }
    
    // Export to PDF button
    const exportButton = document.getElementById('export-pdf');
    const printInstructions = document.getElementById('print-instructions');
    const cancelPrintButton = document.getElementById('cancel-print');
    
    if (exportButton && printInstructions) {
        exportButton.addEventListener('click', function() {
            printInstructions.style.display = 'block';
        });
    }
    
    if (cancelPrintButton) {
        cancelPrintButton.addEventListener('click', function() {
            printInstructions.style.display = 'none';
        });
    }
}

// Apply visual enhancements function is now in js/uiEnhancements.js

// Set up interactive elements for mastery center
function setupInteractiveElements() {
    // Set up mastery navigation links
    document.querySelectorAll('.mastery-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all navigation links
            document.querySelectorAll('.mastery-nav-link').forEach(l => {
                l.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all mastery sections
            document.querySelectorAll('.mastery-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the target section
            const targetId = this.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Set up flashcard functionality (This is now primarily handled by js/flashcards.js if those are the cards in use)
    // If there are generic '.flashcard' elements not managed by js/flashcards.js, this might be needed.
    // For now, assuming js/flashcards.js handles its specific flashcards, including flip logic.
    // document.querySelectorAll('.flashcard').forEach(card => {
    //     card.addEventListener('click', function() {
    //         this.classList.toggle('flipped');
    //     });
    // });
    
    // Set up mastery center tabs using the new component
    // Assumes .mastery-tab buttons have 'data-tab-target' pointing to the ID of a .mastery-section
    // and that the initially active tab has a .active class if specific default is needed.
    if (typeof initializeTabSystem === 'function') {
        // Note: HTML for mastery tabs might need adjustment:
        // - Ensure .mastery-tab buttons have a 'data-tab-target' attribute.
        // - Example: <button class="mastery-tab active" data-tab-target="mastery-flashcards-content">Flashcards</button>
        // - Content panels should be .mastery-section and have corresponding IDs.
        initializeTabSystem('.mastery-tab', '.mastery-section', '.mastery-tab.active');
    } else {
        console.error('initializeTabSystem function not found. Ensure js/components/tabs.js is loaded.');
    }
    
    // Set up toggle answer buttons using the new component
    if (typeof initializeToggleButtons === 'function') {
        initializeToggleButtons('.toggle-answer');
    } else {
        console.error('initializeToggleButtons function not found. Ensure js/components/toggleContent.js is loaded.');
    }
    
    // Set up quiz functionality
    const checkAnswersButton = document.getElementById('check-answers');
    if (checkAnswersButton) {
        checkAnswersButton.addEventListener('click', function() {
            const feedbackElements = document.querySelectorAll('.quiz-feedback');
            feedbackElements.forEach(element => {
                element.style.display = 'block';
            });
            
            const radioButtons = document.querySelectorAll('.quiz-options input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.disabled = true;
            });
        });
    }
    
    // Add hover effects to doctrine boxes and other containers
    // This logic is now part of applyVisualEnhancements in uiEnhancements.js
    // const enhanceableContainers = document.querySelectorAll('.doctrine-box, .legislative-box, .executive-box, .judicial-box, .case-box');
    // enhanceableContainers.forEach(container => {
    //     container.addEventListener('mouseenter', function() {
    //         this.style.transform = 'translateY(-3px)';
    //         this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
    //         this.style.transition = 'transform 0.3s, box-shadow 0.3s';
    //     });
        
    //     container.addEventListener('mouseleave', function() {
    //         this.style.transform = 'translateY(0)';
    //         this.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.05)';
    //     });
    // });
}

// Set up visual knowledge maps interactions
function setupVisualKnowledgeMaps() {
    // Initialize all scenario answers to be hidden
    document.querySelectorAll('.scenario-answer').forEach(answer => {
        answer.style.display = 'none';
    });
    
    // Add hover effects to decision trees and concept webs
    const visualElements = document.querySelectorAll('.decision-tree, .concept-web, .process-map');
    visualElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            this.style.transition = 'transform 0.3s, box-shadow 0.3s';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Add interactive behavior to decision tree nodes
    document.querySelectorAll('.node-question').forEach(node => {
        node.addEventListener('click', function() {
            this.classList.toggle('highlight');
            if (this.classList.contains('highlight')) {
                this.style.backgroundColor = '#e8f5e9';
                this.style.borderColor = '#4caf50';
            } else {
                this.style.backgroundColor = 'white';
                this.style.borderColor = '#2c3e50';
            }
        });
    });
    
    // Add interactive behavior to concept web nodes
    document.querySelectorAll('.central-node, .connected-node').forEach(node => {
        node.addEventListener('click', function() {
            this.classList.toggle('highlight');
            if (this.classList.contains('highlight')) {
                this.style.backgroundColor = '#e3f2fd';
                this.style.borderColor = '#1976d2';
                this.style.fontWeight = 'bold';
            } else {
                this.style.backgroundColor = 'white';
                this.style.borderColor = '';
                this.style.fontWeight = '';
            }
        });
    });
    
    // Add interactive behavior to timeline items
    document.querySelectorAll('.timeline-content').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('highlight');
            if (this.classList.contains('highlight')) {
                this.style.backgroundColor = '#f5f5f5';
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            } else {
                this.style.backgroundColor = 'white';
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 1px 5px rgba(0,0,0,0.15)';
            }
        });
    });
    
    // Process map interactions
    document.querySelectorAll('.process-step, .process-branch').forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f1f8e9';
            this.style.transition = 'background-color 0.3s';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}
