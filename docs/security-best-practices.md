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
9. [File Security](#file-security)
10. [Session Security](#session-security)
11. [Database Security](#database-security)
12. [Logging Security](#logging-security)
13. [API Security](#api-security)

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

<script nonce="{$wa->cspNonce()}">
document.addEventListener('alpine:init', () => {
    Alpine.data('contactForm', () => ({
        name: '',
        submitForm() {
            const formData = new FormData();
            formData.append('name', this.name);
            formData.append('csrf_token', this.getCsrfToken());
            
            fetch('/contact', {
                method: 'POST',
                body: formData
            });
        },
        
        getCsrfToken() {
            return document.querySelector('meta[name="csrf-token"]')?.content || '';
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
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'nonce-{$wa->cspNonce()}'; style-src 'self' 'nonce-{$wa->cspNonce()}';">
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
        // Sanitize input - remove HTML tags and dangerous characters
        return input.trim().replace(/[<>]/g, '').replace(/javascript:/gi, '');
    },
    
    submitData() {
        const sanitized = this.validateInput(this.userInput);
        if (sanitized.length > 0 && sanitized.length <= 1000) { // Add length limit
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

<script nonce="{$wa->cspNonce()}">
function sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}
</script>
```

### 3. Secure AJAX with Alpine.js

```javascript
Alpine.data('secureAjax', () => ({
    async makeRequest(endpoint, data) {
        try {
            // Validate endpoint to prevent SSRF
            if (!this.isValidEndpoint(endpoint)) {
                throw new Error('Invalid endpoint');
            }
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.getCsrfToken(),
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(data),
                credentials: 'same-origin' // Prevent CSRF
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
    },
    
    isValidEndpoint(endpoint) {
        // Validate endpoint is relative and safe
        return endpoint.startsWith('/') && !endpoint.includes('..');
    }
}));
```

## 📁 File Security

### 1. Secure File Upload

```php
// In controller/action files
class FileUploadAction extends waViewAction
{
    public function execute()
    {
        $file = waRequest::file('upload');
        
        // Validate file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!in_array($file['type'], $allowedTypes)) {
            throw new waException('Invalid file type');
        }
        
        // Validate file size (max 5MB)
        if ($file['size'] > 5 * 1024 * 1024) {
            throw new waException('File too large');
        }
        
        // Validate file extension
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $allowedExtensions)) {
            throw new waException('Invalid file extension');
        }
        
        // Generate safe filename
        $filename = $this->generateSafeFilename($file['name']);
        
        // Move to secure upload directory
        $uploadDir = wa()->getDataPath('uploads/', true);
        $filepath = $uploadDir . $filename;
        
        if (move_uploaded_file($file['tmp_name'], $filepath)) {
            // Set proper permissions
            chmod($filepath, 0644);
            return $filename;
        }
        
        throw new waException('Upload failed');
    }
    
    private function generateSafeFilename($originalName)
    {
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        return uniqid() . '.' . $extension;
    }
}
```

### 2. Protect Upload Directories

**uploads/.htaccess:**
```apache
# Allow access only to image files
<FilesMatch "\.(jpg|jpeg|png|gif)$">
    Require all granted
</FilesMatch>

# Deny access to all other files
<FilesMatch "^(?!\.(jpg|jpeg|png|gif)$)">
    Require all denied
</FilesMatch>

# Prevent script execution
<FilesMatch "\.(php|php3|php4|php5|phtml|pl|py|jsp|asp|sh|cgi)$">
    Require all denied
</FilesMatch>
```

### 3. File Download Security

```php
// Secure file download
class FileDownloadAction extends waViewAction
{
    public function execute()
    {
        $filename = waRequest::get('file', '', waRequest::TYPE_STRING_TRIM);
        
        // Validate filename
        if (!preg_match('/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif|pdf)$/', $filename)) {
            throw new waException('Invalid filename');
        }
        
        // Check if user has access
        if (!$this->userHasAccess($filename)) {
            throw new waException('Access denied');
        }
        
        $filepath = wa()->getDataPath('uploads/' . $filename, true);
        
        if (!file_exists($filepath)) {
            throw new waException('File not found');
        }
        
        // Set proper headers
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Content-Length: ' . filesize($filepath));
        
        readfile($filepath);
        exit;
    }
    
    private function userHasAccess($filename)
    {
        // Implement access control logic
        return wa()->getUser()->isAuth();
    }
}
```

## 🔐 Session Security

### 1. Secure Session Configuration

```php
// In app.php
return array(
    'name'        => 'Site',
    'csrf'        => true,
    'rights'      => true,
    'auth'        => true,
    
    // Session security settings
    'session'     => array(
        'timeout' => 3600, // 1 hour
        'regenerate_id' => true,
        'secure_cookies' => true,
        'httponly_cookies' => true,
        'same_site' => 'Strict'
    )
);
```

### 2. Session Management

```php
// Secure session handling
class SecureSessionAction extends waViewAction
{
    public function execute()
    {
        // Regenerate session ID on login
        if (waRequest::post('login')) {
            session_regenerate_id(true);
        }
        
        // Validate session data
        if (!$this->validateSession()) {
            wa()->getUser()->logout();
            $this->redirect('/login');
        }
        
        // Set session timeout
        if (time() - $_SESSION['last_activity'] > 3600) {
            wa()->getUser()->logout();
            $this->redirect('/login');
        }
        
        $_SESSION['last_activity'] = time();
    }
    
    private function validateSession()
    {
        // Validate session integrity
        if (!isset($_SESSION['user_id']) || !isset($_SESSION['ip'])) {
            return false;
        }
        
        // Check IP address
        if ($_SESSION['ip'] !== $_SERVER['REMOTE_ADDR']) {
            return false;
        }
        
        return true;
    }
}
```

### 3. Session Fixation Protection

```php
// Prevent session fixation
class LoginAction extends waViewAction
{
    public function execute()
    {
        if (waRequest::post('login')) {
            // Regenerate session ID before setting user data
            session_regenerate_id(true);
            
            // Set session data
            $_SESSION['user_id'] = $user_id;
            $_SESSION['ip'] = $_SERVER['REMOTE_ADDR'];
            $_SESSION['last_activity'] = time();
            
            // Clear any existing session data
            session_unset();
            session_write_close();
            session_start();
        }
    }
}
```

## 🗄️ Database Security

### 1. Prepared Statements

```php
// Use prepared statements for all database queries
class SecureDatabaseAction extends waViewAction
{
    public function execute()
    {
        $user_id = waRequest::get('id', 0, waRequest::TYPE_INT);
        
        // ✅ SECURE: Use prepared statements
        $sql = "SELECT * FROM users WHERE id = ? AND active = 1";
        $stmt = wa()->getDb()->prepare($sql);
        $stmt->bind_param('i', $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // ❌ VULNERABLE: Direct string concatenation
        // $sql = "SELECT * FROM users WHERE id = $user_id";
    }
}
```

### 2. Input Validation for Database

```php
// Validate all database inputs
class DatabaseValidationAction extends waViewAction
{
    public function execute()
    {
        $email = waRequest::post('email', '', waRequest::TYPE_STRING_TRIM);
        $name = waRequest::post('name', '', waRequest::TYPE_STRING_TRIM);
        
        // Validate email format
        if (!waValid::email($email)) {
            throw new waException('Invalid email format');
        }
        
        // Validate name length
        if (strlen($name) > 100) {
            throw new waException('Name too long');
        }
        
        // Sanitize inputs
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        
        // Use prepared statement
        $sql = "INSERT INTO users (email, name) VALUES (?, ?)";
        $stmt = wa()->getDb()->prepare($sql);
        $stmt->bind_param('ss', $email, $name);
        $stmt->execute();
    }
}
```

### 3. Database Error Handling

```php
// Hide database errors in production
class DatabaseErrorAction extends waViewAction
{
    public function execute()
    {
        try {
            // Database operation
            $result = wa()->getDb()->query("SELECT * FROM users");
        } catch (Exception $e) {
            // Log error for debugging
            waLog::log('Database error: ' . $e->getMessage(), 'database.log');
            
            // Show generic error to user
            if (wa()->getEnv() === 'production') {
                throw new waException('Database error occurred');
            } else {
                throw $e; // Show detailed error in development
            }
        }
    }
}
```

## 📝 Logging Security

### 1. Security Event Logging

```php
// Log security events
class SecurityLoggingAction extends waViewAction
{
    public function execute()
    {
        // Log failed login attempts
        if (waRequest::post('login')) {
            $user = wa()->getUser();
            if (!$user->isAuth()) {
                $this->logSecurityEvent('failed_login', [
                    'ip' => $_SERVER['REMOTE_ADDR'],
                    'user_agent' => $_SERVER['HTTP_USER_AGENT'],
                    'username' => waRequest::post('username')
                ]);
            }
        }
        
        // Log file uploads
        if (waRequest::file('upload')) {
            $this->logSecurityEvent('file_upload', [
                'ip' => $_SERVER['REMOTE_ADDR'],
                'filename' => waRequest::file('upload')['name'],
                'filesize' => waRequest::file('upload')['size']
            ]);
        }
    }
    
    private function logSecurityEvent($event, $data)
    {
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'event' => $event,
            'ip' => $data['ip'],
            'user_agent' => $data['user_agent'] ?? '',
            'data' => json_encode($data)
        ];
        
        waLog::log(json_encode($logEntry), 'security.log');
    }
}
```

### 2. Protect Log Files

**logs/.htaccess:**
```apache
# Deny access to all log files
<RequireAll>
    Require all denied
</RequireAll>

# Prevent access to log files
<FilesMatch "\.(log|txt)$">
    Require all denied
</FilesMatch>
```

### 3. Log Rotation

```php
// Implement log rotation
class LogRotationAction extends waViewAction
{
    public function execute()
    {
        $logFile = wa()->getDataPath('logs/security.log', true);
        
        // Rotate log if it's too large (>10MB)
        if (file_exists($logFile) && filesize($logFile) > 10 * 1024 * 1024) {
            $backupFile = $logFile . '.' . date('Y-m-d-H-i-s');
            rename($logFile, $backupFile);
            
            // Compress old log
            if (function_exists('gzopen')) {
                $gzFile = $backupFile . '.gz';
                $handle = gzopen($gzFile, 'w9');
                gzwrite($handle, file_get_contents($backupFile));
                gzclose($handle);
                unlink($backupFile);
            }
        }
    }
}
```

## 🔌 API Security

### 1. API Authentication

```php
// Secure API endpoints
class SecureApiAction extends waViewAction
{
    public function execute()
    {
        // Check API key
        $apiKey = waRequest::header('X-API-Key');
        if (!$this->validateApiKey($apiKey)) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid API key']);
            exit;
        }
        
        // Check rate limiting
        if (!$this->checkRateLimit()) {
            http_response_code(429);
            echo json_encode(['error' => 'Rate limit exceeded']);
            exit;
        }
        
        // Process API request
        $data = waRequest::post();
        $result = $this->processApiRequest($data);
        
        // Return JSON response
        header('Content-Type: application/json');
        echo json_encode($result);
    }
    
    private function validateApiKey($apiKey)
    {
        // Validate API key against database
        $validKeys = ['key1', 'key2', 'key3']; // Store securely
        return in_array($apiKey, $validKeys);
    }
    
    private function checkRateLimit()
    {
        $ip = $_SERVER['REMOTE_ADDR'];
        $cache = wa()->getCache();
        $key = "rate_limit:$ip";
        
        $requests = $cache->get($key, 0);
        if ($requests > 100) { // Max 100 requests per hour
            return false;
        }
        
        $cache->set($key, $requests + 1, 3600);
        return true;
    }
}
```

### 2. API Input Validation

```php
// Validate API inputs
class ApiValidationAction extends waViewAction
{
    public function execute()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate JSON input
        if (json_last_error() !== JSON_ERROR_NONE) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            exit;
        }
        
        // Validate required fields
        $required = ['name', 'email'];
        foreach ($required as $field) {
            if (!isset($input[$field]) || empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                exit;
            }
        }
        
        // Validate email format
        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email format']);
            exit;
        }
        
        // Process validated data
        $result = $this->processData($input);
        
        header('Content-Type: application/json');
        echo json_encode($result);
    }
}
```

### 3. API Response Security

```php
// Secure API responses
class ApiResponseAction extends waViewAction
{
    public function execute()
    {
        $data = $this->getSensitiveData();
        
        // Remove sensitive information
        unset($data['password']);
        unset($data['credit_card']);
        unset($data['ssn']);
        
        // Escape output
        $data = $this->escapeApiData($data);
        
        // Set security headers
        header('Content-Type: application/json');
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        
        echo json_encode($data);
    }
    
    private function escapeApiData($data)
    {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $data[$key] = $this->escapeApiData($value);
            }
        } else {
            $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
        }
        
        return $data;
    }
}
```

## 🔍 Security Testing Checklist

### ✅ Template Security
- [ ] All user output is properly escaped
- [ ] Context-appropriate escaping is used
- [ ] HTML content is sanitized when necessary
- [ ] No direct database queries in templates
- [ ] CSP nonce is used for inline scripts

### ✅ CSRF Protection
- [ ] All forms include CSRF tokens
- [ ] AJAX requests include CSRF tokens
- [ ] State-changing operations require POST method
- [ ] CSRF tokens are validated server-side
- [ ] CSRF tokens are retrieved from meta tags

### ✅ Directory Protection
- [ ] `.htaccess` files protect sensitive directories
- [ ] Configuration files are not web-accessible
- [ ] Locale files are protected from direct access
- [ ] Library files are not accessible via web
- [ ] User upload directories are protected

### ✅ Input/Output
- [ ] All input is validated server-side
- [ ] Client-side validation is implemented
- [ ] Output escaping prevents XSS
- [ ] SQL injection prevention is in place
- [ ] File upload validation is implemented

### ✅ Headers and Configuration
- [ ] Security headers are configured
- [ ] CSRF protection is enabled in app.php
- [ ] Error reporting is disabled in production
- [ ] Debug mode is disabled in production
- [ ] CSP is properly configured without unsafe-inline

### ✅ File Security
- [ ] File upload validation is implemented
- [ ] File type restrictions are in place
- [ ] File size limits are enforced
- [ ] Upload directories are protected
- [ ] File permissions are properly set

### ✅ Session Security
- [ ] Session timeout is configured
- [ ] Session regeneration is implemented
- [ ] Secure session cookies are used
- [ ] Session data is properly validated
- [ ] Session fixation protection is enabled

### ✅ Database Security
- [ ] Prepared statements are used
- [ ] Input validation prevents SQL injection
- [ ] Database credentials are secured
- [ ] Database error messages are hidden
- [ ] Database access is properly restricted

### ✅ Logging Security
- [ ] Security events are logged
- [ ] Log files are protected from access
- [ ] Log rotation is configured
- [ ] Sensitive data is not logged
- [ ] Log monitoring is implemented

### ✅ API Security
- [ ] API endpoints are properly authenticated
- [ ] Rate limiting is implemented
- [ ] Input validation is enforced
- [ ] Output is properly escaped
- [ ] API keys are securely stored

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
- [Webasyst File Upload Security](https://www.webasyst.com/developers/docs/wa-system/file-upload/)
- [Webasyst Session Security](https://www.webasyst.com/developers/docs/wa-system/session/)
- [Webasyst Database Security](https://www.webasyst.com/developers/docs/wa-system/database/)

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Maintainer:** Waboot Team