// AdminLawGuide/js/mermaidHandler.js

/**
 * Initializes Mermaid diagrams on the page.
 * It sets default configurations and then renders any elements with the class '.mermaid'.
 * It also includes a timeout to ensure rendering happens after the DOM is fully ready,
 * especially for dynamically loaded content.
 */
function initializeMermaid() {
    if (typeof mermaid === 'undefined') {
        console.error('Mermaid library not loaded. Cannot initialize diagrams.');
        return;
    }

    mermaid.initialize({
        startOnLoad: true, // Although we call init manually, this can be a fallback
        theme: 'default',
        fontFamily: 'Georgia, Times New Roman, serif',
        fontSize: 14,
        flowchart: {
            htmlLabels: true,
            useMaxWidth: true,
            curve: 'basis'
        }
        // Potentially add other theme variables or configurations here
        // themeVariables: {
        //     primaryColor: '#ECECFF', // example
        //     primaryTextColor: '#000', // example
        // }
    });
    
    // Ensure diagrams are rendered after a short delay,
    // especially useful if content is loaded dynamically.
    // The main script (main.js) also calls mermaid.init after loading new sections.
    // This initial call handles diagrams present on initial page load.
    setTimeout(function() {
        try {
            mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        } catch (e) {
            console.error("Error initializing Mermaid:", e);
        }
    }, 100); // Reduced timeout as main.js also has a longer one for dynamic loads.
}

// Call initialization on script load if mermaid is already available.
// Otherwise, main.js will call it on DOMContentLoaded.
if (typeof mermaid !== 'undefined') {
    // initializeMermaid(); // Decided to let main.js control the timing via DOMContentLoaded
}
