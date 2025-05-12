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
        },
        themeVariables: {
            primaryColor: '#E6F0ED', // Lighter NEW_MINT (matches case boxes)
            primaryTextColor: '#222222',
            primaryBorderColor: '#247BA0', // NEW_BLUE
            lineColor: '#1A5A7D', // Darker NEW_BLUE
            secondaryColor: '#FAFFEE', // Paler Yellow (page background)
            tertiaryColor: '#FFD9E2', // Lighter NEW_PINK

            // Specific for node types if needed, otherwise they use above
            mainBkg: '#70C1B3', // NEW_TEAL
            secondBkg: '#FF1654', // NEW_PINK
            textBkg: '#FFFFFF', // Default for text nodes if not overridden

            nodeBorder: '#247BA0', // NEW_BLUE
            clusterBkg: '#F3FFBD', // Original NEW_YELLOW for clusters
            
            defaultLinkColor: '#1A5A7D', // Darker NEW_BLUE
            titleColor: '#1A5A7D', // Darker NEW_BLUE
            edgeLabelBackground: '#FFFFFF',

            // Actor styles (for sequence diagrams etc.)
            actorBkg: '#247BA0', // NEW_BLUE
            actorTextColor: '#FFFFFF',
            actorBorder: '#1A5A7D', // Darker NEW_BLUE
            actorLineColor: '#1A5A7D',

            // Class diagrams
            classText: '#222222',
            
            // Gitgraph
            git0: '#70C1B3', // NEW_TEAL
            git1: '#247BA0', // NEW_BLUE
            git2: '#FF1654', // NEW_PINK
            git3: '#B2DBBF', // NEW_MINT
            git4: '#F3FFBD', // NEW_YELLOW
            gitBranchLabel0: '#FFFFFF',
            gitBranchLabel1: '#FFFFFF',
            gitBranchLabel2: '#FFFFFF',

            // Gantt
            sectionTitleColor: '#FFFFFF', // Assuming dark section backgrounds
            
            // Common
            labelBackground: '#FFFFFF', // Keep labels on white or very pale for clarity
            labelTextColor: '#222222',
            textColor: '#222222', // General text color within diagrams
            errorBkgColor: '#FFD9E2', // Lighter NEW_PINK for errors
            errorTextColor: '#FF1654' // NEW_PINK for error text
        }
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
