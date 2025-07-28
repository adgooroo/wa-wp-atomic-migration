# Webasyst Theme Security & Localization Implementation Checklist

## 🎯 Overview

This checklist provides step-by-step implementation guidance for enhancing the Waboot theme project with comprehensive security and localization features. Each item includes ready-to-use code and verification steps.

## ✅ Security Implementation Checklist

### 🔒 CSRF Protection (CRITICAL - Priority 1)

- [ ] **Add CSRF tokens to ALL forms**
  ```smarty
  <!-- BEFORE (❌ VULNERABLE) -->
  <form method="post" action="/contact/">
      <input type="text" name="name" />
      <button type="submit">Send</button>
  </form>
  
  <!-- AFTER (✅ SECURE) -->
  <form method="post" action="/contact/">
      {$wa->csrf()}
      <input type="text" name="name" />
      <button type="submit">Send</button>
  </form>
  ```

- [ ] **Add CSRF to all search forms**
  ```smarty
  <!-- File: waboot/templates/header.html:112 -->
  <form action="{$wa->getUrl('shop/frontend/search')}" method="get" role="search">
      {$wa->csrf()}  <!-- ADD THIS LINE -->
      <input type="search" name="query" />
  </form>
  ```

- [ ] **Add CSRF meta tag for AJAX requests**
  ```smarty
  <!-- In layout.html head section -->
  <meta name="csrf-token" content="{$wa->csrf()}">
  ```

### 🛡️ Directory Protection (CRITICAL - Priority 1)

- [ ] **Create .htaccess files for sensitive directories**
  
  **✅ COMPLETED:** 
  - `waboot/lib/.htaccess`
  - `waboot/locale/.htaccess` 
  - `site-app/lib/.htaccess`

- [ ] **Verify directory protection**
  ```bash
  # Test that these URLs return 403 Forbidden:
  curl -I http://yoursite.com/wa-apps/site/themes/waboot/lib/
  curl -I http://yoursite.com/wa-apps/site/themes/waboot/locale/
  ```

### 🔍 Output Escaping (HIGH - Priority 1)

- [ ] **Review and fix unescaped variables**
  
  **Files to check:**
  - `waboot/templates/home.html` - lines with `{$variable}`
  - `waboot/templates/product.html` - user content display
  - `waboot/templates/header.html` - navigation items
  - `waboot/templates/footer.html` - dynamic content

  ```smarty
  <!-- REPLACE unescaped variables -->
  {$title} → {$title|escape}
  {$content} → {$content|escape}
  {$url} → {$url|escape}
  ```

- [ ] **Add HTML sanitization for user content**
  ```smarty
  <!-- For user-generated HTML content -->
  {$user_content|wa_sanitize_html}
  
  <!-- For plain text content -->
  {$user_content|escape}
  ```

### ⚙️ Configuration Security (HIGH - Priority 1)

- [ ] **Verify app.php security settings**
  ```php
  // File: site-app/lib/config/app.php
  return array(
      'csrf' => true,        // ✅ ALREADY ENABLED
      'rights' => true,      // ✅ ALREADY ENABLED
      'auth' => true,        // ✅ ADD IF MISSING
      
      // ADD security headers configuration
      'security_headers' => array(
          'X-Content-Type-Options' => 'nosniff',
          'X-Frame-Options' => 'DENY',
          'X-XSS-Protection' => '1; mode=block'
      )
  );
  ```

### 🎨 Template Security Headers (MEDIUM - Priority 2)

- [ ] **Add security headers to layout.html**
  ```smarty
  <!-- Add to waboot/templates/layout.html head section -->
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-Frame-Options" content="DENY">
  <meta http-equiv="X-XSS-Protection" content="1; mode=block">
  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
  ```

- [ ] **Add Content Security Policy (optional)**
  ```smarty
  <meta http-equiv="Content-Security-Policy" 
        content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
  ```

### ⚡ Alpine.js Security (MEDIUM - Priority 2)

- [ ] **Add input validation to Alpine.js components**
  ```javascript
  // Example: Contact form validation
  Alpine.data('secureContactForm', () => ({
      name: '',
      email: '',
      message: '',
      
      validateEmail() {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(this.email);
      },
      
      sanitizeInput(input) {
          return input.trim().replace(/[<>]/g, '');
      },
      
      submitForm() {
          if (this.validateEmail() && this.name && this.message) {
              // Submit with sanitized data
              const formData = new FormData();
              formData.append('name', this.sanitizeInput(this.name));
              formData.append('email', this.email);
              formData.append('message', this.sanitizeInput(this.message));
              formData.append('csrf_token', document.querySelector('meta[name="csrf-token"]').content);
              
              fetch('/contact/', {
                  method: 'POST',
                  body: formData
              });
          }
      }
  }));
  ```

