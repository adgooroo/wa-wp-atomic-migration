# WordPress Bootscore to Webasyst Waboot Migration Guide

## Table of Contents
1. [Migration Overview](#migration-overview)
2. [Architecture Comparison](#architecture-comparison)
3. [Function Mapping](#function-mapping)
4. [Template Structure](#template-structure)
5. [Asset Management](#asset-management)
6. [JavaScript Framework Transition](#javascript-framework-transition)
7. [CSS Methodology](#css-methodology)
8. [Best Practices](#best-practices)
9. [Performance Optimization](#performance-optimization)
10. [Troubleshooting](#troubleshooting)

## Migration Overview

The **Waboot** theme represents a complete migration from the WordPress **Bootscore** theme to the Webasyst platform. This migration maintains feature parity while adapting to Webasyst's architecture and leveraging modern web technologies.

### Key Migration Goals
- **Complete Feature Parity**: All Bootscore functionality recreated in Webasyst
- **Local Asset Management**: No CDN dependencies, all assets stored locally
- **Modern Tech Stack**: Bootstrap 5, Alpine.js, BEM CSS methodology
- **Performance Focus**: Optimized loading, responsive design, accessibility
- **Webasyst Integration**: Full compatibility with Webasyst Shop APIs and features

### Migration Timeline
- **Stage 1**: Core structure and configuration (theme.xml, basic templates)
- **Stage 2**: Asset integration (CSS, JavaScript, vendor libraries)
- **Stage 3**: Advanced templates (product listing, product detail)
- **Stage 4**: Documentation and final optimizations

## Architecture Comparison

### WordPress Bootscore Architecture
```
WordPress Theme Structure:
├── functions.php (theme functions)
├── style.css (main stylesheet)
├── index.php (homepage)
├── header.php (header template)
├── footer.php (footer template)
├── single-product.php (product detail)
├── archive-product.php (product listing)
├── js/ (JavaScript files)
├── css/ (stylesheets)
└── assets/ (images, fonts)
```

### Webasyst Waboot Architecture
```
Webasyst Theme Structure:
├── theme.xml (theme configuration)
├── templates/
│   ├── layout.html (main layout)
│   ├── header.html (header template)
│   ├── footer.html (footer template)
│   ├── home.html (homepage)
│   ├── category.html (product listing)
│   └── product.html (product detail)
├── css/
│   ├── waboot.css (main stylesheet)
│   └── vendor/ (Bootstrap, AOS)
├── js/
│   ├── waboot.js (main JavaScript)
│   └── vendor/ (Alpine.js, Bootstrap)
├── images/ (theme images)
└── fonts/ (local fonts)
```

## Function Mapping

### Template Functions

| WordPress Function | Webasyst Equivalent | Description |
|-------------------|-------------------|-------------|
| `get_header()` | `{include file="header.html"}` | Include header template |
| `get_footer()` | `{include file="footer.html"}` | Include footer template |
| `wp_head()` | `{$wa->head()}` | Output head metadata |
| `wp_footer()` | `{$wa->js()}` | Output footer scripts |
| `the_title()` | `{$product.name\|escape}` | Display title/name |
| `the_content()` | `{$product.description}` | Display content/description |
| `get_permalink()` | `{$wa->getUrl('shop')}product/{$product.url}/` | Get item URL |
| `has_post_thumbnail()` | `{if $product.image}` | Check for featured image |
| `the_post_thumbnail()` | `<img src="{$product.image.url_crop}">` | Display featured image |

### Navigation Functions

| WordPress Function | Webasyst Equivalent | Description |
|-------------------|-------------------|-------------|
| `wp_nav_menu()` | `{include file="navigation.html"}` | Display navigation menu |
| `get_search_form()` | `{include file="search.html"}` | Include search form |
| `paginate_links()` | Custom pagination logic | Display pagination |
| `next_post_link()` | `{$next_product.url}` | Next item link |
| `previous_post_link()` | `{$prev_product.url}` | Previous item link |

### E-commerce Functions

| WordPress/WooCommerce | Webasyst Equivalent | Description |
|----------------------|-------------------|-------------|
| `wc_get_products()` | `{$products.products}` | Get product list |
| `wc_get_product()` | `{$product}` | Get single product |
| `wc_price()` | `{wa_currency($product.price)}` | Format price |
| `woocommerce_breadcrumb()` | Custom breadcrumb template | Display breadcrumbs |
| `woocommerce_output_product_data_tabs()` | Custom tab implementation | Product detail tabs |
| `wc_get_cart_url()` | `{$wa->getUrl('shop')}cart/` | Cart page URL |
| `wc_get_checkout_url()` | `{$wa->getUrl('shop')}checkout/` | Checkout page URL |

### Data Access Functions

| WordPress Function | Webasyst Equivalent | Description |
|-------------------|-------------------|-------------|
| `get_option()` | `{$wa->shop->settings()}` | Get settings |
| `get_theme_mod()` | `{$wa->theme()->settings()}` | Get theme settings |
| `wp_get_current_user()` | `{$wa->getUser()}` | Get current user |
| `is_user_logged_in()` | `{$wa->getUser()->isAuth()}` | Check authentication |
| `get_cart_contents()` | `{$wa->getStorage('shop/cart')}` | Get cart contents |

## Template Structure

### Layout Template (layout.html)
**WordPress equivalent**: header.php + footer.php combination

```smarty
{* Waboot layout.html structure *}
<!DOCTYPE html>
<html lang="{$locale}">
<head>
    {* Meta tags and title *}
    <meta charset="utf-8">
    <title>{$wa_title|escape}</title>
    
    {* Local CSS assets *}
    <link rel="stylesheet" href="{$wa->themeUrl()}css/vendor/bootstrap.min.css">
    <link rel="stylesheet" href="{$wa->themeUrl()}css/vendor/aos.min.css">
    <link rel="stylesheet" href="{$wa->themeUrl()}css/waboot.css">
</head>
<body>
    {include file="header.html"}
    
    <main role="main">
        {$content}
    </main>
    
    {include file="footer.html"}
    
    {* Local JavaScript assets *}
    <script src="{$wa->themeUrl()}js/vendor/bootstrap.bundle.min.js"></script>
    <script src="{$wa->themeUrl()}js/vendor/alpine.min.js" defer></script>
    <script src="{$wa->themeUrl()}js/vendor/aos.min.js"></script>
    <script src="{$wa->themeUrl()}js/waboot.js"></script>
</body>
</html>
```

### Product Listing Template (category.html)
**WordPress equivalent**: archive-product.php

Key differences:
- Uses `{foreach $products.products as $product}` instead of WordPress loop
- Implements Alpine.js for filters instead of WordPress AJAX
- Uses Webasyst pagination instead of `paginate_links()`

### Product Detail Template (product.html)
**WordPress equivalent**: single-product.php

Key differences:
- Uses `{$product}` object instead of global `$product`
- Implements Alpine.js for image gallery and variants
- Uses Webasyst cart API instead of WooCommerce functions

## Asset Management

### Local Asset Strategy
All assets are stored locally to eliminate CDN dependencies:

```
waboot/
├── css/vendor/
│   ├── bootstrap.min.css (Bootstrap 5.3.2)
│   └── aos.min.css (AOS 2.3.4)
├── js/vendor/
│   ├── bootstrap.bundle.min.js (Bootstrap 5.3.2)
│   ├── alpine.min.js (Alpine.js 3.13.3)
│   └── aos.min.js (AOS 2.3.4)
└── fonts/ (custom fonts if needed)
```

### Asset Loading Order
1. **CSS**: Bootstrap → AOS → Waboot custom styles
2. **JavaScript**: Bootstrap → Alpine.js → AOS → Waboot custom scripts

### Performance Considerations
- All vendor assets are minified
- CSS uses modern features (CSS Grid, Flexbox, Custom Properties)
- JavaScript uses modern ES6+ features with Alpine.js for reactivity
- Images use lazy loading and responsive srcset when possible

## JavaScript Framework Transition

### From jQuery to Alpine.js

**WordPress/Bootscore typically uses jQuery:**
```javascript
// WordPress/jQuery approach
$(document).ready(function() {
    $('.product-card').hover(function() {
        $(this).addClass('hover-effect');
    });
    
    $('.add-to-cart').click(function() {
        var productId = $(this).data('product-id');
        // AJAX call to add to cart
    });
});
```

**Waboot uses Alpine.js:**
```javascript
// Alpine.js approach
<div class="product-card" 
     @mouseenter="$el.classList.add('hover-effect')"
     @mouseleave="$el.classList.remove('hover-effect')">
    
    <button class="add-to-cart" 
            @click="$store.waboot.addToCart(product)"
            x-data="{ product: {$product|@json_encode} }">
        Add to Cart
    </button>
</div>
```

### Alpine.js Store Implementation
```javascript
// Global state management
Alpine.store('waboot', {
    cartItems: [],
    wishlistItems: [],
    
    addToCart(product) {
        // Add to cart logic
    },
    
    toggleWishlist(product) {
        // Wishlist toggle logic
    }
});
```

## CSS Methodology

### BEM (Block Element Modifier) Implementation

**Block**: Independent component
```css
.waboot__product-card { }
```

**Element**: Part of a block
```css
.waboot__product-card__image { }
.waboot__product-card__title { }
.waboot__product-card__price { }
```

**Modifier**: Variation of block or element
```css
.waboot__product-card--featured { }
.waboot__product-card__title--large { }
```

### CSS Custom Properties
```css
:root {
    --waboot-primary: #0d6efd;
    --waboot-secondary: #6c757d;
    --waboot-border-radius: 0.375rem;
    --waboot-transition: all 0.15s ease-in-out;
}
```

### Responsive Design Strategy
- **Mobile-first approach**
- **Bootstrap 5 grid system**
- **Custom responsive utilities**

```css
/* Mobile first */
.waboot__hero-title {
    font-size: 2.5rem;
}

/* Tablet */
@media (min-width: 768px) {
    .waboot__hero-title {
        font-size: 3rem;
    }
}

/* Desktop */
@media (min-width: 1200px) {
    .waboot__hero-title {
        font-size: 4rem;
    }
}
```

## Best Practices

### 1. Template Organization
- Keep templates focused on presentation logic only
- Use includes for reusable components
- Implement proper Smarty template inheritance

### 2. Performance Optimization
- Use lazy loading for images
- Implement critical CSS inlining
- Optimize JavaScript bundle size
- Use proper caching headers

### 3. Accessibility
- Implement proper ARIA labels
- Ensure keyboard navigation
- Maintain proper heading hierarchy
- Use semantic HTML5 elements

### 4. SEO Optimization
- Implement structured data (JSON-LD)
- Use proper meta tags
- Optimize images with alt text
- Implement canonical URLs

### 5. Security
- Escape all output using `|escape`
- Validate user inputs
- Use CSRF protection for forms
- Implement proper permission checks

## Performance Optimization

### CSS Optimization
```css
/* Use efficient selectors */
.waboot__nav-link { /* Good: class selector */ }
nav ul li a { /* Avoid: complex descendant selectors */ }

/* Optimize animations */
.waboot__product-card {
    transition: transform 0.3s ease;
    will-change: transform; /* Optimize for animations */
}
```

### JavaScript Optimization
```javascript
// Use event delegation
document.addEventListener('click', function(e) {
    if (e.target.matches('.add-to-cart')) {
        // Handle add to cart
    }
});

// Debounce search inputs
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

### Image Optimization
```html
<!-- Responsive images -->
<img src="{$product.image.url_thumb}" 
     srcset="{$product.image.url_thumb} 300w,
             {$product.image.url_crop} 600w,
             {$product.image.url_original} 1200w"
     sizes="(max-width: 768px) 300px,
            (max-width: 1200px) 600px,
            1200px"
     loading="lazy"
     alt="{$product.name|escape}">
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Template Not Loading
**Problem**: Template file not found
**Solution**: Check file path and naming conventions
```smarty
{* Correct include syntax *}
{include file="header.html"}

{* Check file exists in templates/ directory *}
```

#### 2. CSS Not Applied
**Problem**: Styles not loading
**Solution**: Verify asset paths
```html
<!-- Correct asset URL -->
<link rel="stylesheet" href="{$wa->themeUrl()}css/waboot.css">
```

#### 3. JavaScript Errors
**Problem**: Alpine.js not working
**Solution**: Check script loading order
```html
<!-- Alpine.js must be loaded with defer -->
<script src="{$wa->themeUrl()}js/vendor/alpine.min.js" defer></script>
```

#### 4. Product Data Not Displaying
**Problem**: Product variables empty
**Solution**: Check Webasyst controller data
```smarty
{* Debug product data *}
{$product|@debug_print_var}

{* Check if product exists *}
{if $product}
    <h1>{$product.name|escape}</h1>
{else}
    <p>Product not found</p>
{/if}
```

#### 5. Cart Functionality Issues
**Problem**: Add to cart not working
**Solution**: Verify Webasyst shop API integration
```javascript
// Check if shop API is available
if (typeof wa_shop !== 'undefined') {
    // Use Webasyst cart API
    wa_shop.cart.add(product_id, quantity);
}
```

### Debug Mode
Enable debug mode in Webasyst:
```php
// In wa-config/config.php
$config['debug'] = true;
```

### Performance Monitoring
Use browser developer tools to monitor:
- **Page load times**
- **JavaScript errors**
- **CSS render blocking**
- **Image optimization**

---

This migration guide provides a comprehensive roadmap for converting WordPress Bootscore themes to Webasyst Waboot themes, ensuring feature parity while leveraging modern web technologies and Webasyst's powerful e-commerce platform.
