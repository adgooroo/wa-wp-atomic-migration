# User Theme Customization

This directory contains user-customizable files for the Waboot theme.

## Structure

```
user_theme/
├── css/
│   └── user-custom.css      # User custom CSS styles
├── js/
│   └── user-custom.js       # User custom JavaScript
├── scss/
│   └── user-custom.scss     # User custom SCSS (compile to CSS)
└── README.md                # This file
```

## Usage

### CSS Customization
Edit `css/user-custom.css` to add your custom styles. This file is loaded after all theme styles, so your rules will override theme defaults.

### JavaScript Customization
Edit `js/user-custom.js` to add your custom functionality. This file is loaded after all theme scripts.

### SCSS Customization
Edit `scss/user-custom.scss` if you prefer SCSS syntax. You'll need to compile this to CSS manually.

## Best Practices

1. **Use Specific Selectors**: Avoid generic selectors to prevent conflicts
2. **Test Responsive Design**: Ensure your customizations work on all devices
3. **Follow BEM Methodology**: Use the existing naming conventions
4. **Backup Your Changes**: Keep copies of your customizations

## Examples

### Custom Button Styles
```css
.waboot__btn--custom {
    background: linear-gradient(45deg, #ff6b6b, #ee5a24);
    border: none;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}
```

### Custom JavaScript Functionality
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Add custom event listeners
    const customButtons = document.querySelectorAll('.custom-button');
    customButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Your custom functionality
        });
    });
});
```

## Important Notes

- Files in this directory are loaded after theme files
- Your customizations will persist through theme updates
- Always test your changes in a development environment first
- Consider using CSS custom properties for theme-wide changes 