// AdminLawGuide/js/components/tabs.js

/**
 * Initializes a tab system.
 *
 * Assumes HTML structure where:
 * - Tab buttons have a common selector (e.g., '.tab-button').
 * - Each tab button has a 'data-tab-target' attribute whose value is the ID of the content panel to show.
 * - All content panels are siblings or grouped and can be selected (e.g., '.tab-content-panel').
 * - Active states are managed by adding/removing an 'active' class.
 *
 * @param {string} tabButtonSelector - CSS selector for the individual tab buttons.
 * @param {string} tabContentPanelSelector - CSS selector for all tab content panels.
 * @param {string} initialActiveTabSelector - (Optional) CSS selector for the tab that should be active by default.
 *                                            If not provided, the first tab button found will be made active.
 * @param {function} onTabChangeCallback - (Optional) A callback function that is executed after a tab change.
 *                                         It receives the activated tab button and content panel as arguments.
 */
function initializeTabSystem(tabButtonSelector, tabContentPanelSelector, initialActiveTabSelector = null, onTabChangeCallback = null) {
    const tabButtons = document.querySelectorAll(tabButtonSelector);
    const contentPanels = document.querySelectorAll(tabContentPanelSelector);

    if (tabButtons.length === 0) {
        // console.warn(`No tab buttons found for selector: ${tabButtonSelector}`);
        return;
    }

    // Function to activate a tab
    function activateTab(activeButton) {
        const targetId = activeButton.getAttribute('data-tab-target');
        if (!targetId) {
            console.error('Tab button is missing data-tab-target attribute:', activeButton);
            return;
        }

        const activeContentPanel = document.getElementById(targetId);
        if (!activeContentPanel) {
            console.error(`Target content panel with ID '${targetId}' not found for tab:`, activeButton);
            return;
        }

        // Deactivate all tabs and hide all content panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        contentPanels.forEach(panel => {
            panel.classList.remove('active');
            panel.style.display = 'none'; // Ensure consistent hiding
        });

        // Activate the clicked tab and show its content panel
        activeButton.classList.add('active');
        activeContentPanel.classList.add('active');
        activeContentPanel.style.display = 'block'; // Ensure consistent showing

        if (typeof onTabChangeCallback === 'function') {
            onTabChangeCallback(activeButton, activeContentPanel);
        }
    }

    // Add click event listeners to tab buttons
    tabButtons.forEach(button => {
        // Prevent re-initialization
        if (button.dataset.tabInitialized) {
            return;
        }
        button.dataset.tabInitialized = 'true';

        button.addEventListener('click', function(event) {
            event.preventDefault();
            activateTab(this);
        });
    });

    // Activate initial tab
    let initialTab = null;
    if (initialActiveTabSelector) {
        initialTab = document.querySelector(initialActiveTabSelector);
    }
    if (initialTab && Array.from(tabButtons).includes(initialTab)) {
        activateTab(initialTab);
    } else if (tabButtons.length > 0) {
        // Fallback to the first tab if initialActiveTabSelector is invalid or not provided
        activateTab(tabButtons[0]);
    }
}

// Example usage (would be called from main.js or other specific scripts):
// document.addEventListener('DOMContentLoaded', () => {
//     // For mastery tabs
//     initializeTabSystem('.mastery-tab', '.mastery-section', '.mastery-tab.active');
//
//     // For flashcard category tabs (might need a callback for filtering)
//     initializeTabSystem('.category-tab', '.flashcard-category-content', '.category-tab.active', (activeTab, activePanel) => {
//         const category = activeTab.getAttribute('data-category');
//         if (window.filterCardsByCategory) { // Assuming filterCardsByCategory is global
//             window.filterCardsByCategory(category);
//         }
//     });
// });
