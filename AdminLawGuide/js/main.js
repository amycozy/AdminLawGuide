// Main functionality for Administrative Law Guide

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Mermaid for flowcharts
    initializeMermaid();
    
    // Set up navigation functionality
    setupNavigation();
    
    // Set up control buttons
    setupControlButtons();
    
    // Apply visual enhancements
    applyVisualEnhancements();
    
    // Set up interactive elements
    setupInteractiveElements();
    
    // Set up visual knowledge maps interactions
    setupVisualKnowledgeMaps();
});

// Initialize Mermaid diagrams
function initializeMermaid() {
    mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        fontFamily: 'Georgia, Times New Roman, serif',
        fontSize: 14,
        flowchart: {
            htmlLabels: true,
            useMaxWidth: true,
            curve: 'basis'
        }
    });
    
    // Make sure diagrams are rendered after a short delay to ensure DOM is ready
    setTimeout(function() {
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
    }, 1000);
}

// Set up navigation and content loading
function setupNavigation() {
    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) return;
    
    // Get all navigation links with data-section attribute
    const navLinks = document.querySelectorAll('a[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the section to load
            const sectionName = this.getAttribute('data-section');
            loadSection(sectionName);
            
            // Update URL hash
            window.location.hash = this.getAttribute('href');
            
            // Highlight active link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Load section from hash or default to overview
    function loadInitialSection() {
        let sectionToLoad = 'overview'; // Default section
        
        // Check if URL has a hash
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            const hashSection = document.querySelector(`a[href="#${hash}"]`);
            
            if (hashSection && hashSection.getAttribute('data-section')) {
                sectionToLoad = hashSection.getAttribute('data-section');
                
                // Highlight the active link
                navLinks.forEach(l => l.classList.remove('active'));
                hashSection.classList.add('active');
            }
        } else {
            // Highlight the overview link by default
            const overviewLink = document.querySelector('a[data-section="overview"]');
            if (overviewLink) {
                overviewLink.classList.add('active');
            }
        }
        
        loadSection(sectionToLoad);
    }
    
    // Function to load a section content
    function loadSection(sectionName) {
        contentContainer.innerHTML = '<div class="loading">Loading content...</div>';
        
        fetch(`sections/${sectionName}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Section not found');
                }
                return response.text();
            })
            .then(html => {
                contentContainer.innerHTML = html;
                
                // Initialize mermaid diagrams in the new content
                mermaid.init(undefined, document.querySelectorAll('.mermaid'));
                
                // Set up visual knowledge maps if this is the visual-knowledge-maps section
                if (sectionName === 'visual-knowledge-maps') {
                    setupVisualKnowledgeMaps();
                }
                
                // Initialize toggle answer buttons
                setupInteractiveElements();
                
                // Scroll to top
                window.scrollTo(0, 0);
            })
            .catch(error => {
                console.error('Error loading section:', error);
                contentContainer.innerHTML = `
                    <div class="warning">
                        <h3>Error Loading Content</h3>
                        <p>Sorry, we couldn't load the ${sectionName} section. Please try again later.</p>
                    </div>
                `;
            });
    }
    
    // Load the initial section when page loads
    loadInitialSection();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', function() {
        loadInitialSection();
    });
}

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

// Apply visual enhancements to headings and elements
function applyVisualEnhancements() {
    // Add icons to headings based on their content
    document.querySelectorAll('h2, h3, h4').forEach(heading => {
        const headingText = heading.textContent.toLowerCase();
        
        // Add appropriate classes based on heading content
        if (headingText.includes('legislat') || headingText.includes('congress') || headingText.includes('statute')) {
            heading.classList.add('icon-legislative');
        } else if (headingText.includes('executive') || headingText.includes('president') || headingText.includes('agency')) {
            heading.classList.add('icon-executive');
        } else if (headingText.includes('judici') || headingText.includes('court') || headingText.includes('review')) {
            heading.classList.add('icon-judicial');
        } else if (headingText.includes('procedure') || headingText.includes('process')) {
            heading.classList.add('icon-procedural');
        } else if (headingText.includes('constitution')) {
            heading.classList.add('icon-constitutional');
        }
    });
    
    // Add visual hover effects to case boxes
    document.querySelectorAll('.case-box').forEach(box => {
        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            this.style.transition = 'transform 0.3s, box-shadow 0.3s';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 3px 6px rgba(0,0,0,0.1)';
        });
    });
    
    // Enhance mermaid diagrams with better visibility
    document.querySelectorAll('.mermaid').forEach(diagram => {
        diagram.style.backgroundColor = '#fcfcff';
        diagram.style.padding = '15px';
        diagram.style.borderRadius = '8px';
    });
}

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

    // Set up flashcard functionality
    document.querySelectorAll('.flashcard').forEach(card => {
        card.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    });
    
    // Set up mastery center tabs
    document.querySelectorAll('.mastery-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.mastery-tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.mastery-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the corresponding section - modified to work with mastery-* IDs
            const tabId = this.getAttribute('data-tab');
            if (tabId.startsWith('tab-')) {
                // For tab-based navigation, allow both old and new ID formats
                const newId = 'mastery-' + tabId.substring(4); // convert tab-flashcards to mastery-flashcards
                const section = document.getElementById(tabId) || document.getElementById(newId);
                if (section) {
                    section.classList.add('active');
                }
            } else {
                // For other tabs
                document.getElementById(tabId).classList.add('active');
            }
        });
    });
    
    // Set up toggle answer buttons
    document.querySelectorAll('.toggle-answer').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement.style.display === 'none' || !targetElement.style.display) {
                targetElement.style.display = 'block';
                this.textContent = 'Hide Analysis';
            } else {
                targetElement.style.display = 'none';
                this.textContent = 'Show Analysis';
            }
        });
    });
    
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
    const enhanceableContainers = document.querySelectorAll('.doctrine-box, .legislative-box, .executive-box, .judicial-box, .case-box');
    enhanceableContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
            this.style.transition = 'transform 0.3s, box-shadow 0.3s';
        });
        
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.05)';
        });
    });
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
