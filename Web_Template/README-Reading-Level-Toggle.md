# Reading Level Toggle Implementation Guide

## Overview
The reading level toggle feature provides an unobtrusive way for students to switch between "Standard" and "Summary" reading levels on educational web pages. This feature is designed to help elementary school students access content at their appropriate reading level without feeling singled out.

## Files Included
- `reading-level-toggle.css` - Styling for the toggle button and reading level functionality
- `reading-level-toggle.js` - JavaScript functionality for the toggle behavior
- `template.html` - Updated template with reading level toggle implementation
- `content-template.html` - Example content template showing dual reading levels

## How to Use in New Projects

### 1. Include Required Files
Add these lines to your HTML `<head>` section:
```html
<link rel="stylesheet" href="reading-level-toggle.css">
```

Add this line before the closing `</body>` tag:
```html
<script src="reading-level-toggle.js"></script>
```

### 2. Structure Your Content
Wrap text content with dual reading level spans:
```html
<p>
    <span class="standard-reading">Your detailed, standard reading level content here.</span>
    <span class="easy-reading">Your simplified, summary content here.</span>
</p>
```

### 3. Content Guidelines

#### Standard Reading Level:
- Use complete sentences with proper grammar
- Include detailed explanations and context
- Use grade-appropriate vocabulary
- Maintain academic tone

#### Summary Reading Level:
- Use shorter, simpler sentences
- Focus on key facts and main ideas
- Use everyday vocabulary
- Break complex concepts into simple parts
- Maintain all important factual information

## Features

### Toggle Button
- **Position**: Fixed in top-right corner
- **Labels**: "Standard" and "Summary" (avoids stigmatizing language)
- **Default**: Always starts in "Standard" mode
- **Persistence**: Remembers user preference using localStorage
- **Accessibility**: Includes proper ARIA labels and keyboard support

### Responsive Design
- Automatically adjusts for mobile devices
- Doesn't interfere with Google Translate widget
- Maintains readability across screen sizes

### User Experience
- Unobtrusive design that doesn't draw attention
- Smooth transitions between reading levels
- Consistent styling with existing site design
- Works seamlessly with existing navigation

## Example Implementation

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Page Title</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="reading-level-toggle.css">
</head>
<body>
    <main>
        <article>
            <h1>Your Page Title</h1>
            
            <p>
                <span class="standard-reading">The Constitutional Convention was a pivotal meeting that took place in Philadelphia during the summer of 1787, where fifty-five delegates from twelve states gathered to address the weaknesses of the Articles of Confederation.</span>
                <span class="easy-reading">In 1787, 55 men from 12 states met in Philadelphia to fix problems with America's government rules.</span>
            </p>
            
            <!-- More content with dual reading levels -->
        </article>
    </main>
    
    <!-- Google Translate Widget -->
    <div id="google_translate_element" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;"></div>
    <script type="text/javascript">
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
        }
    </script>
    <script type="text/javascript" src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
    
    <script src="reading-level-toggle.js"></script>
</body>
</html>
```

## Best Practices

### Content Creation
1. **Preserve Information**: Summary versions should contain all important facts, just simplified
2. **Age-Appropriate Language**: Use vocabulary suitable for elementary students in summary mode
3. **Maintain Accuracy**: Don't oversimplify to the point of losing meaning
4. **Consistent Structure**: Keep the same paragraph structure in both versions

### Technical Implementation
1. **Always Include Both Levels**: Every paragraph should have both standard and easy reading spans
2. **Test Functionality**: Verify the toggle works on all pages
3. **Mobile Testing**: Ensure proper display on mobile devices
4. **Accessibility**: Test with screen readers and keyboard navigation

## Troubleshooting

### Toggle Not Appearing
- Check that `reading-level-toggle.js` is properly linked
- Verify JavaScript console for errors
- Ensure CSS file is properly linked

### Content Not Switching
- Verify proper class names: `standard-reading` and `easy-reading`
- Check that spans are properly nested within paragraph tags
- Ensure no conflicting CSS rules

### Mobile Issues
- Test responsive design on various screen sizes
- Verify toggle button doesn't overlap with other elements
- Check that Google Translate widget positioning is correct

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements
- Additional reading levels (Advanced, Beginner)
- Audio narration integration
- Reading level analytics
- Teacher dashboard for monitoring usage

---

For questions or support, refer to the main project documentation or contact the development team.