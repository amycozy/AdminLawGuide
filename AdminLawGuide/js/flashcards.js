// flashcards.js - Simplified flashcard functionality for Admin Law Guide

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM content loaded - flashcards initializing");
    
    // Check if we're on a page with flashcards
    // Wait a short time for main.js to load the content
    setTimeout(function() {
        // Only initialize if we can find the container
        const container = document.getElementById('flashcard-container');
        if (container) {
            console.log("Flashcard container found, initializing...");
            // Ensure allFlashcards is available (loaded from js/data/flashcardData.js)
            if (typeof allFlashcards !== 'undefined' && allFlashcards.length > 0) {
                initializeFlashcards();
            } else {
                console.error("allFlashcards data not found or empty. Ensure js/data/flashcardData.js is loaded correctly before flashcards.js.");
            }
        } else {
            console.log("No flashcard container found on this page");
        }
    }, 500);

    // Track mastered cards
    // Note: allFlashcards array is now defined in js/data/flashcardData.js
    // and should be loaded before this script.
    let masteredCards = localStorage.getItem('masteredCards') ? 
        JSON.parse(localStorage.getItem('masteredCards')) : [];

    // Function to create and return a flashcard element
    function createFlashcardElement(cardData) {
        const flashcardElement = document.createElement('div');
        flashcardElement.className = 'flashcard';
        flashcardElement.setAttribute('data-category', cardData.category);
        flashcardElement.setAttribute('data-id', cardData.id);
        
        // Add mastered class if in localStorage
        if (masteredCards.includes(cardData.id)) {
            flashcardElement.classList.add('mastered');
        }
        
        // Create the HTML structure
        flashcardElement.innerHTML = `
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <div class="category-badge ${cardData.category}">${formatCategoryName(cardData.category)}</div>
                    <h4>${cardData.title}</h4>
                    <p>${cardData.question}</p>
                    <div class="flip-hint">Click to flip</div>
                </div>
                <div class="flashcard-back">
                    <div class="flip-back-container">
                        <button class="flip-back-btn" aria-label="Flip card back">↺</button>
                    </div>
                    <h4>${cardData.title}</h4>
                    <div class="answer">
                        ${cardData.answer}
                    </div>
                    <button class="mark-known-btn ${masteredCards.includes(cardData.id) ? 'known' : ''}" data-id="${cardData.id}">
                        ${masteredCards.includes(cardData.id) ? 'Marked as Known' : 'Mark as Known'}
                    </button>
                </div>
            </div>
        `;
        
        // Add click event to flip the card
        flashcardElement.addEventListener('click', function(e) {
            // Don't flip if clicking on the Mark as Known button or flip back button
            if (e.target.classList.contains('mark-known-btn') || 
                e.target.classList.contains('flip-back-btn')) return;
            
            this.querySelector('.flashcard-inner').classList.toggle('flipped');
        });
        
        // Add specific click event for the flip back button
        const flipBackBtn = flashcardElement.querySelector('.flip-back-btn');
        if (flipBackBtn) {
            flipBackBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent card flip from main event
                flashcardElement.querySelector('.flashcard-inner').classList.remove('flipped');
            });
        }
        
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
                this.classList.add('known');
                flashcardElement.classList.add('mastered');
            } else {
                // Remove from known
                masteredCards = masteredCards.filter(id => id !== cardId);
                localStorage.setItem('masteredCards', JSON.stringify(masteredCards));
                
                // Update button and card
                this.textContent = 'Mark as Known';
                this.classList.remove('known');
                flashcardElement.classList.remove('mastered');
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
        const progressBar = document.querySelector('.progress-bar');
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
        const counter = document.querySelector('.flashcard-counter');
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
        const counter = document.querySelector('.flashcard-counter');
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
        const counter = document.querySelector('.flashcard-counter');
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

    // Function to initialize the flashcard system
    function initializeFlashcards() {
        updateProgressIndicator();
        setupCategoryTabs();
        loadInitialCards();
        setupFlashcardControls();
        
        // Set up exam guide tabs and sections if they exist
        setupExamGuideInteractions();
    }
    
    // Function to handle exam guide specific interactions
    function setupExamGuideInteractions() {
        // Set up exam guide navigation (if these act as tabs)
        // Assumes .exam-guide-nav-link elements have 'data-tab-target' pointing to IDs of .exam-guide-section elements.
        if (typeof initializeTabSystem === 'function') {
            initializeTabSystem(
                '.exam-guide-nav-link',    // Selector for tab buttons
                '.exam-guide-section',     // Selector for content panels
                '.exam-guide-nav-link.active' // Selector for the initially active tab (optional)
            );
        } else {
            console.error('initializeTabSystem function not found in flashcards.js for exam guide nav. Ensure js/components/tabs.js is loaded.');
        }
        
        // Set up mastery tabs (if any are specifically within an exam guide context and controlled by flashcards.js)
        // Assumes these .mastery-tab instances have 'data-tab-target' pointing to IDs of .mastery-section elements.
        // These selectors might need to be more specific if they are nested, e.g., '.exam-guide-content .mastery-tab'
        if (typeof initializeTabSystem === 'function') {
            initializeTabSystem(
                '.mastery-tab',  // This might be too generic if main.js also handles .mastery-tab globally.
                                 // Consider a more specific selector if these are different from global mastery tabs,
                                 // e.g., '.exam-guide-mastery-tab' or ensure HTML uses data-tab-target correctly.
                '.mastery-section',
                '.mastery-tab.active'
            );
        } else {
            console.error('initializeTabSystem function not found in flashcards.js for mastery tabs. Ensure js/components/tabs.js is loaded.');
        }
        
        // Set up toggle answer buttons using the new component
        if (typeof initializeToggleButtons === 'function') {
            initializeToggleButtons('.toggle-answer');
        } else {
            console.error('initializeToggleButtons function not found in flashcards.js. Ensure js/components/toggleContent.js is loaded.');
        }
        
        // Set up quiz buttons
        const checkQuizBtn = document.getElementById('check-quiz');
        if (checkQuizBtn) {
            checkQuizBtn.addEventListener('click', function() {
                document.querySelectorAll('.quiz-feedback').forEach(feedback => {
                    feedback.style.display = 'block';
                });
            });
        }
    }
});
