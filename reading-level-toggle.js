/**
 * Reading Level Toggle JavaScript
 * Allows users to switch between standard, easy reading, and image-only versions of content
 */

// Initialize the reading level toggle when the page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeReadingLevelToggle();
});

function initializeReadingLevelToggle() {
    // Create the toggle HTML
    const toggleHTML = `
        <div class="reading-level-toggle">
            <label for="reading-level-select">Reading Level:</label>
            <select id="reading-level-select">
                <option value="standard">Standard</option>
                <option value="easy">Summary</option>
                <option value="images">Images Only</option>
            </select>
        </div>
    `;
    
    // Insert the toggle into the page
    document.body.insertAdjacentHTML('beforeend', toggleHTML);
    
    // Get the select element
    const selectElement = document.getElementById('reading-level-select');
    
    // Load saved preference from localStorage
    const savedLevel = localStorage.getItem('readingLevel');
    if (savedLevel) {
        selectElement.value = savedLevel;
        applyReadingLevel(savedLevel);
    }
    
    // Add event listener for changes
    selectElement.addEventListener('change', function() {
        const selectedLevel = this.value;
        applyReadingLevel(selectedLevel);
        
        // Save preference to localStorage
        localStorage.setItem('readingLevel', selectedLevel);
    });
}

function applyReadingLevel(level) {
    const body = document.body;
    
    // Remove all reading mode classes first
    body.classList.remove('easy-reading-mode', 'image-only-mode');
    
    // Apply the selected mode
    if (level === 'easy') {
        body.classList.add('easy-reading-mode');
    } else if (level === 'images') {
        body.classList.add('image-only-mode');
    }
    // If level === 'standard', no classes are added (default state)
}

/**
 * Helper function to create dual-content elements
 * Usage: createDualContent('Standard text here', 'Easy reading text here')
 */
function createDualContent(standardText, easyText) {
    return `
        <span class="standard-reading">${standardText}</span>
        <span class="easy-reading">${easyText}</span>
    `;
}

/**
 * Helper function to wrap existing content with reading level classes
 * Call this function after page load to convert existing paragraphs
 */
function convertExistingContent() {
    // This is an optional function that can be customized per page
    // Example usage would be to find specific paragraphs and wrap them
    console.log('Reading level toggle initialized. Use data-easy attributes or dual-content spans for different reading levels.');
}