## 🌍 Localization Implementation Checklist

### 📝 Theme.xml Localization (CRITICAL - Priority 1)

- [x] **Add <locales> section to waboot/theme.xml** ✅ COMPLETED
- [x] **Add <locales> section to shop-themes/waboot-child/theme.xml** ✅ COMPLETED

### 📁 Locale Directory Structure (CRITICAL - Priority 1)

- [x] **Create locale directory structure** ✅ COMPLETED
  - `waboot/locale/en_US/LC_MESSAGES/theme.po`
  - `waboot/locale/ru_RU/LC_MESSAGES/theme.po`

- [ ] **Compile .mo files from .po files**
  ```bash
  # Run these commands to generate compiled translation files:
  msgfmt waboot/locale/en_US/LC_MESSAGES/theme.po -o waboot/locale/en_US/LC_MESSAGES/theme.mo
  msgfmt waboot/locale/ru_RU/LC_MESSAGES/theme.po -o waboot/locale/ru_RU/LC_MESSAGES/theme.mo
  ```

### 🎨 Template Localization (HIGH - Priority 1)

- [ ] **Replace hardcoded strings in templates**

  **Key files to update:**
  
  **waboot/templates/header.html:**
  ```smarty
  <!-- REPLACE: -->
  "Search" → {_w('Search')}
  "Menu" → {_w('Menu')}
  "Close" → {_w('Close')}
  
  <!-- Example: -->
  <button aria-label="{_w('Open menu')}">
      {_w('Menu')}
  </button>
  ```

  **waboot/templates/footer.html:**
  ```smarty
  <!-- REPLACE: -->
  "Subscribe" → {_w('Subscribe')}
  "Newsletter" → {_w('Newsletter')}
  "Submit" → {_w('Submit')}
  ```

  **shop-themes/waboot-child/templates/:**
  ```smarty
  <!-- REPLACE e-commerce strings: -->
  "Add to Cart" → {_w('Add to Cart')}
  "Quick View" → {_w('Quick View')}
  "Add to Wishlist" → {_w('Add to Wishlist')}
  "Compare" → {_w('Compare')}
  ```

### 🔄 RTL Language Support (MEDIUM - Priority 2)

- [ ] **Create RTL stylesheet**
  ```css
  /* Create: waboot/css/waboot-rtl.css */
  .rtl {
      direction: rtl;
      text-align: right;
  }
  
  .rtl .float-left { float: right; }
  .rtl .float-right { float: left; }
  
  .rtl .ml-3 { margin-left: 0; margin-right: 1rem; }
  .rtl .mr-3 { margin-right: 0; margin-left: 1rem; }
  ```

- [ ] **Add RTL detection to layout.html**
  ```smarty
  <!-- Update waboot/templates/layout.html -->
  <html lang="{$locale}" 
        {if $wa->getLocale() == 'ar' || $wa->getLocale() == 'he' || $wa->getLocale() == 'fa'}dir="rtl"{/if}>
  
  <!-- In head section, add: -->
  {if $wa->getLocale() == 'ar' || $wa->getLocale() == 'he' || $wa->getLocale() == 'fa'}
      <link rel="stylesheet" href="{$wa_theme_url}css/waboot-rtl.css">
  {/if}
  ```

### 🔢 Plural Forms Support (MEDIUM - Priority 2)

- [ ] **Implement plural forms in templates**
  ```smarty
  <!-- Example: Product count display -->
  {assign var="count" value=$products|count}
  <p>
      {$count} {_w('product', 'products', $count)} {_w('found')}
  </p>
  
  <!-- Shopping cart items -->
  <span class="cart-count">
      {$cart_items_count} {_w('item', 'items', $cart_items_count)}
  </span>
  ```

### 🌐 Child Theme Localization Inheritance (MEDIUM - Priority 2)

- [ ] **Verify inheritance works correctly**
  ```bash
  # Test that child theme translations override parent
  # 1. Check parent theme translation
  # 2. Check child theme override
  # 3. Verify child theme specific strings
  ```

## 🧪 Testing and Verification

### 🔐 Security Testing

