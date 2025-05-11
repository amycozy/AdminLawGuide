// AdminLawGuide/js/components/toggleContent.js

/**
 * Initializes toggle buttons that show/hide target content.
 * Buttons should have a 'data-target' attribute with the ID of the element to toggle.
 * The button's text will be updated to "Hide Analysis" or "Show Analysis".
 * @param {string} buttonSelector - CSS selector for the toggle buttons (e.g., '.toggle-answer').
 */
function initializeToggleButtons(buttonSelector) {
    const buttons = document.querySelectorAll(buttonSelector);
    buttons.forEach(button => {
        // Check if this button has already been initialized to prevent duplicate listeners
        if (button.dataset.toggleInitialized) {
            return;
        }
        button.dataset.toggleInitialized = 'true'; // Mark as initialized

        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            if (!targetId) {
                console.error('Toggle button is missing data-target attribute:', this);
                return;
            }
            const targetElement = document.getElementById(targetId);

            if (!targetElement) {
                console.error(`Target element with ID '${targetId}' not found for toggle button:`, this);
                return;
            }

            if (targetElement.style.display === 'none' || !targetElement.style.display) {
                targetElement.style.display = 'block';
                // Standardize button text or allow customization via data attributes
                this.textContent = this.dataset.textHide || 'Hide Analysis';
            } else {
                targetElement.style.display = 'none';
                this.textContent = this.dataset.textShow || 'Show Analysis';
            }
        });

        // Initialize button text based on initial state of target
        const targetId = button.getAttribute('data-target');
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                if (targetElement.style.display === 'none' || !targetElement.style.display) {
                    button.textContent = button.dataset.textShow || 'Show Analysis';
                } else {
                    button.textContent = button.dataset.textHide || 'Hide Analysis';
                }
            }
        }
    });
}

// Example of how it might be explicitly exported if using modules,
// but for now, it's a global function.
// export { initializeToggleButtons };
