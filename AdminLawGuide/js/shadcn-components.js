// shadcn-components.js - Support for shadcn-ui styled components
document.addEventListener('DOMContentLoaded', function() {
    // Handle flashcard flipping
    document.querySelectorAll('.shadcn-flashcard').forEach(card => {
        card.addEventListener('click', function() {
            this.querySelector('.shadcn-flashcard-inner').classList.toggle('flipped');
        });
    });

    // Track mastered cards
    let masteredCards = localStorage.getItem('masteredCards') ? 
        JSON.parse(localStorage.getItem('masteredCards')) : [];
    
    // Update progress indicator
    function updateProgressIndicator() {
        const totalCards = 25; // Total flashcards
        const masteredCount = masteredCards.length;
        const progressPercentage = (masteredCount / totalCards) * 100;
        
        // Update progress bar
        const progressIndicator = document.querySelector('.shadcn-progress-indicator');
        if (progressIndicator) {
            progressIndicator.style.width = `${progressPercentage}%`;
        }
        
        // Update progress text
        const progressText = document.querySelector('.shadcn-flashcard-progress-text');
        if (progressText) {
            progressText.textContent = `${masteredCount} of ${totalCards} cards mastered (${Math.round(progressPercentage)}%)`;
        }
    }
    
    // Initialize progress indicator
    updateProgressIndicator();
    
    // Handle "Mark as Known" buttons
    document.querySelectorAll('.mark-known-button').forEach(button => {
        const cardId = button.getAttribute('data-card-id');
        
        // Update button state based on localStorage
        if (masteredCards.includes(cardId)) {
            button.textContent = 'Marked as Known';
            button.classList.add('shadcn-button-success');
            button.classList.remove('shadcn-button-outline');
            
            // Add a visual indicator to the card
            const card = document.querySelector(`.shadcn-flashcard[data-card-id="${cardId}"]`);
            if (card) {
                card.classList.add('shadcn-flashcard-mastered');
            }
        }
        
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card flip when clicking the button
            
            if (!masteredCards.includes(cardId)) {
                // Mark as known
                masteredCards.push(cardId);
                localStorage.setItem('masteredCards', JSON.stringify(masteredCards));
                
                // Update button
                button.textContent = 'Marked as Known';
                button.classList.add('shadcn-button-success');
                button.classList.remove('shadcn-button-outline');
                
                // Update card styling
                const card = document.querySelector(`.shadcn-flashcard[data-card-id="${cardId}"]`);
                if (card) {
                    card.classList.add('shadcn-flashcard-mastered');
                }
            } else {
                // Remove from known
                masteredCards = masteredCards.filter(id => id !== cardId);
                localStorage.setItem('masteredCards', JSON.stringify(masteredCards));
                
                // Update button
                button.textContent = 'Mark as Known';
                button.classList.remove('shadcn-button-success');
                button.classList.add('shadcn-button-outline');
                
                // Update card styling
                const card = document.querySelector(`.shadcn-flashcard[data-card-id="${cardId}"]`);
                if (card) {
                    card.classList.remove('shadcn-flashcard-mastered');
                }
            }
            
            // Update progress
            updateProgressIndicator();
        });
    });
    
    // Handle tabs
    document.querySelectorAll('.shadcn-tabs-trigger').forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.shadcn-tabs-trigger').forEach(t => {
                t.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all content
            document.querySelectorAll('.shadcn-tabs-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // Show relevant content
            const contentId = this.getAttribute('data-content');
            const content = document.getElementById(contentId);
            if (content) {
                content.style.display = 'block';
            }
        });
    });
    
    // Handle shuffle button
    const shuffleButton = document.getElementById('shuffle-flashcards');
    if (shuffleButton) {
        shuffleButton.addEventListener('click', function() {
            const container = document.querySelector('.shadcn-flashcard-container');
            if (!container) return;
            
            const cards = Array.from(container.querySelectorAll('.shadcn-flashcard'));
            
            // Shuffle the cards using Fisher-Yates algorithm
            for (let i = cards.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                // Remove flip state before rearranging
                cards[i].querySelector('.shadcn-flashcard-inner').classList.remove('flipped');
                cards[j].querySelector('.shadcn-flashcard-inner').classList.remove('flipped');
                // Append to rearrange DOM order
                container.appendChild(cards[i]);
            }
        });
    }
    
    // Handle category filtering in the flashcards
    function filterCardsByCategory(category) {
        const allCards = document.querySelectorAll('.shadcn-flashcard');
        
        allCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Update counter
        const visibleCards = document.querySelectorAll('.shadcn-flashcard[style="display: block;"]');
        const counterText = document.querySelector('.shadcn-flashcard-meta');
        if (counterText) {
            counterText.textContent = `Showing ${visibleCards.length} of 25 total flashcards`;
        }
    }
    
    // Set up category filter tabs
    document.querySelectorAll('.shadcn-tabs-trigger').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const contentId = this.getAttribute('data-content');
            
            if (contentId === 'all-flashcards') {
                filterCardsByCategory('all');
            } else if (contentId === 'judicial-review-cards') {
                filterCardsByCategory('judicial-review');
            } else if (contentId === 'procedure-cards') {
                filterCardsByCategory('agency-procedure');
            } else if (contentId === 'constitutional-cards') {
                filterCardsByCategory('constitutional');
            }
        });
    });
    
    // Helper function to create dynamic flashcards
    function createFlashcard(cardData) {
        const card = document.createElement('div');
        card.className = 'shadcn-flashcard';
        card.setAttribute('data-category', cardData.category);
        card.setAttribute('data-card-id', cardData.id);
        
        // Check if this card is already mastered
        if (masteredCards.includes(cardData.id)) {
            card.classList.add('shadcn-flashcard-mastered');
        }
        
        card.innerHTML = `
            <div class="shadcn-flashcard-inner">
                <div class="shadcn-flashcard-front">
                    <span class="shadcn-badge shadcn-badge-secondary shadcn-flashcard-badge">${cardData.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <h4 class="shadcn-flashcard-title">${cardData.title}</h4>
                    <p class="shadcn-flashcard-content">${cardData.question}</p>
                </div>
                <div class="shadcn-flashcard-back">
                    <h4 class="shadcn-flashcard-title">${cardData.title}</h4>
                    <div class="shadcn-flashcard-content">
                        ${cardData.answer}
                    </div>
                    <button class="shadcn-button ${masteredCards.includes(cardData.id) ? 'shadcn-button-success' : 'shadcn-button-outline'} shadcn-button-sm mark-known-button" 
                            data-card-id="${cardData.id}" style="margin-top: 1rem;">
                        ${masteredCards.includes(cardData.id) ? 'Marked as Known' : 'Mark as Known'}
                    </button>
                </div>
            </div>
        `;
        
        // Add click handler for flipping
        card.addEventListener('click', function() {
            this.querySelector('.shadcn-flashcard-inner').classList.toggle('flipped');
        });
        
        // Add click handler for the "Mark as Known" button
        card.querySelector('.mark-known-button').addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card flip
            const cardId = this.getAttribute('data-card-id');
            
            if (!masteredCards.includes(cardId)) {
                // Mark as known
                masteredCards.push(cardId);
                localStorage.setItem('masteredCards', JSON.stringify(masteredCards));
                
                // Update button
                this.textContent = 'Marked as Known';
                this.classList.add('shadcn-button-success');
                this.classList.remove('shadcn-button-outline');
                
                // Update card styling
                card.classList.add('shadcn-flashcard-mastered');
            } else {
                // Remove from known
                masteredCards = masteredCards.filter(id => id !== cardId);
                localStorage.setItem('masteredCards', JSON.stringify(masteredCards));
                
                // Update button
                this.textContent = 'Mark as Known';
                this.classList.remove('shadcn-button-success');
                this.classList.add('shadcn-button-outline');
                
                // Update card styling
                card.classList.remove('shadcn-flashcard-mastered');
            }
            
            // Update progress
            updateProgressIndicator();
        });
        
        return card;
    }
    
    // Handle "Show Different Cards" button
    const showDifferentButton = document.getElementById('show-different-cards');
    if (showDifferentButton) {
        showDifferentButton.addEventListener('click', function() {
            const container = document.getElementById('flashcard-container');
            if (!container) return;
            
            // Get allFlashcards array from existing script
            if (typeof allFlashcards !== 'undefined' && Array.isArray(allFlashcards)) {
                // Clear container
                container.innerHTML = '';
                
                // Get three random cards (excluding the ones currently shown)
                const availableCards = allFlashcards.filter(card => 
                    !document.querySelector(`.shadcn-flashcard[data-card-id="${card.id}"]`)
                );
                
                if (availableCards.length === 0) {
                    // If we've gone through all cards, show random selection from all
                    const shuffled = [...allFlashcards].sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, 3);
                    
                    selected.forEach(cardData => {
                        const card = createFlashcard(cardData);
                        container.appendChild(card);
                    });
                } else {
                    // Show new cards
                    const shuffled = [...availableCards].sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, Math.min(3, shuffled.length));
                    
                    selected.forEach(cardData => {
                        const card = createFlashcard(cardData);
                        container.appendChild(card);
                    });
                }
                
                // Update counter
                const meta = document.querySelector('.shadcn-flashcard-meta');
                if (meta) {
                    meta.textContent = `Showing 3 of 25 total flashcards`;
                }
            }
        });
    }
});
