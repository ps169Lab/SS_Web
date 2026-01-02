// Reading Level Toggle JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Create the toggle button
    const toggle = document.createElement('button');
    toggle.className = 'reading-level-toggle';
    toggle.setAttribute('aria-label', 'Toggle reading level');
    toggle.setAttribute('title', 'Switch between Standard and Summary reading levels');
    
    // Check for saved preference or default to standard
    const savedLevel = localStorage.getItem('readingLevel') || 'standard';
    
    // Set initial state
    if (savedLevel === 'easy') {
        document.body.classList.add('easy-reading-mode');
        toggle.textContent = 'Summary';
    } else {
        toggle.textContent = 'Standard';
    }
    
    // Add click handler
    toggle.addEventListener('click', function() {
        document.body.classList.toggle('easy-reading-mode');
        
        if (document.body.classList.contains('easy-reading-mode')) {
            toggle.textContent = 'Summary';
            localStorage.setItem('readingLevel', 'easy');
        } else {
            toggle.textContent = 'Standard';
            localStorage.setItem('readingLevel', 'standard');
        }
    });
    
    // Add to page
    document.body.appendChild(toggle);
});