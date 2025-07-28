# Webasyst Theme Security Best Practices

## Overview

This document outlines essential security best practices for developing secure Webasyst themes and applications. Following these guidelines helps protect against common vulnerabilities and ensures compliance with modern web security standards.

## 📋 Table of Contents

1. [Template Security](#template-security)
2. [CSRF Protection](#csrf-protection)
3. [Directory Protection](#directory-protection)
4. [Input Validation](#input-validation)
5. [Output Escaping](#output-escaping)
6. [Configuration Security](#configuration-security)
7. [Headers Security](#headers-security)
8. [Alpine.js Security](#alpinejs-security)

## 🔒 Template Security

### 1. Always Escape Output

**❌ VULNERABLE:**
```smarty
<h1>{$title}</h1>
<p>{$content}</p>
<a href="{$url}">Link</a>
```

**✅ SECURE:**
```smarty
<h1>{$title|escape}</h1>
<p>{$content|escape}</p>
<a href="{$url|escape}">Link</a>
```

### 2. Use Context-Appropriate Escaping

```smarty
{* HTML Content *}
<div>{$html_content|escape}</div>

{* HTML Attributes *}
<input type="text" value="{$user_input|escape}" />

{* JavaScript Context *}
<script>
var data = '{$js_data|escape:'javascript'}';
</script>

{* URL Context *}
<a href="{$dynamic_url|escape:'url'}">Link</a>
```

### 3. Sanitize HTML Content

For user-generated HTML content:
```smarty
{* Use Webasyst's HTML sanitization *}
{$user_html_content|wa_sanitize_html}

{* Or escape completely *}
{$user_html_content|escape}
```

## 🛡️ CSRF Protection

### 1. Include CSRF Tokens in ALL Forms

**✅ REQUIRED in all POST forms:**
```smarty
<form method="post" action="{$form_action}">
    {$wa->csrf()}
    <input type="text" name="username" />
    <input type="submit" value="Submit" />
</form>
```

### 2. CSRF in AJAX Requests

```javascript
// Get CSRF token from meta tag or form
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

// Include in AJAX requests
fetch('/api/endpoint', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
    },
    body: JSON.stringify(data)
});
```

### 3. Alpine.js Forms with CSRF

```html
<form @submit.prevent="submitForm" x-data="contactForm">
    {$wa->csrf()}
    <input type="text" x-model="name" required />
    <button type="submit">Send</button>
</form>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('contactForm', () => ({
        name: '',
        submitForm() {
            const formData = new FormData();
            formData.append('name', this.name);
            formData.append('csrf_token', '{$wa->csrf()}');
            
            fetch('/contact', {
                method: 'POST',
                body: formData
            });
        }
    }));
});
</script>
```

## 🔐 Directory Protection

### 1. Protect Sensitive Directories

Create `.htaccess` files in sensitive directories:

**waboot/lib/.htaccess:**
```apache
# Deny access to lib directory
<RequireAll>
    Require all denied
</RequireAll>

# Apache 2.2 fallback
<IfModule !mod_authz_core.c>
    Order deny,allow
    Deny from all
</IfModule>
```

**waboot/locale/.htaccess:**
```apache
# Deny access to locale directory
<RequireAll>
    Require all denied
</RequireAll>

# Prevent access to translation files
<FilesMatch "\.(po|mo|pot)$">
    Require all denied
</FilesMatch>
```

### 2. Protected Directory Structure

```
waboot/
├── lib/              # ✅ Protected by .htaccess
├── locale/           # ✅ Protected by .htaccess
├── config/           # ✅ Protected by .htaccess
├── templates/        # ✅ Public (safe content)
├── css/              # ✅ Public (safe content)
├── js/               # ✅ Public (safe content)
└── img/              # ✅ Public (safe content)
```

## ✅ Input Validation

### 1. Server-Side Validation

```php
// In controller/action files
class ContactAction extends waViewAction
{
    public function execute()
    {
        $name = waRequest::post('name', '', waRequest::TYPE_STRING_TRIM);
        $email = waRequest::post('email', '', waRequest::TYPE_STRING_TRIM);
        
        // Validate required fields
        if (empty($name)) {
            throw new waException('Name is required');
        }
        
        // Validate email format
        if (!waValid::email($email)) {
            throw new waException('Invalid email format');
        }
        
        // Continue processing...
    }
}
```

### 2. Client-Side Validation (Alpine.js)

```html
<div x-data="formValidator">
    <form @submit.prevent="validateAndSubmit">
        <input 
            type="email" 
            x-model="email" 
            @blur="validateEmail"
            :class="{'error': emailError}"
        />
        <span x-show="emailError" x-text="emailError"></span>
        
        <button type="submit" :disabled="!isValid">Submit</button>
    </form>
</div>

<script>
Alpine.data('formValidator', () => ({
    email: '',
    emailError: '',
    
    validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.emailError = emailRegex.test(this.email) ? '' : 'Invalid email format';
    },
    
    get isValid() {
        return this.email && !this.emailError;
    },
    
    validateAndSubmit() {
        this.validateEmail();
        if (this.isValid) {
            // Submit form
        }
    }
}));
</script>
```

## 🔍 Output Escaping

### 1. Smarty Escape Modifiers

```smarty
{* Default HTML escaping *}
{$variable|escape}

{* Context-specific escaping *}
{$variable|escape:'html'}        <!-- HTML content -->
{$variable|escape:'htmlall'}     <!-- HTML + special chars -->
{$variable|escape:'url'}         <!-- URL encoding -->
{$variable|escape:'javascript'}  <!-- JavaScript string -->
{$variable|escape:'css'}         <!-- CSS values -->
```

### 2. JSON-LD Security

```smarty
<script type="application/ld+json">
{
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "{$product.name|escape:'javascript'}",
    "description": "{$product.summary|escape:'javascript'}",
    "url": "{$product.frontend_url|escape:'javascript'}"
}
</script>
```

## ⚙️ Configuration Security

### 1. app.php Security Settings

```php
return array(
    'name'        => 'Site',
    'csrf'        => true,        // ✅ CRITICAL: Enable CSRF protection
    'rights'      => true,        // ✅ Enable rights management
    'auth'        => true,        // ✅ Enable authentication
    
    // Security headers
    'security_headers' => array(
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options' => 'DENY',
        'X-XSS-Protection' => '1; mode=block',
        'Referrer-Policy' => 'strict-origin-when-cross-origin'
    )
);
```

### 2. Environment-Specific Settings

```php
// Different settings for production vs development
if (wa()->getEnv() === 'production') {
    $config['debug'] = false;
    $config['error_reporting'] = false;
} else {
    $config['debug'] = true;
    $config['error_reporting'] = true;
}
```

## 🛡️ Headers Security

### 1. Security Headers in Templates

```smarty
{* In layout.html head section *}
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
<meta http-equiv="X-XSS-Protection" content="1; mode=block">
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">

{* Content Security Policy *}
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### 2. HSTS and Secure Cookies

```apache
# In .htaccess (if HTTPS is enabled)
<IfModule mod_headers.c>
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>
```

## ⚡ Alpine.js Security

### 1. Secure Data Handling

```javascript
// ✅ SECURE: Validate and sanitize user input
Alpine.data('secureComponent', () => ({
    userInput: '',
    
    validateInput(input) {
        // Sanitize input
        return input.trim().replace(/[<>]/g, '');
    },
    
    submitData() {
        const sanitized = this.validateInput(this.userInput);
        if (sanitized.length > 0) {
            this.sendToServer(sanitized);
        }
    }
}));
```

### 2. Prevent XSS in Alpine.js

```html
<!-- ❌ VULNERABLE: Direct HTML insertion -->
<div x-html="userContent"></div>

<!-- ✅ SECURE: Use text binding -->
<div x-text="userContent"></div>

<!-- ✅ SECURE: Sanitize before HTML insertion -->
<div x-html="sanitizeHTML(userContent)"></div>
```

### 3. Secure AJAX with Alpine.js

```javascript
Alpine.data('secureAjax', () => ({
    async makeRequest(endpoint, data) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error('Request failed');
            }
            
            return response.json();
        } catch (error) {
            console.error('Request error:', error);
            throw error;
        }
    },
    
    getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.content || '';
    }
}));
```

## 🔍 Security Testing Checklist

### ✅ Template Security
- [ ] All user output is properly escaped
- [ ] Context-appropriate escaping is used
- [ ] HTML content is sanitized when necessary
- [ ] No direct database queries in templates

### ✅ CSRF Protection
- [ ] All forms include CSRF tokens
- [ ] AJAX requests include CSRF tokens
- [ ] State-changing operations require POST method
- [ ] CSRF tokens are validated server-side

### ✅ Directory Protection
- [ ] `.htaccess` files protect sensitive directories
- [ ] Configuration files are not web-accessible
- [ ] Locale files are protected from direct access
- [ ] Library files are not accessible via web

### ✅ Input/Output
- [ ] All input is validated server-side
- [ ] Client-side validation is implemented
- [ ] Output escaping prevents XSS
- [ ] SQL injection prevention is in place

### ✅ Headers and Configuration
- [ ] Security headers are configured
- [ ] CSRF protection is enabled in app.php
- [ ] Error reporting is disabled in production
- [ ] Debug mode is disabled in production

## 🚨 Common Vulnerabilities to Avoid

### 1. XSS (Cross-Site Scripting)
```smarty
{* ❌ VULNERABLE *}
<div>{$user_content}</div>

{* ✅ SECURE *}
<div>{$user_content|escape}</div>
```

### 2. CSRF (Cross-Site Request Forgery)
```smarty
{* ❌ VULNERABLE *}
<form method="post">
    <input type="text" name="data" />
</form>

{* ✅ SECURE *}
<form method="post">
    {$wa->csrf()}
    <input type="text" name="data" />
</form>
```

### 3. Information Disclosure
```apache
# ❌ VULNERABLE: Expose sensitive files
# (no .htaccess protection)

# ✅ SECURE: Protect sensitive directories
<RequireAll>
    Require all denied
</RequireAll>
```

### 4. Insecure Direct Object References
```php
// ❌ VULNERABLE: No access control
$file = waRequest::get('file');
readfile('/uploads/' . $file);

// ✅ SECURE: Validate and authorize
$file = waRequest::get('file', '', waRequest::TYPE_STRING_TRIM);
if (wa()->getUser()->isAuth() && $this->validateFile($file)) {
    readfile('/uploads/' . $file);
}
```

## 📚 Additional Resources

- [OWASP Top 10 Web Application Security Risks](https://owasp.org/www-project-top-ten/)
- [Webasyst Framework Security Guide](https://www.webasyst.com/developers/)
- [Content Security Policy (CSP) Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Alpine.js Security Best Practices](https://alpinejs.dev/advanced/csp)

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Maintainer:** Waboot Team