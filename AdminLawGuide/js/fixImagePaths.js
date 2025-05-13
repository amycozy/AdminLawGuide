// Execute immediately, don't wait for DOMContentLoaded
(function() {
    // Get the baseUrl from a meta tag (fallback to hardcoded value if not found)
    function getBaseUrl() {
        // Try to get from Jekyll template first
        const jekyllBaseUrl = document.querySelector('meta[name="jekyll-baseurl"]');
        if (jekyllBaseUrl && jekyllBaseUrl.getAttribute('content')) {
            return jekyllBaseUrl.getAttribute('content');
        }
        // Fallback to hardcoded path that matches GitHub Pages repository name
        return '/AdminLawProject';
    }
    
    const baseUrl = getBaseUrl();
    
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
        
        // Skip if it's already an absolute URL or contains site.baseurl
        if (!src || src.startsWith('http') || src.startsWith('/') || 
            src.includes('site.baseurl') || src.includes('{{')) {
            return;
        }
        
        // Handle the case where src starts with ../assets
        if (src.startsWith('../assets')) {
            // For GitHub Pages with Jekyll, we need the full path
            const newSrc = baseUrl + '/AdminLawGuide/assets' + src.substring(9);
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
                const newStyle = style.replace(/\.\.\/assets/g, baseUrl + '/AdminLawGuide/assets');
                el.setAttribute('style', newStyle);
            }
        });
    }
})();
