// AdminLawGuide/js/uiEnhancements.js

/**
 * Applies various visual enhancements to the page elements.
 * - Adds icons to headings (h2, h3, h4) based on their text content.
 * - Adds hover effects to elements like .case-box, .doctrine-box, etc.
 * - Enhances visibility of Mermaid diagrams.
 */
function applyVisualEnhancements() {
    // Add icons to headings based on their content
    document.querySelectorAll('h2, h3, h4').forEach(heading => {
        // Prevent re-applying if already processed by a class or attribute
        if (heading.dataset.uiEnhanced) return;
        heading.dataset.uiEnhanced = 'true';

        const headingText = heading.textContent.toLowerCase();
        
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
    
    // Add visual hover effects to specified boxes
    const enhanceableBoxSelectors = [
        '.case-box', 
        '.doctrine-box', 
        '.legislative-box', 
        '.executive-box', 
        '.judicial-box'
        // Add other selectors if needed
    ];

    document.querySelectorAll(enhanceableBoxSelectors.join(', ')).forEach(box => {
        if (box.dataset.uiEnhancedHover) return;
        box.dataset.uiEnhancedHover = 'true';

        box.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)'; // Standardized hover effect
            this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
            this.style.transition = 'transform 0.3s, box-shadow 0.3s';
        });
        
        box.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            // Reset to original box-shadow or a default one if defined in CSS
            // For now, using a common light shadow. Specific original shadows might need CSS classes.
            this.style.boxShadow = this.dataset.originalBoxShadow || '0 3px 6px rgba(0,0,0,0.08)'; 
        });
        // Store original box shadow if needed for perfect reset, though CSS transitions usually handle this.
        // box.dataset.originalBoxShadow = getComputedStyle(box).boxShadow;
    });
    
    // Enhance mermaid diagrams with better visibility (already in main.js, but can be centralized here too)
    // This might be redundant if mermaidHandler.js or CSS handles this.
    // For now, keeping it as it was in main.js's applyVisualEnhancements.
    document.querySelectorAll('.mermaid').forEach(diagram => {
        if (diagram.dataset.uiEnhancedMermaid) return;
        diagram.dataset.uiEnhancedMermaid = 'true';

        diagram.style.backgroundColor = '#fcfcff';
        diagram.style.padding = '15px';
        diagram.style.borderRadius = '8px';
    });
}

// Call on DOMContentLoaded if this script is loaded independently and needs to run.
// However, main.js will call this function.
// document.addEventListener('DOMContentLoaded', applyVisualEnhancements);