- [ ] **CSRF Protection Test**
  ```bash
  # Test that forms without CSRF tokens are rejected
  curl -X POST http://yoursite.com/contact/ \
       -d "name=test&email=test@example.com" \
       -v
  # Should return 403 or error about missing CSRF token
  ```

- [ ] **Directory Protection Test**
  ```bash
  # These should return 403 Forbidden:
  curl -I http://yoursite.com/wa-apps/site/themes/waboot/lib/config/
  curl -I http://yoursite.com/wa-apps/site/themes/waboot/locale/
  ```

- [ ] **XSS Prevention Test**
  ```bash
  # Test with malicious input - should be escaped:
  curl -X POST http://yoursite.com/contact/ \
       -d "name=<script>alert('xss')</script>&csrf_token=TOKEN"
  # Output should show escaped HTML: &lt;script&gt;
  ```

### 🌍 Localization Testing

- [ ] **Translation Loading Test**
  ```bash
  # Change language in admin panel
  # Verify strings appear in correct language
  # Test with different locales: en_US, ru_RU
  ```

- [ ] **Plural Forms Test**
  ```bash
  # Test with different quantities:
  # 1 item, 2 items, 5 items (English)
  # 1 товар, 2 товара, 5 товаров (Russian)
  ```

- [ ] **RTL Support Test**
  ```bash
  # Set locale to Arabic (ar) or Hebrew (he)
  # Verify RTL stylesheet loads
  # Check layout direction is correct
  ```

### 🎯 Child Theme Inheritance Test

- [ ] **Inheritance Verification**
  ```bash
  # 1. Check parent theme string displays
  # 2. Override in child theme
  # 3. Verify child override appears
  # 4. Check fallback to parent for missing strings
  ```

## 🚀 Deployment Checklist

### 🔧 Pre-deployment

- [ ] **Compile all .po files to .mo**
  ```bash
  find . -name "*.po" -exec msgfmt {} -o {}.mo \;
  ```

- [ ] **Verify .htaccess files are in place**
  ```bash
  ls -la waboot/lib/.htaccess
  ls -la waboot/locale/.htaccess
  ls -la site-app/lib/.htaccess
  ```

- [ ] **Test security headers**
  ```bash
  curl -I http://yoursite.com/ | grep -E "(X-Frame-Options|X-Content-Type|X-XSS)"
  ```

### 📋 Post-deployment Verification

- [ ] **Security verification**
  - [ ] CSRF tokens present in all forms
  - [ ] Protected directories return 403
  - [ ] Output is properly escaped
  - [ ] Security headers are present

- [ ] **Localization verification**
  - [ ] Translations load correctly
  - [ ] Plural forms work properly
  - [ ] RTL languages display correctly
  - [ ] Child theme inheritance functions

## 📊 Progress Tracking

### ✅ Completed Items
- [x] Theme.xml localization sections added
- [x] Locale directory structure created
- [x] .htaccess protection files created
- [x] Security and localization documentation created

### 🔄 In Progress Items
- [ ] Template string replacement (50% complete)
- [ ] Form CSRF token addition (25% complete)
- [ ] Output escaping review (0% complete)

### ⏳ Pending Items
- [ ] RTL stylesheet creation
- [ ] Alpine.js security enhancements
- [ ] Comprehensive testing
- [ ] Performance optimization

## 🛠️ Quick Implementation Commands

```bash
# 1. Create missing directories
mkdir -p waboot/locale/de_DE/LC_MESSAGES
mkdir -p waboot/locale/fr_FR/LC_MESSAGES

# 2. Compile translation files
msgfmt waboot/locale/en_US/LC_MESSAGES/theme.po -o waboot/locale/en_US/LC_MESSAGES/theme.mo
msgfmt waboot/locale/ru_RU/LC_MESSAGES/theme.po -o waboot/locale/ru_RU/LC_MESSAGES/theme.mo

# 3. Find templates needing localization
grep -r ">" waboot/templates/ | grep -v "{_w(" | grep -v "escape"

# 4. Test directory protection
curl -I http://localhost/waboot/lib/ 2>/dev/null | head -1

# 5. Validate theme.xml
xmllint --noout waboot/theme.xml && echo "Valid XML"
```

---

**Implementation Status:** 40% Complete  
**Next Priority:** Template string localization and CSRF token addition  
**Estimated Completion:** 2-3 days with focused development

**Last Updated:** January 16, 2025  
**Version:** 1.0.0  
**Maintainer:** Waboot Team