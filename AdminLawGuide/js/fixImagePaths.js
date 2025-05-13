// Execute immediately, don't wait for DOMContentLoaded
(function() {
    // Try to fix images as soon as they're created
    const fixImageObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'IMG') {
                        fixImagePath(node);
                    } else if (node.querySelectorAll) {
                        const images = node.querySelectorAll('img');
                        images.forEach(fixImagePath);
                    }
                });
            }
        });
    });

    // Start observing for dynamically added images
    document.addEventListener('DOMContentLoaded', function() {
        fixImageObserver.observe(document.body, { 
            childList: true,
            subtree: true
        });
        
        // Also fix all images that already exist
        fixAllImages();
    });
    
    // Initial fix attempt (for statically loaded images)
    window.addEventListener('load', fixAllImages);
    
    // Try to fix images every second for the first 5 seconds (belt and suspenders approach)
    let attempts = 0;
    const intervalId = setInterval(function() {
        fixAllImages();
        attempts++;
        if (attempts >= 5) {
            clearInterval(intervalId);
        }
    }, 1000);
    
    function fixImagePath(img) {
        const src = img.getAttribute('src');
        
        // Check if the path is relative and starts with ../assets
        if (src && src.startsWith('../assets')) {
            // Replace with absolute path for GitHub Pages
            const newSrc = src.replace('../assets', '/AdminLawGuide/assets');
            img.setAttribute('src', newSrc);
        }
    }
    
    function fixAllImages() {
        const images = document.querySelectorAll('img');
        images.forEach(fixImagePath);
        
        // Also attempt to fix background images in inline styles
        const elementsWithBgImage = document.querySelectorAll('[style*="background-image"]');
        elementsWithBgImage.forEach(function(el) {
            const style = el.getAttribute('style');
            if (style && style.includes('../assets')) {
                const newStyle = style.replace(/\.\.\/assets/g, '/AdminLawGuide/assets');
                el.setAttribute('style', newStyle);
            }
        });
    }
})();
