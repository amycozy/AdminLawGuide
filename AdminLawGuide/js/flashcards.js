// flashcards.js - Simplified flashcard functionality for Admin Law Guide

// Global or accessible function to initialize flashcards
// This will be called by main.js after the relevant section is loaded.
function initializeFlashcardsGlobal() {
    console.log("initializeFlashcardsGlobal called");
    const container = document.getElementById('flashcard-container');
    if (container) {
        console.log("Flashcard container found, initializing flashcards system...");
        if (typeof allFlashcards !== 'undefined' && allFlashcards.length > 0) {
            // Initialize or re-initialize masteredCards here as it's outside the DOMContentLoaded now
            masteredCards = localStorage.getItem('masteredCards') ? 
                JSON.parse(localStorage.getItem('masteredCards')) : [];
            
            updateProgressIndicator(); // Ensure progress is updated on init
            setupCategoryTabs();     // Sets up category filtering
            loadInitialCards();      // Loads the first few cards
            setupFlashcardControls(); // Sets up shuffle/show different buttons
            
            // Note: setupExamGuideInteractions() is removed from here. 
            // General tab/toggle setups should be handled by main.js or uiEnhancements.js
        } else {
            console.error("allFlashcards data not found or empty. Ensure js/data/flashcardData.js is loaded correctly before flashcards.js.");
        }
    } else {
        console.log("No flashcard container found when initializeFlashcardsGlobal was called.");
    }
}

// Track mastered cards - this needs to be accessible by functions below
let masteredCards = []; 

