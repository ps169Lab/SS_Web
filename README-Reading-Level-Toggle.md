# Reading Level Toggle Implementation Guide

This guide explains how to implement a simple, unobtrusive dropdown that allows students to toggle between standard and easier reading versions of content on your educational websites.

## Files Created

1. **reading-level-toggle.css** - Styles for the toggle dropdown
2. **reading-level-toggle.js** - JavaScript functionality for content switching
3. **reading-level-demo.html** - Working example implementation

## How It Works

The reading level toggle allows students to switch between two versions of text content:
- **Standard**: Regular reading level content
- **Easy Reading**: Simplified vocabulary and shorter sentences for struggling readers

## Implementation Steps

### Step 1: Include the Files

Add these lines to your HTML `<head>` section:

```html
<link rel="stylesheet" href="reading-level-toggle.css" />
```

Add this line before the closing `</body>` tag:

```html
<script src="reading-level-toggle.js"></script>
```

### Step 2: Structure Your Content

For each piece of content that should have two reading levels, use this HTML structure:

```html
<p>
    <span class="standard-reading">
        This is the standard reading level text with more complex vocabulary and longer sentences.
    </span>
    <span class="easy-reading">
        This is easier text with simple words and short sentences.
    </span>
</p>
```

### Step 3: Vocabulary Definitions Example

```html
<li><strong>Enslaved</strong> - 
    <span class="standard-reading">forced to work without pay</span>
    <span class="easy-reading">made to work for no money</span>
</li>
```

## Features

### Automatic Toggle Creation
- The JavaScript automatically creates and positions the reading level dropdown
- No manual HTML needed for the toggle itself

### User Preference Memory
- The system remembers the user's choice using localStorage
- When students return to the page, their preferred reading level is maintained

### Responsive Design
- The toggle adjusts position on mobile devices
- Works alongside existing features like Google Translate

### Smooth Transitions
- Content switches smoothly between reading levels
- No jarring page reloads or flashing

## Styling Customization

The toggle uses your existing color scheme from the site. Key colors used:
- Border: `#355C7D` (matches your navigation)
- Background: `#f6fbff` (light blue)
- Focus color: `#FF946A` (orange accent)

To customize colors, edit the CSS variables in `reading-level-toggle.css`.

## Content Writing Tips

### Standard Reading Level
- Use grade-appropriate vocabulary
- Include complex sentence structures
- Provide detailed explanations

### Easy Reading Level
- Use simple, common words
- Keep sentences short (under 15 words)
- Break complex ideas into smaller parts
- Use active voice when possible

### Example Transformations

**Standard**: "The Dutch brought the first enslaved Africans to New Amsterdam (now New York City) in 1626."

**Easy**: "People from Holland brought African people to work as slaves in 1626."

**Standard**: "This made New York City the second-largest slave-owning city in all the American colonies."

**Easy**: "New York City had more slaves than almost any other city in America."

## Browser Compatibility

This feature works in all modern browsers including:
- Chrome, Firefox, Safari, Edge
- Mobile browsers on iOS and Android
- Works with screen readers for accessibility

## Integration with Existing Features

The reading level toggle is designed to work alongside:
- Google Translate widget
- Your existing navigation
- Mobile responsive design
- Any other JavaScript features

## Troubleshooting

### Toggle Not Appearing
- Check that `reading-level-toggle.js` is loaded
- Verify the file path is correct
- Check browser console for JavaScript errors

### Content Not Switching
- Ensure you're using the correct CSS classes: `standard-reading` and `easy-reading`
- Verify both spans are present for each piece of content
- Check that content is properly nested within the spans

### Styling Issues
- Make sure `reading-level-toggle.css` is loaded after your main stylesheet
- Check for CSS conflicts with existing styles
- Verify the toggle has sufficient z-index to appear above other content

## Future Enhancements

Possible additions for the future:
- Additional reading levels (beginner, intermediate, advanced)
- Audio playback for each reading level
- Visual indicators showing which content has multiple reading levels
- Analytics to track which reading level students prefer

## Accessibility Features

- Keyboard navigation support
- Screen reader compatible
- High contrast colors for visibility
- Clear labeling for assistive technologies

This implementation provides a simple, effective way to make your educational content accessible to students with different reading abilities while maintaining a clean, professional appearance.