# Webasyst Theme Localization Guide

## Overview

This comprehensive guide covers the implementation of internationalization (i18n) and localization (l10n) in Webasyst themes. Learn how to create multilingual themes that support multiple languages, cultures, and regions while maintaining proper inheritance patterns in child themes.

## 📋 Table of Contents

1. [Localization Fundamentals](#localization-fundamentals)
2. [Theme.xml Configuration](#themexml-configuration)
3. [Directory Structure](#directory-structure)
4. [Template Localization](#template-localization)
5. [Child Theme Inheritance](#child-theme-inheritance)
6. [Plural Forms](#plural-forms)
7. [RTL Language Support](#rtl-language-support)
8. [Best Practices](#best-practices)

## 🌍 Localization Fundamentals

### Understanding Webasyst Localization System

Webasyst supports two primary localization methods:

1. **theme.xml locales** - Primary method for theme strings
2. **Locale files (.po/.mo)** - Additional translation support

### Locale Naming Convention

```
Locale Format: language_TERRITORY
Examples:
- en_US (English - United States)
- ru_RU (Russian - Russia)
- de_DE (German - Germany)
- fr_FR (French - France)
- zh_CN (Chinese - China)
- ar_SA (Arabic - Saudi Arabia)
```

### Localization Functions in Templates

```smarty
{* Primary localization function *}
{_w('Add to Cart')}

{* Direct translation *}
[`Shopping Cart`]

{* Plural forms *}
{_w('item', 'items', $count)}

{* Context-specific translation *}
{_wp('button', 'Save')}
```

## 📝 Theme.xml Configuration

### Complete Locales Section

```xml
<?xml version="1.0" encoding="utf-8"?>
<theme id="waboot" app="shop">
    <n>Waboot</n>
    <description>Modern Webasyst theme with comprehensive localization support</description>
    <version>1.0.0</version>
    
    <!-- LOCALIZATION CONFIGURATION -->
    <locales>
        <!-- Navigation Elements -->
        <locale>
            <msgid>Home</msgid>
            <msgstr locale="ru_RU">Главная</msgstr>
            <msgstr locale="en_US">Home</msgstr>
            <msgstr locale="de_DE">Startseite</msgstr>
            <msgstr locale="fr_FR">Accueil</msgstr>
        </locale>
        
        <locale>
            <msgid>About</msgid>
            <msgstr locale="ru_RU">О нас</msgstr>
            <msgstr locale="en_US">About</msgstr>
            <msgstr locale="de_DE">Über uns</msgstr>
            <msgstr locale="fr_FR">À propos</msgstr>
        </locale>
        
        <!-- E-commerce Strings -->
        <locale>
            <msgid>Add to Cart</msgid>
            <msgstr locale="ru_RU">В корзину</msgstr>
            <msgstr locale="en_US">Add to Cart</msgstr>
            <msgstr locale="de_DE">In den Warenkorb</msgstr>
            <msgstr locale="fr_FR">Ajouter au panier</msgstr>
        </locale>
        
        <locale>
            <msgid>Shopping Cart</msgid>
            <msgstr locale="ru_RU">Корзина покупок</msgstr>
            <msgstr locale="en_US">Shopping Cart</msgstr>
            <msgstr locale="de_DE">Warenkorb</msgstr>
            <msgstr locale="fr_FR">Panier</msgstr>
        </locale>
        
        <!-- Plural Forms Support -->
        <locale>
            <msgid>item</msgid>
            <msgid_plural>items</msgid_plural>
            <!-- Russian: 3 plural forms -->
            <msgstr locale="ru_RU">товар</msgstr>
            <msgstr_plural locale="ru_RU">товара</msgstr_plural>
            <msgstr_plural2 locale="ru_RU">товаров</msgstr_plural2>
            <!-- English: 2 plural forms -->
            <msgstr locale="en_US">item</msgstr>
            <msgstr_plural locale="en_US">items</msgstr_plural>
            <!-- German: 2 plural forms -->
            <msgstr locale="de_DE">Artikel</msgstr>
            <msgstr_plural locale="de_DE">Artikel</msgstr_plural>
        </locale>
        
        <!-- Form Elements -->
        <locale>
            <msgid>Subscribe</msgid>
            <msgstr locale="ru_RU">Подписаться</msgstr>
            <msgstr locale="en_US">Subscribe</msgstr>
            <msgstr locale="de_DE">Abonnieren</msgstr>
            <msgstr locale="fr_FR">S'abonner</msgstr>
        </locale>
        
        <!-- Accessibility -->
        <locale>
            <msgid>Skip to main content</msgid>
            <msgstr locale="ru_RU">Перейти к основному содержимому</msgstr>
            <msgstr locale="en_US">Skip to main content</msgstr>
            <msgstr locale="de_DE">Zum Hauptinhalt springen</msgstr>
            <msgstr locale="fr_FR">Passer au contenu principal</msgstr>
        </locale>
    </locales>
    
    <!-- Rest of theme configuration -->
    <settings>
        <!-- Theme settings -->
    </settings>
</theme>
```

### Child Theme Localization

```xml
<!-- shop-themes/waboot-child/theme.xml -->
<?xml version="1.0" encoding="utf-8"?>
<theme id="waboot-child" app="shop" system="0" vendor="adgooroo">
    <n>Waboot Child Shop</n>
    <description>E-commerce child theme with inherited localization</description>
    <version>1.0.0</version>
    <parent_theme app="site">waboot</parent_theme>
    
    <!-- CHILD THEME SPECIFIC LOCALIZATION -->
    <locales>
        <!-- Shop-specific strings that override or extend parent -->
        <locale>
            <msgid>Add to Cart</msgid>
            <msgstr locale="ru_RU">Добавить в корзину</msgstr>
            <msgstr locale="en_US">Add to Cart</msgstr>
            <msgstr locale="de_DE">In den Warenkorb legen</msgstr>
        </locale>
        
        <locale>
            <msgid>Buy Now</msgid>
            <msgstr locale="ru_RU">Купить сейчас</msgstr>
            <msgstr locale="en_US">Buy Now</msgstr>
            <msgstr locale="de_DE">Jetzt kaufen</msgstr>
        </locale>
        
        <!-- Additional shop-specific translations -->
        <locale>
            <msgid>Quick Order</msgid>
            <msgstr locale="ru_RU">Быстрый заказ</msgstr>
            <msgstr locale="en_US">Quick Order</msgstr>
            <msgstr locale="de_DE">Schnellbestellung</msgstr>
        </locale>
    </locales>
</theme>
```

## 📁 Directory Structure

### Complete Locale Directory Structure

```
waboot/
├── theme.xml                           # ✅ Primary localization
├── locale/                             # ✅ Additional translation files
│   ├── en_US/LC_MESSAGES/
│   │   ├── theme.po                   # ✅ Source translation file
│   │   └── theme.mo                   # ✅ Compiled translation file
│   ├── ru_RU/LC_MESSAGES/
│   │   ├── theme.po
│   │   └── theme.mo
│   ├── de_DE/LC_MESSAGES/
│   │   ├── theme.po
│   │   └── theme.mo
│   └── fr_FR/LC_MESSAGES/
│       ├── theme.po
│       └── theme.mo
├── templates/
│   ├── layout.html                    # ✅ Localized templates
│   ├── header.html
│   └── footer.html
└── css/
    ├── waboot.css                     # ✅ Default styles
    └── waboot-rtl.css                 # ✅ RTL language support
```

### Locale File Example (.po format)

**waboot/locale/ru_RU/LC_MESSAGES/theme.po:**
```po
# Waboot Theme - Russian Translation
msgid ""
msgstr ""
"Project-Id-Version: Waboot 1.0.0\n"
"Language: ru_RU\n"
"MIME-Version: 1.0\n"
"Content-Type: text/plain; charset=UTF-8\n"
"Content-Transfer-Encoding: 8bit\n"
"Plural-Forms: nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);\n"

msgid "Add to Cart"
msgstr "В корзину"

msgid "Shopping Cart"
msgstr "Корзина покупок"

msgid "Search products..."
msgstr "Поиск товаров..."

# Plural forms
msgid "item"
msgid_plural "items"
msgstr[0] "товар"
msgstr[1] "товара"  
msgstr[2] "товаров"
```

## 🎨 Template Localization

### Basic Template Localization

```smarty
{* waboot/templates/header.html *}
<header class="site-header">
    <nav class="main-navigation">
        <ul>
            <li><a href="/">{_w('Home')}</a></li>
            <li><a href="/about/">{_w('About')}</a></li>
            <li><a href="/contact/">{_w('Contact')}</a></li>
        </ul>
        
        {* Search form with localized placeholder *}
        <form class="search-form" action="/search/" method="get">
            <input type="text" 
                   name="query" 
                   placeholder="{_w('Search products...')}"
                   aria-label="{_w('Search')}" />
            <button type="submit">{_w('Search')}</button>
        </form>
    </nav>
</header>
```

### E-commerce Template Localization

```smarty
{* shop-themes/waboot-child/templates/molecules/product-card.html *}
<div class="product-card" data-product-id="{$product.id}">
    <div class="product-image">
        <img src="{$product.image_url}" 
             alt="{$product.name|escape}" />
    </div>
    
    <div class="product-info">
        <h3 class="product-title">
            <a href="{$product.url}">{$product.name|escape}</a>
        </h3>
        
        <div class="product-price">
            <span class="price">{$product.price}</span>
            {if $product.compare_price}
                <span class="compare-price">{$product.compare_price}</span>
            {/if}
        </div>
        
        <div class="product-actions">
            <button type="button" 
                    class="btn btn-primary add-to-cart"
                    data-product-id="{$product.id}">
                {_w('Add to Cart')}
            </button>
            
            <button type="button" 
                    class="btn btn-outline-secondary wishlist"
                    title="{_w('Add to Wishlist')}">
                {_w('Add to Wishlist')}
            </button>
            
            <button type="button" 
                    class="btn btn-outline-info quick-view"
                    data-product-id="{$product.id}">
                {_w('Quick View')}
            </button>
        </div>
    </div>
</div>
```

### Form Localization

```smarty
{* waboot/templates/molecules/contact-form.html *}
<form class="contact-form" method="post" action="/contact/">
    {$wa->csrf()}
    
    <div class="form-group">
        <label for="name">{_w('Your Name')}*</label>
        <input type="text" 
               id="name" 
               name="name" 
               required
               placeholder="{_w('Enter your name')}" />
    </div>
    
    <div class="form-group">
        <label for="email">{_w('Email Address')}*</label>
        <input type="email" 
               id="email" 
               name="email" 
               required
               placeholder="{_w('Your email address')}" />
    </div>
    
    <div class="form-group">
        <label for="message">{_w('Message')}*</label>
        <textarea id="message" 
                  name="message" 
                  rows="5" 
                  required
                  placeholder="{_w('Type your message here...')}"></textarea>
    </div>
    
    <div class="form-actions">
        <button type="submit" class="btn btn-primary">
            {_w('Send Message')}
        </button>
    </div>
</form>
```

## 🔗 Child Theme Inheritance

### Understanding Localization Inheritance

Child themes inherit localization from parent themes but can override specific strings:

```
Inheritance Chain:
waboot (parent) → waboot-child (shop) → waboot-blog (blog)

Localization Resolution:
1. Check child theme theme.xml <locales>
2. Check child theme locale/ files  
3. Check parent theme theme.xml <locales>
4. Check parent theme locale/ files
5. Fall back to original string
```

### Child Theme Override Example

```xml
<!-- Parent theme (waboot) defines: -->
<locale>
    <msgid>Add to Cart</msgid>
    <msgstr locale="en_US">Add to Cart</msgstr>
    <msgstr locale="ru_RU">В корзину</msgstr>
</locale>

<!-- Child theme (waboot-child) overrides: -->
<locale>
    <msgid>Add to Cart</msgid>
    <msgstr locale="en_US">Add to Cart</msgstr>
    <msgstr locale="ru_RU">Добавить в корзину</msgstr>  <!-- More specific translation -->
</locale>
```

### Child Theme Specific Strings

```xml
<!-- Child theme adds new strings not in parent -->
<locale>
    <msgid>Quick Order</msgid>
    <msgstr locale="en_US">Quick Order</msgstr>
    <msgstr locale="ru_RU">Быстрый заказ</msgstr>
</locale>

<locale>
    <msgid>Product Comparison</msgid>
    <msgstr locale="en_US">Product Comparison</msgstr>
    <msgstr locale="ru_RU">Сравнение товаров</msgstr>
</locale>
```

## 🔢 Plural Forms

### Understanding Plural Forms

Different languages have different plural rules:

- **English**: 2 forms (1 item, 2+ items)
- **Russian**: 3 forms (1, 2-4, 5+)  
- **Polish**: 3 forms (complex rules)
- **Arabic**: 6 forms (very complex)

### Implementing Plural Forms

```xml
<!-- theme.xml plural configuration -->
<locale>
    <msgid>product</msgid>
    <msgid_plural>products</msgid_plural>
    
    <!-- English (2 forms) -->
    <msgstr locale="en_US">product</msgstr>
    <msgstr_plural locale="en_US">products</msgstr_plural>
    
    <!-- Russian (3 forms) -->
    <msgstr locale="ru_RU">товар</msgstr>           <!-- 1, 21, 31, ... -->
    <msgstr_plural locale="ru_RU">товара</msgstr_plural>     <!-- 2-4, 22-24, ... -->
    <msgstr_plural2 locale="ru_RU">товаров</msgstr_plural2>  <!-- 0, 5-20, 25-30, ... -->
    
    <!-- German (2 forms) -->
    <msgstr locale="de_DE">Produkt</msgstr>
    <msgstr_plural locale="de_DE">Produkte</msgstr_plural>
</locale>
```

### Using Plurals in Templates

```smarty
{* Display product count with proper plural form *}
<div class="search-results">
    {assign var="count" value=$products|count}
    <h2>
        {_w('product', 'products', $count)} {_w('found')}: {$count}
    </h2>
    
    {* Alternative syntax *}
    <p>
        {if $count == 1}
            {_w('One product found')}
        {else}
            {$count} {_w('product', 'products', $count)} {_w('found')}
        {/if}
    </p>
</div>
```

### JavaScript Plural Support

```javascript
// Alpine.js component with plural support
Alpine.data('productCounter', () => ({
    count: 0,
    
    getCountText() {
        // Simplified plural logic for demonstration
        if (this.count === 1) {
            return this.count + ' ' + this.translate('product');
        } else {
            return this.count + ' ' + this.translate('products');
        }
    },
    
    translate(key) {
        const translations = {
            'product': '{_w("product")}',
            'products': '{_w("products")}'
        };
        return translations[key] || key;
    }
}));
```

## 🔄 RTL Language Support

### RTL Detection in Templates

```smarty
{* waboot/templates/layout.html *}
<!DOCTYPE html>
<html lang="{$locale}" 
      {if $wa->getLocale() == 'ar' || $wa->getLocale() == 'he' || $wa->getLocale() == 'fa'}dir="rtl"{/if}>
<head>
    <meta charset="utf-8">
    <title>{$wa_title|escape}</title>
    
    {* Load default styles *}
    <link rel="stylesheet" href="{$wa_theme_url}css/waboot.css">
    
    {* Load RTL styles for RTL languages *}
    {if $wa->getLocale() == 'ar' || $wa->getLocale() == 'he' || $wa->getLocale() == 'fa'}
        <link rel="stylesheet" href="{$wa_theme_url}css/waboot-rtl.css">
    {/if}
</head>
<body class="locale-{$wa->getLocale()} {if $wa->getLocale() == 'ar' || $wa->getLocale() == 'he' || $wa->getLocale() == 'fa'}rtl{else}ltr{/if}">
    <!-- Content -->
</body>
</html>
```

### RTL CSS Implementation

```css
/* waboot/css/waboot-rtl.css */

/* Reverse text alignment */
.rtl {
    direction: rtl;
    text-align: right;
}

/* Reverse float directions */
.rtl .float-left {
    float: right;
}

.rtl .float-right {
    float: left;
}

/* Reverse margins and padding */
.rtl .ml-3 {
    margin-left: 0;
    margin-right: 1rem;
}

.rtl .mr-3 {
    margin-right: 0;
    margin-left: 1rem;
}

/* Reverse navigation */
.rtl .navbar-nav {
    flex-direction: row-reverse;
}

/* Reverse breadcrumbs */
.rtl .breadcrumb-item + .breadcrumb-item::before {
    content: "\\";
}

/* Reverse product grid */
.rtl .product-grid {
    direction: rtl;
}

.rtl .product-card {
    text-align: right;
}

/* Bootstrap RTL overrides */
.rtl .text-left {
    text-align: right !important;
}

.rtl .text-right {
    text-align: left !important;
}
```

### Alpine.js RTL Support

```javascript
// Detect RTL and adjust behavior
Alpine.data('rtlAware', () => ({
    isRTL: document.documentElement.dir === 'rtl',
    
    init() {
        if (this.isRTL) {
            // Adjust component behavior for RTL
            this.adjustForRTL();
        }
    },
    
    adjustForRTL() {
        // RTL-specific logic
        console.log('Adjusting for RTL layout');
    }
}));
```

## ✅ Best Practices

### 1. Localization Strategy

```smarty
{* ✅ DO: Use semantic translation keys *}
{_w('Add to Cart')}
{_w('Shopping Cart')}
{_w('Checkout')}

{* ❌ DON'T: Use cryptic keys *}
{_w('btn_001')}
{_w('lbl_cart')}
```

### 2. Context-Aware Translations

```xml
<!-- Provide context for translators -->
<locale>
    <msgid>Close</msgid>
    <msgctxt>button</msgctxt>  <!-- Context: this is a button -->
    <msgstr locale="ru_RU">Закрыть</msgstr>
    <msgstr locale="en_US">Close</msgstr>
</locale>

<locale>
    <msgid>Close</msgid>
    <msgctxt>adjective</msgctxt>  <!-- Context: this is an adjective -->
    <msgstr locale="ru_RU">Близкий</msgstr>
    <msgstr locale="en_US">Close</msgstr>
</locale>
```

### 3. Template Organization

```smarty
{* Group related translations *}
<div class="product-actions">
    {assign var="add_to_cart_text" value="{_w('Add to Cart')}"}
    {assign var="wishlist_text" value="{_w('Add to Wishlist')}"}
    {assign var="compare_text" value="{_w('Add to Compare')}"}
    
    <button class="add-to-cart" title="{$add_to_cart_text}">
        {$add_to_cart_text}
    </button>
    <button class="wishlist" title="{$wishlist_text}">
        {$wishlist_text}
    </button>
    <button class="compare" title="{$compare_text}">
        {$compare_text}
    </button>
</div>
```

### 4. Fallback Strategy

```smarty
{* Provide fallbacks for missing translations *}
{assign var="translated_text" value="{_w('Custom String')}"}
{if $translated_text == 'Custom String'}
    {* Translation not found, use default *}
    {assign var="translated_text" value="Default Text"}
{/if}
<span>{$translated_text}</span>
```

### 5. Child Theme Localization

```xml
<!-- Only override what you need to change -->
<locales>
    <!-- Override parent translation with more specific version -->
    <locale>
        <msgid>Add to Cart</msgid>
        <msgstr locale="ru_RU">Добавить в корзину</msgstr>  <!-- More formal -->
        <msgstr locale="en_US">Add to Cart</msgstr>
    </locale>
    
    <!-- Add new child-specific strings -->
    <locale>
        <msgid>Express Checkout</msgid>
        <msgstr locale="ru_RU">Быстрое оформление</msgstr>
        <msgstr locale="en_US">Express Checkout</msgstr>
    </locale>
</locales>
```

### 6. Performance Considerations

```smarty
{* Cache frequently used translations *}
{function name="cached_translations"}
    {static $translations = null}
    {if $translations === null}
        {$translations = array(
            'add_to_cart' => "{_w('Add to Cart')}",
            'wishlist' => "{_w('Add to Wishlist')}",
            'compare' => "{_w('Compare')}"
        )}
    {/if}
    {return $translations}
{/function}

{* Use cached translations *}
{$t = cached_translations()}
<button>{$t.add_to_cart}</button>
```

### 7. Testing Localization

```bash
# Generate .mo files from .po files
msgfmt locale/ru_RU/LC_MESSAGES/theme.po -o locale/ru_RU/LC_MESSAGES/theme.mo

# Validate .po files
msgfmt --check locale/ru_RU/LC_MESSAGES/theme.po

# Extract translatable strings
find templates/ -name "*.html" -exec grep -h "{_w(" {} \; | sort | uniq
```

## 🔧 Tools and Utilities

### Translation Workflow

1. **Extract strings** from templates
2. **Update .po files** with new strings
3. **Translate** strings in .po files
4. **Compile** .mo files from .po files
5. **Test** in different locales

### Useful Commands

```bash
# Find all translatable strings
grep -r "{_w(" templates/ | grep -o "{_w('[^']*')" | sort | uniq

# Count translation coverage
grep -c "msgstr" locale/ru_RU/LC_MESSAGES/theme.po

# Validate theme.xml locales
xmllint --noout --schema theme.xsd theme.xml
```

## 📚 Additional Resources

- [Webasyst Localization Documentation](https://www.webasyst.com/developers/)
- [GNU gettext Manual](https://www.gnu.org/software/gettext/manual/)
- [Unicode CLDR](http://cldr.unicode.org/)
- [RTL Web Development](https://rtlstyling.com/)

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Maintainer:** Waboot Team