// Function to create and return a flashcard element
    function createFlashcardElement(cardData) {
        const flashcardElement = document.createElement('div');
        // Use shadcn-flashcard class for consistency with shadcn-components.css
        flashcardElement.className = 'shadcn-flashcard'; 
        flashcardElement.setAttribute('data-category', cardData.category);
        flashcardElement.setAttribute('data-id', cardData.id);
        
        // Add mastered class if in localStorage
        if (masteredCards.includes(cardData.id)) {
            // Use the shadcn specific mastered class if defined, or a generic one
            flashcardElement.classList.add('shadcn-flashcard-mastered'); 
        }
        
        // Create the HTML structure using shadcn classes where appropriate
        flashcardElement.innerHTML = `
            <div class="shadcn-flashcard-inner">
                <div class="shadcn-flashcard-front">
                    <span class="shadcn-badge shadcn-flashcard-badge">${formatCategoryName(cardData.category)}</span>
                    <h4 class="shadcn-flashcard-title">${cardData.title}</h4>
                    <p class="shadcn-flashcard-content">${cardData.question}</p>
                    
                </div>
                <div class="shadcn-flashcard-back">
                    
                    <h4 class="shadcn-flashcard-title">${cardData.title}</h4>
                    <div class="shadcn-flashcard-content">
                        ${cardData.answer}
                    </div>
                    <button class="shadcn-button shadcn-button-outline shadcn-button-sm mark-known-btn ${masteredCards.includes(cardData.id) ? 'known' : ''}" data-id="${cardData.id}" style="margin-top: 1rem;">
                        ${masteredCards.includes(cardData.id) ? 'Marked as Known' : 'Mark as Known'}
                    </button>
                </div>
            </div>
        `;
        
        // Add click event to flip the card
        flashcardElement.addEventListener('click', function(e) {
            // Don't flip if clicking on the Mark as Known button
            if (e.target.classList.contains('mark-known-btn')) return;
            
            this.querySelector('.shadcn-flashcard-inner').classList.toggle('flipped');
        });
        
        // Add event for the Mark as Known button
        const markKnownBtn = flashcardElement.querySelector('.mark-known-btn');
        markKnownBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card flip
            const cardId = this.getAttribute('data-id');
            
            if (!masteredCards.includes(cardId)) {
                // Mark as known
                masteredCards.push(cardId);
                localStorage.setItem('masteredCards', JSON.stringify(masteredCards));
                
                // Update button and card
                this.textContent = 'Marked as Known';
                this.classList.remove('shadcn-button-outline');
                this.classList.add('shadcn-button-success'); // Use existing success style
                flashcardElement.classList.add('shadcn-flashcard-mastered');
            } else {
                // Remove from known
                masteredCards = masteredCards.filter(id => id !== cardId);
                localStorage.setItem('masteredCards', JSON.stringify(masteredCards));
                
                // Update button and card
                this.textContent = 'Mark as Known';
                this.classList.remove('shadcn-button-success');
                this.classList.add('shadcn-button-outline');
                flashcardElement.classList.remove('shadcn-flashcard-mastered');
            }
            
            updateProgressIndicator();
        });
        
        return flashcardElement;
    }

    // Function to format category name for display
    function formatCategoryName(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Function to update the progress indicator
    function updateProgressIndicator() {
        const totalCards = allFlashcards.length;
        const masteredCount = masteredCards.length;
        const progressPercentage = (masteredCount / totalCards) * 100;
        
        // Update the progress bar
        const progressBar = document.querySelector('.shadcn-progress-indicator');
        if (progressBar) {
            progressBar.style.width = `${progressPercentage}%`;
        }
        
        // Update the progress text
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${masteredCount} of ${totalCards} cards mastered (${Math.round(progressPercentage)}%)`;
        }
    }

    // Function to set up the category tabs
    function setupCategoryTabs() {
        if (typeof initializeTabSystem === 'function') {
            // Assumes .category-tab buttons have 'data-tab-target' (can point to #flashcard-container)
            // and 'data-category' for filtering.
            // The contentPanelSelector points to the container whose content *visibility* isn't changed by tabs,
            // but the callback handles the filtering.
            // HTML for .category-tab should include data-tab-target="#flashcard-container" or similar if needed by initializeTabSystem.
            // Or, we can make initializeTabSystem more flexible if content panels aren't always swapped.
            // For now, the callback is the primary mechanism for category filtering.
            initializeTabSystem(
                '.category-tab', 
                '#flashcard-container', // Content panels are not swapped, but a selector is needed.
                '.category-tab.active', 
                (activeTab) => {
                    const category = activeTab.getAttribute('data-category');
                    if (category) {
                        filterCardsByCategory(category);
                    }
                }
            );
        } else {
            console.error('initializeTabSystem function not found in flashcards.js for category tabs. Ensure js/components/tabs.js is loaded.');
        }
    }

    // Function to filter cards by category
    function filterCardsByCategory(category) {
        const cards = document.querySelectorAll('#flashcard-container .flashcard');
        let visibleCount = 0;
        
        cards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update the counter
        const counter = document.querySelector('.shadcn-flashcard-meta');
        if (counter) {
            counter.textContent = `Showing ${visibleCount} of ${allFlashcards.length} total flashcards`;
        }
    }

    // Function to load initial cards
    function loadInitialCards() {
        const container = document.getElementById('flashcard-container');
        if (!container) {
            console.error("Flashcard container not found!");
            return;
        }
        
        console.log("Loading initial flashcards...");
        
        // Clear the container
        container.innerHTML = '';
        
        // Add the first 3 cards as a starting point
        for (let i = 0; i < 3 && i < allFlashcards.length; i++) {
            console.log("Creating flashcard:", allFlashcards[i].title);
            const cardElement = createFlashcardElement(allFlashcards[i]);
            container.appendChild(cardElement);
        }
        
        // Update the counter
        const counter = document.querySelector('.shadcn-flashcard-meta');
        if (counter) {
            counter.textContent = `Showing 3 of ${allFlashcards.length} total flashcards`;
        }
    }

    // Function to set up the flashcard controls
    function setupFlashcardControls() {
        // Set up the shuffle button
        const shuffleBtn = document.getElementById('shuffle-cards');
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', shuffleCards);
        }
        
        // Set up the show different cards button
        const showDifferentBtn = document.getElementById('show-different-cards');
        if (showDifferentBtn) {
            showDifferentBtn.addEventListener('click', showDifferentCards);
        }
    }

    // Function to shuffle the currently displayed cards
    function shuffleCards() {
        const container = document.getElementById('flashcard-container');
        if (!container) return;
        
        const cards = Array.from(container.children);
        
        // Reset any flipped cards
        cards.forEach(card => {
            card.querySelector('.flashcard-inner').classList.remove('flipped');
        });
        
        // Shuffle the cards using Fisher-Yates algorithm
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            container.appendChild(cards[i]); // Changing DOM order shuffles the cards visually
        }
    }

    // Function to show different cards
    function showDifferentCards() {
        const container = document.getElementById('flashcard-container');
        if (!container) return;
        
        // Get current card IDs
        const currentCardIds = Array.from(container.querySelectorAll('.flashcard'))
            .map(card => card.getAttribute('data-id'));
        
        // Get cards not currently shown
        const availableCards = allFlashcards.filter(card => !currentCardIds.includes(card.id));
        
        // If all cards have been shown, just reshuffle all cards
        const cardsToShow = availableCards.length > 0 ? availableCards : allFlashcards;
        
        // Get 3 random cards from available cards
        const shuffledCards = [...cardsToShow].sort(() => 0.5 - Math.random()).slice(0, 3);
        
        // Clear the container
        container.innerHTML = '';
        
        // Add the new cards
        shuffledCards.forEach(card => {
            const cardElement = createFlashcardElement(card);
            container.appendChild(cardElement);
        });
        
        // Update the counter
        const counter = document.querySelector('.shadcn-flashcard-meta');
        if (counter) {
            counter.textContent = `Showing 3 of ${allFlashcards.length} total flashcards`;
        }
        
        // Update active category filter
        const activeTab = document.querySelector('.category-tab.active');
        if (activeTab) {
            const category = activeTab.getAttribute('data-category');
            if (category !== 'all') {
                filterCardsByCategory(category);
            }
        }
    }

    // Function to initialize the flashcard system (internal parts, called by initializeFlashcardsGlobal)
    // setupExamGuideInteractions was removed as its functionality should be handled by main.js or uiEnhancements.js
    // for general site structure tabs and toggles.
    // flashcards.js will now only focus on its own category tabs.

// Note: The original DOMContentLoaded listener and setTimeout are removed.
// initializeFlashcardsGlobal() should be called from main.js when the flashcard section is loaded.
