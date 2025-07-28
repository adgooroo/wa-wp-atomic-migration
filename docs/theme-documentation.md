# Waboot Theme Documentation

## Table of Contents
1. [Theme Overview](#theme-overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Customization](#customization)
5. [Template Reference](#template-reference)
6. [JavaScript API](#javascript-api)
7. [CSS Architecture](#css-architecture)
8. [Performance](#performance)
9. [Maintenance](#maintenance)
10. [Support](#support)

## Theme Overview

### Description
**Waboot** is a modern, fully-local Webasyst e-commerce theme built by porting the popular WordPress Bootscore theme. It combines the power of Bootstrap 5 with Alpine.js for a responsive, fast, and accessible shopping experience.

### Key Features
- **Fully Local Assets**: No CDN dependencies - all libraries stored locally
- **Bootstrap 5**: Latest Bootstrap framework for responsive design
- **Alpine.js**: Lightweight JavaScript framework for reactive components
- **BEM CSS**: Organized, maintainable CSS methodology
- **E-commerce Focused**: Optimized for online stores and product catalogs
- **Mobile-First**: Responsive design that works on all devices
- **SEO Optimized**: Clean markup and semantic HTML structure
- **Accessibility**: WCAG 2.1 compliant design
- **Performance**: Optimized for fast loading and smooth interactions

### Technology Stack
- **CSS Framework**: Bootstrap 5.3.2
- **JavaScript Framework**: Alpine.js 3.13.3
- **Animation Library**: AOS (Animate On Scroll) 2.3.4
- **CSS Methodology**: BEM (Block Element Modifier)
- **Template Engine**: Smarty (Webasyst default)
- **Build Tools**: None required (pure CSS/JS)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Android Chrome 90+

## Installation

### Prerequisites
- Webasyst Framework installed
- Webasyst Shop app installed and configured
- PHP 7.4+ (recommended 8.0+)
- Modern web browser for administration

### Step 1: Download and Install
1. Download the Waboot theme package
2. Extract to your Webasyst themes directory:
   ```
   /path/to/webasyst/wa-apps/{app}/themes/waboot/
   ```
   Where `{app}` is the application name (site, shop, blog, hub, mailer, etc.)
3. Set proper file permissions:
   ```bash
   chmod -R 755 wa-apps/{app}/themes/waboot/
   ```

### Step 2: Activate Theme
1. Log in to Webasyst admin panel
2. Navigate to **Shop** → **Design** → **Themes**
3. Find "Waboot" theme and click **Activate**
4. Configure theme settings as needed

### Step 3: Verify Installation
1. Visit your shop frontend
2. Check that all assets load correctly (no 404 errors)
3. Test responsive behavior on different devices
4. Verify JavaScript functionality (cart, filters, etc.)

### Troubleshooting Installation
- **Assets not loading**: Check file permissions and paths
- **Theme not appearing**: Verify theme.xml format and placement
- **JavaScript errors**: Ensure Alpine.js loads with `defer` attribute
- **CSS not applied**: Check for conflicting stylesheets

## Configuration

### Theme Settings
Access theme settings via **Shop** → **Design** → **Themes** → **Waboot** → **Settings**

#### Layout Options
```xml
<setting var="layout_type" control_type="select" name="Layout Type">
    <option value="wide">Wide Layout</option>
    <option value="boxed">Boxed Layout</option>
</setting>
```

#### Color Scheme
```xml
<setting var="color_scheme" control_type="select" name="Color Scheme">
    <option value="default">Default Blue</option>
    <option value="green">Green</option>
    <option value="purple">Purple</option>
    <option value="custom">Custom</option>
</setting>
```

#### Header Configuration
```xml
<setting var="header_style" control_type="select" name="Header Style">
    <option value="default">Default</option>
    <option value="minimal">Minimal</option>
    <option value="centered">Centered</option>
</setting>

<setting var="logo" control_type="file" name="Logo Upload">
    <description>Upload your store logo (recommended: 200x50px)</description>
</setting>
```

#### Product Display
```xml
<setting var="products_per_row" control_type="select" name="Products Per Row">
    <option value="3">3 Products</option>
    <option value="4">4 Products</option>
    <option value="5">5 Products</option>
</setting>

<setting var="show_filters" control_type="checkbox" name="Show Product Filters">
    <description>Display filters sidebar on category pages</description>
</setting>
```

### Custom CSS
Add custom styles via **Shop** → **Design** → **Themes** → **Custom CSS**

```css
/* Example customizations */
:root {
    --waboot-primary: #your-brand-color;
    --waboot-secondary: #your-secondary-color;
}

.waboot__hero {
    background-image: url('your-hero-image.jpg');
}
```

### Custom JavaScript
Add custom scripts via **Shop** → **Design** → **Themes** → **Custom JavaScript**

```javascript
// Example: Custom product interactions
document.addEventListener('alpine:init', () => {
    Alpine.store('customStore', {
        // Your custom Alpine.js store
    });
});
```

## Customization

### Template Customization

#### Creating Child Templates
1. Copy template to your custom directory:
   ```
   /wa-apps/{app}/themes/waboot-custom/templates/
   ```
   Where `{app}` is the application name (site, shop, blog, hub, mailer, etc.)
2. Modify as needed while maintaining Smarty syntax
3. Reference original for variable structure

#### Common Customizations

**Custom Header Logo:**
```smarty
{* In header.html *}
<a class="navbar-brand" href="{$wa_url}">
    {if $wa->theme()->settings('logo')}
        <img src="{$wa->theme()->settings('logo')}" 
             alt="{$wa->shop->settings('name')}" 
             class="waboot__logo">
    {else}
        <span class="waboot__logo-text">{$wa->shop->settings('name')}</span>
    {/if}
</a>
```

**Custom Product Card:**
```smarty
{* Custom product display *}
<div class="waboot__product-card waboot__product-card--custom">
    <div class="waboot__product-image">
        <img src="{$product.image.url_crop}" alt="{$product.name|escape}">
        {* Add custom overlay *}
        <div class="waboot__product-overlay">
            <button class="btn btn-primary">Quick View</button>
        </div>
    </div>
    <div class="waboot__product-content">
        <h3>{$product.name|escape}</h3>
        <p class="price">{wa_currency($product.price)}</p>
        {* Custom additional content *}
        <div class="custom-product-meta">
            {if $product.features.brand}
                <span class="brand">Brand: {$product.features.brand.value}</span>
            {/if}
        </div>
    </div>
</div>
```

### CSS Customization

#### Custom Color Schemes
```css
/* Custom color scheme */
:root {
    --waboot-primary: #e74c3c;
    --waboot-secondary: #34495e;
    --waboot-success: #27ae60;
    --waboot-warning: #f39c12;
    --waboot-danger: #e74c3c;
}

/* Apply to components */
.waboot__btn-primary {
    background-color: var(--waboot-primary);
    border-color: var(--waboot-primary);
}

.waboot__nav-link:hover {
    color: var(--waboot-primary);
}
```

#### Custom Typography
```css
/* Custom fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');

:root {
    --waboot-font-family-sans-serif: 'Inter', sans-serif;
}

body {
    font-family: var(--waboot-font-family-sans-serif);
}

/* Custom heading styles */
.waboot__hero-title {
    font-family: 'Georgia', serif;
    font-weight: 700;
}
```

### JavaScript Customization

#### Custom Alpine.js Components
```javascript
// Custom product gallery component
Alpine.data('productGallery', () => ({
    activeImage: 0,
    images: [],
    
    init() {
        this.images = this.$el.dataset.images ? 
            JSON.parse(this.$el.dataset.images) : [];
    },
    
    setActiveImage(index) {
        this.activeImage = index;
        
        // Custom animation
        this.$refs.mainImage.style.opacity = '0';
        setTimeout(() => {
            this.$refs.mainImage.style.opacity = '1';
        }, 150);
    }
}));
```

#### Custom Store Integration
```javascript
// Extend Waboot store
document.addEventListener('alpine:init', () => {
    // Custom wishlist functionality
    Alpine.store('wishlist', {
        items: JSON.parse(localStorage.getItem('wishlist') || '[]'),
        
        add(product) {
            if (!this.has(product.id)) {
                this.items.push(product);
                this.save();
            }
        },
        
        remove(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.save();
        },
        
        has(productId) {
            return this.items.some(item => item.id === productId);
        },
        
        save() {
            localStorage.setItem('wishlist', JSON.stringify(this.items));
        }
    });
});
```

## Template Reference

### Available Templates

#### Core Templates
- **layout.html**: Main layout wrapper
- **header.html**: Site header and navigation
- **footer.html**: Site footer
- **home.html**: Homepage template

#### Shop Templates
- **category.html**: Product category listing
- **product.html**: Single product detail page
- **cart.html**: Shopping cart page
- **checkout.html**: Checkout process

#### Utility Templates
- **search.html**: Search results page
- **404.html**: Error page
- **pagination.html**: Pagination component

### Template Variables

#### Global Variables
```smarty
{$wa_url}              <!-- Site root URL -->
{$wa->getUrl('shop')}  <!-- Shop app URL -->
{$wa->themeUrl()}      <!-- Theme assets URL -->
{$wa_title}            <!-- Page title -->
{$locale}              <!-- Current locale -->
{$layout_type}         <!-- Theme layout setting -->
```

#### Product Variables
```smarty
{$product.id}          <!-- Product ID -->
{$product.name}        <!-- Product name -->
{$product.url}         <!-- Product URL slug -->
{$product.price}       <!-- Product price -->
{$product.compare_price} <!-- Compare at price -->
{$product.description} <!-- Full description -->
{$product.summary}     <!-- Short description -->
{$product.image}       <!-- Featured image -->
{$product.images}      <!-- All product images -->
{$product.features}    <!-- Product features/attributes -->
{$product.available}   <!-- Stock availability -->
{$product.rating}      <!-- Average rating -->
{$product.reviews_count} <!-- Number of reviews -->
```

#### Category Variables
```smarty
{$category.id}         <!-- Category ID -->
{$category.name}       <!-- Category name -->
{$category.url}        <!-- Category URL slug -->
{$category.description} <!-- Category description -->
{$category.parent}     <!-- Parent category -->
{$products.products}   <!-- Product list -->
{$products.count}      <!-- Total product count -->
{$products.pages}      <!-- Number of pages -->
{$products.current_page} <!-- Current page number -->
```

### Template Functions

#### Including Templates
```smarty
{include file="header.html"}
{include file="footer.html"}
{include file="product-card.html" product=$product}
```

#### Conditional Logic
```smarty
{if $product.available}
    <button class="btn btn-primary">Add to Cart</button>
{else}
    <button class="btn btn-secondary" disabled>Out of Stock</button>
{/if}

{if $product.images && count($product.images) > 1}
    <!-- Show image gallery -->
{/if}
```

#### Loops
```smarty
{foreach $products.products as $product}
    <div class="product-card">
        <h3>{$product.name|escape}</h3>
        <p>{wa_currency($product.price)}</p>
    </div>
{/foreach}

{for $i=1 to 5}
    <i class="fa fa-star {if $i <= $product.rating}active{/if}"></i>
{/for}
```

## JavaScript API

### Waboot Theme Object
```javascript
// Access theme functionality
WabootTheme.init();                    // Initialize theme
WabootTheme.validateEmail(email);      // Validate email
WabootTheme.showQuickView(productId);  // Show product quick view
WabootTheme.toggleWishlist(productId); // Toggle wishlist
```

### Alpine.js Store
```javascript
// Access global store
$store.waboot.cartItems;         // Cart items array
$store.waboot.cartCount;         // Number of items in cart
$store.waboot.cartTotal;         // Cart total amount
$store.waboot.wishlistItems;     // Wishlist items
$store.waboot.addToCart(product); // Add product to cart
$store.waboot.toggleWishlist(product); // Toggle wishlist
$store.waboot.search(query);     // Search products
$store.waboot.formatPrice(price); // Format price with currency
```

### Event System
```javascript
// Custom events
document.addEventListener('waboot:cartUpdated', function(e) {
    console.log('Cart updated:', e.detail);
});

document.addEventListener('waboot:productAdded', function(e) {
    console.log('Product added:', e.detail.product);
});

// Trigger custom events
document.dispatchEvent(new CustomEvent('waboot:cartUpdated', {
    detail: { cart: cartData }
}));
```

### Product Interactions
```javascript
// Add to cart with custom options
WabootTheme.addToCart({
    productId: 123,
    quantity: 2,
    variant: 'red-large',
    callback: function(response) {
        // Handle response
    }
});

// Quick view modal
WabootTheme.quickView({
    productId: 123,
    showVariants: true,
    showDescription: true
});
```

## CSS Architecture

### BEM Methodology
The theme uses BEM (Block Element Modifier) naming convention:

```css
/* Block */
.waboot__product-card { }

/* Element */
.waboot__product-card__image { }
.waboot__product-card__title { }
.waboot__product-card__price { }

/* Modifier */
.waboot__product-card--featured { }
.waboot__product-card--sale { }
```

### CSS Custom Properties
```css
:root {
    /* Colors */
    --waboot-primary: #0d6efd;
    --waboot-secondary: #6c757d;
    --waboot-success: #198754;
    --waboot-danger: #dc3545;
    
    /* Typography */
    --waboot-font-family-sans-serif: system-ui, sans-serif;
    --waboot-font-size-base: 1rem;
    --waboot-font-weight-bold: 700;
    
    /* Spacing */
    --waboot-spacer: 1rem;
    --waboot-grid-gutter-width: 1.5rem;
    
    /* Borders */
    --waboot-border-radius: 0.375rem;
    --waboot-border-color: #dee2e6;
    
    /* Shadows */
    --waboot-box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    
    /* Transitions */
    --waboot-transition: all 0.15s ease-in-out;
}
```

### Component Organization
```css
/* Base styles */
@import "base/reset.css";
@import "base/typography.css";

/* Layout components */
@import "layout/header.css";
@import "layout/footer.css";
@import "layout/navigation.css";

/* UI components */
@import "components/buttons.css";
@import "components/forms.css";
@import "components/cards.css";

/* E-commerce specific */
@import "shop/products.css";
@import "shop/cart.css";
@import "shop/checkout.css";

/* Utilities */
@import "utilities/spacing.css";
@import "utilities/display.css";
```

### Responsive Breakpoints
```css
/* Bootstrap 5 breakpoints */
$breakpoints: (
    xs: 0,
    sm: 576px,
    md: 768px,
    lg: 992px,
    xl: 1200px,
    xxl: 1400px
);

/* Usage */
@media (min-width: 768px) {
    .waboot__hero-title {
        font-size: 3rem;
    }
}
```

## Performance

### Optimization Techniques

#### CSS Performance
- **Critical CSS**: Inline above-the-fold styles
- **CSS Minification**: All CSS files are minified
- **Unused CSS**: Remove unused Bootstrap components
- **CSS Variables**: Use for dynamic theming without JavaScript

#### JavaScript Performance
- **Lazy Loading**: Load non-critical scripts after page load
- **Event Delegation**: Use for dynamic content
- **Debouncing**: For search and scroll events
- **Code Splitting**: Separate vendor and theme scripts

#### Image Optimization
```html
<!-- Responsive images -->
<img src="{$product.image.url_thumb}"
     srcset="{$product.image.url_thumb} 300w,
             {$product.image.url_crop} 600w,
             {$product.image.url_original} 1200w"
     sizes="(max-width: 768px) 300px, 600px"
     loading="lazy"
     alt="{$product.name|escape}">
```

#### Local Asset Benefits
- **No CDN Delays**: Faster initial load
- **Cache Control**: Better caching strategies
- **Offline Support**: Works without internet
- **Security**: No third-party dependencies

### Performance Monitoring
```javascript
// Performance timing
window.addEventListener('load', function() {
    const perfData = performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time:', pageLoadTime, 'ms');
});

// Core Web Vitals
new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
        console.log('Performance metric:', entry.name, entry.value);
    }
}).observe({ entryTypes: ['measure', 'navigation', 'resource'] });
```

## Maintenance

### Regular Updates

#### Vendor Libraries
1. **Bootstrap**: Check for updates quarterly
2. **Alpine.js**: Monitor for bug fixes and features
3. **AOS**: Update as needed for animation improvements

#### Security Updates
- Monitor Webasyst security announcements
- Update theme when framework updates are released
- Review and update custom code for vulnerabilities

### Backup Procedures
1. **Theme Files**: Regular backup of theme directory
2. **Settings**: Export theme configuration
3. **Custom Code**: Version control for customizations
4. **Database**: Backup Webasyst database regularly

### Version Control
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial Waboot theme commit"

# Track changes
git add -A
git commit -m "Update product template styling"

# Create branches for major changes
git checkout -b feature/new-homepage-design
```

### Testing Checklist
- [ ] All pages load without errors
- [ ] Responsive design works on all devices
- [ ] Shopping cart functionality works
- [ ] Search and filters function correctly
- [ ] Forms submit properly
- [ ] JavaScript interactions work
- [ ] CSS animations perform smoothly
- [ ] SEO meta tags are present
- [ ] Accessibility standards met
- [ ] Performance benchmarks met

### Troubleshooting

#### Common Issues
1. **Broken Layouts**: Check Bootstrap CSS loading
2. **JavaScript Errors**: Verify Alpine.js initialization
3. **Missing Images**: Check file paths and permissions
4. **Performance Issues**: Review asset loading order
5. **Mobile Issues**: Test responsive breakpoints

#### Debug Tools
```javascript
// Enable debug mode
Alpine.store('debug', true);

// Debug template variables
{if $wa->getEnv() == 'development'}
    {$product|@debug_print_var}
{/if}

// Performance monitoring
console.time('page-render');
// ... page content ...
console.timeEnd('page-render');
```

## Support

### Documentation Resources
- [Webasyst Developer Documentation](https://developers.webasyst.com/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.3/)
- [Alpine.js Documentation](https://alpinejs.dev/)
- [BEM CSS Methodology](https://bem.info/)

### Community Support
- Webasyst Community Forums
- GitHub Issues (for theme-specific problems)
- Stack Overflow (for general web development)

### Professional Support
For custom development or advanced modifications:
- Contact theme developers
- Hire Webasyst certified developers
- Request custom features or integrations

### Changelog
Keep track of theme updates and changes in `CHANGELOG.md`

---

This documentation provides comprehensive guidance for using, customizing, and maintaining the Waboot theme. For additional support or custom requirements, please refer to the support resources listed above.
