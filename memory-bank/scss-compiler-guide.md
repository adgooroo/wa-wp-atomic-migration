# SCSS Compiler Guide for Webasyst Themes

## Overview

This comprehensive guide provides a complete implementation of a standalone SCSS compiler for Webasyst themes using centralized architecture. The compiler is based on the proven scssphp library and follows security best practices.

## Webasyst Theme Architecture Principle

### **Site Theme is Always Required**

In Webasyst, **the site theme is the mandatory foundation** for all other themes:

- ✅ **Site theme must be installed first** - it's the parent theme
- ✅ **Child themes (blog, shop, hub, etc.) depend on site theme**
- ✅ **Cannot install blog theme without site theme**
- ✅ **Site theme is always available** when child themes are active

This fundamental principle allows us to use a **centralized architecture** where the SCSS compiler lives only in the site theme.

## Centralized Architecture

### **Structure:**

```
📦 Waboot Theme System
├── 📁 wa-apps/site/themes/waboot/lib/
│   ├── 📁 ScssCompiler/              # Central compiler (only here)
│   │   ├── Compiler.php              # Main compilation logic
│   │   ├── Cache.php                 # Shared caching
│   │   ├── Security.php              # Security validations
│   │   ├── ThemeIntegration.php      # Site integration
│   │   └── ApiService.php            # API for child themes
│   └── 📁 scssphp/                   # Shared scssphp library
├── 📁 wa-apps/shop/themes/waboot/    # Uses site compiler API
├── 📁 wa-apps/blog/themes/waboot/    # Uses site compiler API
├── 📁 wa-apps/hub/themes/waboot/     # Uses site compiler API
├── 📁 wa-apps/mailer/themes/waboot/  # Uses site compiler API
└── 📁 wa-apps/helpdesk/themes/waboot/ # Uses site compiler API
```

### **Why Centralized is Better for Webasyst:**

1. **No Code Duplication** - Single compiler instance
2. **Simplified Maintenance** - One place to update
3. **Consistent Behavior** - Same compilation logic everywhere
4. **Shared Cache** - Optimized performance
5. **Smaller Footprint** - Less disk space usage
6. **Webasyst Native** - Follows platform architecture

## Implementation

### **1. Central Compiler (Site Theme)**

```php
<?php
// wa-apps/site/themes/waboot/lib/ScssCompiler/Compiler.php

namespace Waboot\ScssCompiler;

class Compiler
{
    private $scss;
    private $cache;
    private $security;
    private $siteThemePath;
    private $siteOutputPath;
    
    public function __construct()
    {
        $this->siteThemePath = wa()->getDataPath('themes/site/waboot', true);
        $this->siteOutputPath = wa()->getDataPath('themes/site/waboot/css', true);
        $this->scss = new \ScssPhp\ScssPhp\Compiler();
        $this->cache = new Cache();
        $this->security = new Security();
        
        $this->initializeCompiler();
    }
    
    /**
     * Initialize compiler with security settings
     */
    private function initializeCompiler()
    {
        // Set import paths for all themes
        $this->scss->setImportPaths([
            $this->siteThemePath . '/lib/scss',
            $this->siteThemePath . '/lib/scss/bootstrap'
        ]);
        
        // Configure output format
        $this->scss->setOutputStyle(\ScssPhp\ScssPhp\OutputStyle::COMPRESSED);
        $this->scss->setNumberPrecision(6);
    }
    
    /**
     * Compile SCSS for any theme (site or child)
     */
    public function compileForTheme($appId, $scssFile, $cssFile = null)
    {
        // Security validation
        $this->security->validateScssFile($scssFile, $this->getThemePath($appId));
        
        // Generate output filename if not provided
        if (!$cssFile) {
            $cssFile = $this->generateOutputFilename($appId, $scssFile);
        }
        
        // Check cache first
        $cacheKey = $this->generateCacheKey($appId, $scssFile);
        if ($this->cache->isValid($cacheKey, $scssFile)) {
            return $this->cache->get($cacheKey);
        }
        
        try {
            // Read and validate SCSS content
            $scssContent = $this->security->readAndValidateFile($scssFile);
            
            // Add parent theme imports for child themes
            if ($appId !== 'site') {
                $scssContent = $this->addParentImports($scssContent, $appId);
            }
            
            // Compile SCSS to CSS
            $cssContent = $this->scss->compile($scssContent);
            
            // Validate compiled CSS
            $this->security->validateCssContent($cssContent);
            
            // Write to file with security checks
            $this->writeCssFile($cssFile, $cssContent);
            
            // Update cache
            $this->cache->set($cacheKey, $cssFile, $scssFile, $appId);
            
            return $cssFile;
            
        } catch (\Exception $e) {
            $this->handleCompilationError($e, $scssFile, $appId);
        }
    }
    
    /**
     * Add parent theme imports for child themes
     */
    private function addParentImports($scssContent, $appId)
    {
        // Validate app ID
        $allowedApps = ['shop', 'blog', 'hub', 'mailer', 'helpdesk'];
        if (!in_array($appId, $allowedApps)) {
            throw new \InvalidArgumentException("Invalid app ID: {$appId}");
        }
        
        // Sanitize SCSS content
        if (!is_string($scssContent)) {
            throw new \InvalidArgumentException("Invalid SCSS content");
        }
        
        // Build safe parent imports
        $parentImports = [
            "@import \"../../../site/themes/waboot/lib/scss/_variables\";",
            "@import \"../../../site/themes/waboot/lib/scss/bootstrap/bootstrap\";",
            "@import \"../../../site/themes/waboot/lib/scss/_components\";"
        ];
        
        // Validate each import path
        foreach ($parentImports as $import) {
            $importPath = $this->extractImportPath($import);
            if (!$this->validateImportPath($importPath)) {
                throw new \SecurityException("Invalid import path: {$importPath}");
            }
        }
        
        return implode("\n", $parentImports) . "\n\n" . $scssContent;
    }
    
    /**
     * Extract import path from SCSS import statement
     */
    private function extractImportPath($importStatement)
    {
        if (preg_match('/@import\s*["\']([^"\']+)["\']/', $importStatement, $matches)) {
            return $matches[1];
        }
        return null;
    }
    
    /**
     * Validate import path for security
     */
    private function validateImportPath($importPath)
    {
        if (empty($importPath)) {
            return false;
        }
        
        // Check for path traversal
        if (strpos($importPath, '..') !== false) {
            return false;
        }
        
        // Check for dangerous characters
        if (preg_match('/[<>:"|*?]/', $importPath)) {
            return false;
        }
        
        // Validate path structure
        $allowedPrefixes = [
            '../../../site/themes/waboot/lib/scss/',
            '../../site/themes/waboot/lib/scss/',
            '../site/themes/waboot/lib/scss/'
        ];
        
        foreach ($allowedPrefixes as $prefix) {
            if (strpos($importPath, $prefix) === 0) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Get theme path for any app
     */
    private function getThemePath($appId)
    {
        return wa()->getDataPath("themes/{$appId}/waboot", true);
    }
    
    /**
     * Generate output filename for any theme
     */
    private function generateOutputFilename($appId, $scssFile)
    {
        $basename = basename($scssFile, '.scss');
        $safeBasename = $this->security->sanitizeFilename($basename);
        
        $outputPath = wa()->getDataPath("themes/{$appId}/waboot/css", true);
        return $outputPath . '/' . $safeBasename . '.css';
    }
    
    /**
     * Generate cache key with app context
     */
    private function generateCacheKey($appId, $scssFile)
    {
        // Validate inputs
        if (empty($appId) || empty($scssFile)) {
            throw new \InvalidArgumentException("Invalid cache key parameters");
        }
        
        // Validate app ID
        $allowedApps = ['site', 'shop', 'blog', 'hub', 'mailer', 'helpdesk'];
        if (!in_array($appId, $allowedApps)) {
            throw new \InvalidArgumentException("Invalid app ID for cache: {$appId}");
        }
        
        // Read file content safely
        if (!file_exists($scssFile) || !is_readable($scssFile)) {
            throw new \RuntimeException("Cannot read SCSS file for cache key: {$scssFile}");
        }
        
        $content = file_get_contents($scssFile);
        if ($content === false) {
            throw new \RuntimeException("Failed to read SCSS file content: {$scssFile}");
        }
        
        $dependencies = $this->getDependencies($scssFile);
        
        // Create secure cache key
        $cacheData = [
            'content' => $content,
            'dependencies' => $dependencies,
            'app_id' => $appId,
            'file_mtime' => filemtime($scssFile)
        ];
        
        return md5(serialize($cacheData));
    }
    
    /**
     * Handle compilation errors with app context
     */
    private function handleCompilationError(\Exception $e, $scssFile, $appId)
    {
        // Sanitize inputs for logging
        $safeScssFile = $this->security->sanitizeFilename(basename($scssFile));
        $safeAppId = $this->security->sanitizeFilename($appId);
        
        $message = sprintf(
            'SCSS compilation error in %s (app: %s): %s',
            $safeScssFile,
            $safeAppId,
            $e->getMessage()
        );
        
        // Log error with security context
        $logData = [
            'error' => $e->getMessage(),
            'file' => $safeScssFile,
            'app_id' => $safeAppId,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        waLog::log(json_encode($logData), 'waboot/scss-compiler.log');
        
        // Return fallback CSS if available
        $fallbackFile = $this->getFallbackCss($scssFile, $appId);
        if ($fallbackFile && file_exists($fallbackFile)) {
            waLog::log("Using fallback CSS: {$fallbackFile}", 'waboot/scss-compiler.log');
            return $fallbackFile;
        }
        
        // Don't expose internal file paths in production
        if (wa()->getEnv() === 'production') {
            throw new \RuntimeException(
                "SCSS compilation failed for app: {$safeAppId}",
                0,
                $e
            );
        } else {
            throw new \RuntimeException(
                "SCSS compilation failed for {$safeScssFile} (app: {$safeAppId}): " . $e->getMessage(),
                0,
                $e
            );
        }
    }
}
```

### **2. Security Class**

```php
<?php
// wa-apps/site/themes/waboot/lib/ScssCompiler/Security.php

namespace Waboot\ScssCompiler;

class Security
{
    /**
     * Validate SCSS file path and content
     */
    public function validateScssFile($scssFile, $themePath)
    {
        // Validate input parameters
        if (empty($scssFile) || empty($themePath)) {
            throw new \InvalidArgumentException("Invalid input parameters");
        }
        
        // Sanitize file path
        $scssFile = $this->sanitizePath($scssFile);
        $themePath = $this->sanitizePath($themePath);
        
        // Check file exists
        if (!file_exists($scssFile)) {
            $this->logSecurityEvent('file_not_found', ['file' => $scssFile]);
            throw new \InvalidArgumentException("SCSS file not found: {$scssFile}");
        }
        
        // Validate file path is within theme directory (prevent path traversal)
        $realScssFile = realpath($scssFile);
        $realThemePath = realpath($themePath);
        
        if (!$realScssFile || !$realThemePath) {
            throw new \SecurityException("Invalid file paths");
        }
        
        if (strpos($realScssFile, $realThemePath) !== 0) {
            $this->logSecurityEvent('path_traversal_attempt', [
                'attempted_file' => $scssFile,
                'theme_path' => $themePath,
                'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
            ]);
            throw new \SecurityException("SCSS file outside theme directory");
        }
        
        // Check file extension
        $extension = strtolower(pathinfo($scssFile, PATHINFO_EXTENSION));
        if ($extension !== 'scss') {
            $this->logSecurityEvent('invalid_file_extension', ['file' => $scssFile, 'extension' => $extension]);
            throw new \InvalidArgumentException("Invalid file extension: {$extension}");
        }
        
        // Validate MIME type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $scssFile);
        finfo_close($finfo);
        
        $allowedMimeTypes = ['text/plain', 'text/x-scss', 'text/css'];
        if (!in_array($mimeType, $allowedMimeTypes)) {
            $this->logSecurityEvent('invalid_mime_type', ['file' => $scssFile, 'mime_type' => $mimeType]);
            throw new \SecurityException("Invalid MIME type: {$mimeType}");
        }
        
        // Check file size (prevent memory exhaustion)
        $fileSize = filesize($scssFile);
        if ($fileSize > 1024 * 1024) { // 1MB limit
            $this->logSecurityEvent('file_too_large', ['file' => $scssFile, 'size' => $fileSize]);
            throw new \InvalidArgumentException("SCSS file too large: {$fileSize} bytes");
        }
        
        // Check for null bytes (security)
        $content = file_get_contents($scssFile);
        if (strpos($content, "\0") !== false) {
            $this->logSecurityEvent('null_bytes_detected', ['file' => $scssFile]);
            throw new \SecurityException("Null bytes detected in SCSS file");
        }
    }
    
    /**
     * Read and validate file content
     */
    public function readAndValidateFile($filePath)
    {
        // Validate file path
        $filePath = $this->sanitizePath($filePath);
        
        // Check if file exists and is readable
        if (!file_exists($filePath) || !is_readable($filePath)) {
            $this->logSecurityEvent('file_access_denied', ['file' => $filePath]);
            throw new \RuntimeException("Cannot access file: {$filePath}");
        }
        
        // Read file content
        $content = file_get_contents($filePath);
        
        if ($content === false) {
            $this->logSecurityEvent('file_read_failed', ['file' => $filePath]);
            throw new \RuntimeException("Cannot read file: {$filePath}");
        }
        
        // Check for null bytes (security)
        if (strpos($content, "\0") !== false) {
            $this->logSecurityEvent('null_bytes_detected', ['file' => $filePath]);
            throw new \SecurityException("Null bytes detected in file");
        }
        
        // Check for potentially dangerous content
        $dangerousPatterns = [
            '/<\?php/i',
            '/<script/i',
            '/javascript:/i',
            '/vbscript:/i',
            '/data:/i'
        ];
        
        foreach ($dangerousPatterns as $pattern) {
            if (preg_match($pattern, $content)) {
                $this->logSecurityEvent('dangerous_content_detected', [
                    'file' => $filePath,
                    'pattern' => $pattern
                ]);
                throw new \SecurityException("Dangerous content detected in file");
            }
        }
        
        // Validate SCSS syntax basics
        $this->validateScssSyntax($content);
        
        return $content;
    }
    
    /**
     * Validate CSS content for security
     */
    public function validateCssContent($cssContent)
    {
        // Check for potentially dangerous CSS
        $dangerousPatterns = [
            '/expression\s*\(/i',
            '/javascript\s*:/i',
            '/vbscript\s*:/i',
            '/data\s*:/i'
        ];
        
        foreach ($dangerousPatterns as $pattern) {
            if (preg_match($pattern, $cssContent)) {
                throw new \SecurityException("Dangerous CSS content detected");
            }
        }
        
        return true;
    }
    
    /**
     * Sanitize filename for security
     */
    public function sanitizeFilename($filename)
    {
        // Validate input
        if (empty($filename) || !is_string($filename)) {
            throw new \InvalidArgumentException("Invalid filename");
        }
        
        // Remove dangerous characters
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);
        
        // Prevent directory traversal
        $filename = str_replace(['..', '/', '\\', ':', '*', '?', '"', '<', '>', '|'], '', $filename);
        
        // Limit filename length
        if (strlen($filename) > 255) {
            $filename = substr($filename, 0, 255);
        }
        
        // Ensure filename is not empty after sanitization
        if (empty($filename)) {
            throw new \InvalidArgumentException("Filename becomes empty after sanitization");
        }
        
        return $filename;
    }
    
    /**
     * Sanitize file path for security
     */
    public function sanitizePath($path)
    {
        // Validate input
        if (empty($path) || !is_string($path)) {
            throw new \InvalidArgumentException("Invalid path");
        }
        
        // Normalize path
        $path = realpath($path);
        
        if ($path === false) {
            throw new \InvalidArgumentException("Invalid path: {$path}");
        }
        
        // Check for path traversal attempts
        if (strpos($path, '..') !== false) {
            $this->logSecurityEvent('path_traversal_attempt', ['path' => $path]);
            throw new \SecurityException("Path traversal attempt detected");
        }
        
        return $path;
    }
    
    /**
     * Log security events
     */
    private function logSecurityEvent($event, $data = [])
    {
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'event' => $event,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            'data' => $data
        ];
        
        waLog::log(json_encode($logEntry), 'waboot/security.log');
    }
    
    /**
     * Validate SCSS syntax basics
     */
    private function validateScssSyntax($content)
    {
        // Check for balanced braces
        $braceCount = 0;
        $inString = false;
        $stringChar = '';
        
        for ($i = 0; $i < strlen($content); $i++) {
            $char = $content[$i];
            
            if ($inString) {
                if ($char === $stringChar && $content[$i - 1] !== '\\') {
                    $inString = false;
                }
                continue;
            }
            
            if (($char === '"' || $char === "'") && $content[$i - 1] !== '\\') {
                $inString = true;
                $stringChar = $char;
                continue;
            }
            
            if ($char === '{') {
                $braceCount++;
            } elseif ($char === '}') {
                $braceCount--;
                if ($braceCount < 0) {
                    throw new \InvalidArgumentException("Unbalanced braces in SCSS");
                }
            }
        }
        
        if ($braceCount !== 0) {
            throw new \InvalidArgumentException("Unbalanced braces in SCSS");
        }
    }
}
```

### **3. Cache Class**

```php
<?php
// wa-apps/site/themes/waboot/lib/ScssCompiler/Cache.php

namespace Waboot\ScssCompiler;

class Cache
{
    private $cacheDir;
    private $cacheLifetime = 3600; // 1 hour
    
    public function __construct($cacheDir = null)
    {
        // Shared cache directory for all apps
        $this->cacheDir = $cacheDir ?: wa()->getDataPath('themes/shared/scss-cache', true);
        
        if (!is_dir($this->cacheDir)) {
            mkdir($this->cacheDir, 0755, true);
        }
    }
    
    /**
     * Check if cache is valid
     */
    public function isValid($cacheKey, $sourceFile)
    {
        // Validate inputs
        if (empty($cacheKey) || empty($sourceFile)) {
            return false;
        }
        
        // Sanitize cache key
        $cacheKey = $this->sanitizeCacheKey($cacheKey);
        
        $cacheFile = $this->getCacheFilePath($cacheKey);
        
        if (!file_exists($cacheFile)) {
            return false;
        }
        
        // Validate cache file integrity
        if (!$this->validateCacheFile($cacheFile)) {
            $this->logSecurityEvent('cache_corruption', ['cache_file' => $cacheFile]);
            return false;
        }
        
        // Check cache lifetime
        if (time() - filemtime($cacheFile) > $this->cacheLifetime) {
            return false;
        }
        
        // Check if source file is newer than cache
        if (!file_exists($sourceFile) || filemtime($sourceFile) > filemtime($cacheFile)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate cache file integrity
     */
    private function validateCacheFile($cacheFile)
    {
        if (!file_exists($cacheFile) || !is_readable($cacheFile)) {
            return false;
        }
        
        $cacheData = file_get_contents($cacheFile);
        if ($cacheData === false) {
            return false;
        }
        
        $unserialized = @unserialize($cacheData);
        if ($unserialized === false) {
            return false;
        }
        
        // Validate cache data structure
        $requiredKeys = ['css_file', 'source_file', 'app_id', 'timestamp', 'source_mtime'];
        foreach ($requiredKeys as $key) {
            if (!isset($unserialized[$key])) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Sanitize cache key
     */
    private function sanitizeCacheKey($cacheKey)
    {
        // Validate cache key format (MD5 hash)
        if (!preg_match('/^[a-f0-9]{32}$/', $cacheKey)) {
            throw new \InvalidArgumentException("Invalid cache key format");
        }
        
        return $cacheKey;
    }
    
    /**
     * Log security events
     */
    private function logSecurityEvent($event, $data = [])
    {
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'event' => $event,
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'data' => $data
        ];
        
        waLog::log(json_encode($logEntry), 'waboot/cache-security.log');
    }
    
    /**
     * Get cached file
     */
    public function get($cacheKey)
    {
        $cacheFile = $this->getCacheFilePath($cacheKey);
        
        if (file_exists($cacheFile)) {
            return $cacheFile;
        }
        
        return null;
    }
    
    /**
     * Set cache entry with app-specific metadata
     */
    public function set($cacheKey, $cssFile, $sourceFile, $appId)
    {
        $cacheFile = $this->getCacheFilePath($cacheKey);
        
        $cacheData = [
            'css_file' => $cssFile,
            'source_file' => $sourceFile,
            'app_id' => $appId,
            'timestamp' => time(),
            'source_mtime' => filemtime($sourceFile)
        ];
        
        file_put_contents($cacheFile, serialize($cacheData));
    }
    
    /**
     * Clear cache for specific app
     */
    public function clearAppCache($appId)
    {
        $files = glob($this->cacheDir . '/*.cache');
        foreach ($files as $file) {
            $cacheData = unserialize(file_get_contents($file));
            if (isset($cacheData['app_id']) && $cacheData['app_id'] === $appId) {
                unlink($file);
            }
        }
    }
    
    /**
     * Get cache file path
     */
    private function getCacheFilePath($cacheKey)
    {
        return $this->cacheDir . '/' . md5($cacheKey) . '.cache';
    }
}
```

### **4. API Service for Child Themes**

```php
<?php
// wa-apps/site/themes/waboot/lib/ScssCompiler/ApiService.php

namespace Waboot\ScssCompiler;

class ApiService
{
    private static $instance = null;
    private $compiler;
    
    private function __construct()
    {
        $this->compiler = new Compiler();
    }
    
    /**
     * Get singleton instance
     */
    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Compile SCSS for any theme
     */
    public function compileTheme($appId)
    {
        // Validate app ID
        $allowedApps = ['site', 'shop', 'blog', 'hub', 'mailer', 'helpdesk'];
        if (!in_array($appId, $allowedApps)) {
            throw new \InvalidArgumentException("Invalid app ID: {$appId}");
        }
        
        // Check rate limiting
        if (!$this->checkRateLimit($appId)) {
            throw new \RuntimeException("Rate limit exceeded for app: {$appId}");
        }
        
        // Validate CSRF token for web requests
        if ($this->isWebRequest()) {
            $this->validateCsrfToken();
        }
        
        $scssFiles = $this->getScssFiles($appId);
        $results = [];
        
        foreach ($scssFiles as $scssFile) {
            try {
                $cssFile = $this->compiler->compileForTheme($appId, $scssFile);
                $results[] = $cssFile;
            } catch (\Exception $e) {
                $this->logCompilationError($appId, $scssFile, $e);
            }
        }
        
        return $results;
    }
    
    /**
     * Check rate limiting
     */
    private function checkRateLimit($appId)
    {
        $cache = wa()->getCache();
        $key = "scss_compile_rate_limit:{$appId}:" . ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
        
        $requests = $cache->get($key, 0);
        if ($requests > 10) { // Max 10 compilations per hour per IP per app
            return false;
        }
        
        $cache->set($key, $requests + 1, 3600);
        return true;
    }
    
    /**
     * Check if this is a web request
     */
    private function isWebRequest()
    {
        return isset($_SERVER['HTTP_HOST']) && isset($_SERVER['REQUEST_METHOD']);
    }
    
    /**
     * Validate CSRF token
     */
    private function validateCsrfToken()
    {
        if (!waRequest::post('csrf_token') && !waRequest::header('X-CSRF-Token')) {
            throw new \SecurityException("CSRF token required");
        }
        
        $token = waRequest::post('csrf_token') ?: waRequest::header('X-CSRF-Token');
        if (!wa()->getUser()->checkCsrfToken($token)) {
            throw new \SecurityException("Invalid CSRF token");
        }
    }
    
    /**
     * Log compilation errors
     */
    private function logCompilationError($appId, $scssFile, $exception)
    {
        $logData = [
            'app_id' => $appId,
            'file' => basename($scssFile),
            'error' => $exception->getMessage(),
            'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        waLog::log(json_encode($logData), "waboot/{$appId}-scss.log");
    }
    
    /**
     * Compile single SCSS file
     */
    public function compileFile($appId, $scssFile, $cssFile = null)
    {
        return $this->compiler->compileForTheme($appId, $scssFile, $cssFile);
    }
    
    /**
     * Get SCSS files for any theme
     */
    private function getScssFiles($appId)
    {
        // Validate app ID
        $allowedApps = ['site', 'shop', 'blog', 'hub', 'mailer', 'helpdesk'];
        if (!in_array($appId, $allowedApps)) {
            throw new \InvalidArgumentException("Invalid app ID: {$appId}");
        }
        
        $themePath = wa()->getDataPath("themes/{$appId}/waboot", true);
        
        // Validate theme path
        if (!$this->validateThemePath($themePath)) {
            throw new \SecurityException("Invalid theme path: {$themePath}");
        }
        
        $scssDir = $themePath . '/lib/scss';
        
        if (!is_dir($scssDir)) {
            return [];
        }
        
        $files = [];
        try {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($scssDir, \RecursiveDirectoryIterator::SKIP_DOTS)
            );
            
            foreach ($iterator as $file) {
                if ($file->isFile() && $file->getExtension() === 'scss') {
                    $filePath = $file->getPathname();
                    
                    // Validate file path
                    if ($this->validateScssFilePath($filePath, $scssDir)) {
                        $files[] = $filePath;
                    }
                }
            }
        } catch (\Exception $e) {
            $this->logSecurityEvent('directory_scan_error', [
                'app_id' => $appId,
                'directory' => $scssDir,
                'error' => $e->getMessage()
            ]);
            throw new \RuntimeException("Failed to scan SCSS directory: {$scssDir}");
        }
        
        return $files;
    }
    
    /**
     * Validate theme path
     */
    private function validateThemePath($themePath)
    {
        if (empty($themePath) || !is_string($themePath)) {
            return false;
        }
        
        $realPath = realpath($themePath);
        if ($realPath === false) {
            return false;
        }
        
        // Check for path traversal
        if (strpos($realPath, '..') !== false) {
            return false;
        }
        
        // Validate path is within allowed themes directory
        $allowedBasePath = wa()->getDataPath('themes', true);
        if (strpos($realPath, $allowedBasePath) !== 0) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate SCSS file path
     */
    private function validateScssFilePath($filePath, $allowedDir)
    {
        if (empty($filePath) || !is_string($filePath)) {
            return false;
        }
        
        $realFilePath = realpath($filePath);
        $realAllowedDir = realpath($allowedDir);
        
        if ($realFilePath === false || $realAllowedDir === false) {
            return false;
        }
        
        // Check if file is within allowed directory
        if (strpos($realFilePath, $realAllowedDir) !== 0) {
            return false;
        }
        
        // Check for dangerous characters in filename
        $filename = basename($filePath);
        if (preg_match('/[<>:"|*?]/', $filename)) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Check if theme needs recompilation
     */
    public function needsRecompilation($appId)
    {
        $scssDir = wa()->getDataPath("themes/{$appId}/waboot/lib/scss", true);
        $cssDir = wa()->getDataPath("themes/{$appId}/waboot/css", true);
        
        if (!is_dir($scssDir) || !is_dir($cssDir)) {
            return true;
        }
        
        $scssFiles = glob($scssDir . '/**/*.scss');
        $cssFiles = glob($cssDir . '/**/*.css');
        
        if (empty($cssFiles)) {
            return true;
        }
        
        $latestCssTime = max(array_map('filemtime', $cssFiles));
        
        foreach ($scssFiles as $scssFile) {
            if (filemtime($scssFile) > $latestCssTime) {
                return true;
            }
        }
        
        return false;
    }
}
```

## Child Theme Integration

### **Shop Theme Integration**

```php
<?php
// wa-apps/shop/themes/waboot/lib/Theme.php

class Theme extends waTheme
{
    /**
     * Compile SCSS using site compiler
     */
    public function compileScss()
    {
        try {
            $apiService = \Waboot\ScssCompiler\ApiService::getInstance();
            return $apiService->compileTheme('shop');
        } catch (\Exception $e) {
            waLog::log('Shop SCSS compilation failed: ' . $e->getMessage(), 'waboot/shop-scss.log');
            return false;
        }
    }
    
    /**
     * Get compiled CSS files
     */
    public function getCssFiles()
    {
        $cssDir = $this->getDataPath('css', true);
        $cssFiles = [];
        
        if (is_dir($cssDir)) {
            $files = glob($cssDir . '/*.css');
            foreach ($files as $file) {
                // Exclude user files from main CSS list
                if (basename($file) !== 'user-custom.css') {
                    $cssFiles[] = $this->getDataUrl('css/' . basename($file));
                }
            }
        }
        
        return $cssFiles;
    }
    
    /**
     * Get user CSS file
     */
    public function getUserCssFile()
    {
        $userCssFile = $this->getDataPath('user_theme/css/user-custom.css', true);
        
        if (file_exists($userCssFile) && filesize($userCssFile) > 0) {
            return $this->getDataUrl('user_theme/css/user-custom.css');
        }
        
        return null;
    }
    
    /**
     * Get JavaScript files
     */
    public function getJsFiles()
    {
        $jsDir = $this->getDataPath('js', true);
        $jsFiles = [];
        
        if (is_dir($jsDir)) {
            $files = glob($jsDir . '/*.js');
            foreach ($files as $file) {
                // Exclude user files from main JS list
                if (basename($file) !== 'user-custom.js') {
                    $jsFiles[] = $this->getDataUrl('js/' . basename($file));
                }
            }
        }
        
        return $jsFiles;
    }
    
    /**
     * Get user JavaScript file
     */
    public function getUserJsFile()
    {
        $userJsFile = $this->getDataPath('user_theme/js/user-custom.js', true);
        
        if (file_exists($userJsFile) && filesize($userJsFile) > 0) {
            return $this->getDataUrl('user_theme/js/user-custom.js');
        }
        
        return null;
    }
    
    /**
     * Check if SCSS needs recompilation
     */
    public function needsScssRecompilation()
    {
        $apiService = \Waboot\ScssCompiler\ApiService::getInstance();
        return $apiService->needsRecompilation('shop');
    }
}
```

### **Blog Theme Integration**

```php
<?php
// wa-apps/blog/themes/waboot/lib/Theme.php

class Theme extends waTheme
{
    /**
     * Compile SCSS using site compiler
     */
    public function compileScss()
    {
        try {
            $apiService = \Waboot\ScssCompiler\ApiService::getInstance();
            return $apiService->compileTheme('blog');
        } catch (\Exception $e) {
            waLog::log('Blog SCSS compilation failed: ' . $e->getMessage(), 'waboot/blog-scss.log');
            return false;
        }
    }
    
    /**
     * Get compiled CSS files
     */
    public function getCssFiles()
    {
        $cssDir = $this->getDataPath('css', true);
        $cssFiles = [];
        
        if (is_dir($cssDir)) {
            $files = glob($cssDir . '/*.css');
            foreach ($files as $file) {
                // Exclude user files from main CSS list
                if (basename($file) !== 'user-custom.css') {
                    $cssFiles[] = $this->getDataUrl('css/' . basename($file));
                }
            }
        }
        
        return $cssFiles;
    }
    
    /**
     * Get user CSS file
     */
    public function getUserCssFile()
    {
        $userCssFile = $this->getDataPath('user_theme/css/user-custom.css', true);
        
        if (file_exists($userCssFile) && filesize($userCssFile) > 0) {
            return $this->getDataUrl('user_theme/css/user-custom.css');
        }
        
        return null;
    }
    
    /**
     * Get JavaScript files
     */
    public function getJsFiles()
    {
        $jsDir = $this->getDataPath('js', true);
        $jsFiles = [];
        
        if (is_dir($jsDir)) {
            $files = glob($jsDir . '/*.js');
            foreach ($files as $file) {
                // Exclude user files from main JS list
                if (basename($file) !== 'user-custom.js') {
                    $jsFiles[] = $this->getDataUrl('js/' . basename($file));
                }
            }
        }
        
        return $jsFiles;
    }
    
    /**
     * Get user JavaScript file
     */
    public function getUserJsFile()
    {
        $userJsFile = $this->getDataPath('user_theme/js/user-custom.js', true);
        
        if (file_exists($userJsFile) && filesize($userJsFile) > 0) {
            return $this->getDataUrl('user_theme/js/user-custom.js');
        }
        
        return null;
    }
}
```

## Installation Process

### **Step 1: Install Central Compiler (Site App Only)**

```bash
# Download scssphp library
wget https://github.com/scssphp/scssphp/archive/refs/tags/v1.11.1.tar.gz
tar -xzf v1.11.1.tar.gz

# Install only in site app
cp -r scssphp-1.11.1/src/* wa-apps/site/themes/waboot/lib/scssphp/
cp scssphp-1.11.1/LICENSE wa-apps/site/themes/waboot/lib/scssphp/

# Create compiler files
mkdir -p wa-apps/site/themes/waboot/lib/ScssCompiler/
# Copy Compiler.php, Cache.php, Security.php, ApiService.php
```

### **Step 2: Create Child Theme Integration Files**

```bash
# For each child app, create minimal integration
for app in shop blog hub mailer helpdesk; do
    mkdir -p wa-apps/$app/themes/waboot/lib/
    
    # Create Theme.php that uses site compiler API
    cat > wa-apps/$app/themes/waboot/lib/Theme.php << 'EOF'
<?php
class Theme extends waTheme
{
    public function compileScss()
    {
        $apiService = \Waboot\ScssCompiler\ApiService::getInstance();
        return $apiService->compileTheme('$app');
    }
    
    public function getCssFiles()
    {
        $cssDir = $this->getDataPath('css', true);
        $cssFiles = [];
        
        if (is_dir($cssDir)) {
            $files = glob($cssDir . '/*.css');
            foreach ($files as $file) {
                // Exclude user files from main CSS list
                if (basename($file) !== 'user-custom.css') {
                    $cssFiles[] = $this->getDataUrl('css/' . basename($file));
                }
            }
        }
        
        return $cssFiles;
    }
    
    public function getUserCssFile()
    {
        $userCssFile = $this->getDataPath('user_theme/css/user-custom.css', true);
        
        if (file_exists($userCssFile) && filesize($userCssFile) > 0) {
            return $this->getDataUrl('user_theme/css/user-custom.css');
        }
        
        return null;
    }
    
    public function getJsFiles()
    {
        $jsDir = $this->getDataPath('js', true);
        $jsFiles = [];
        
        if (is_dir($jsDir)) {
            $files = glob($jsDir . '/*.js');
            foreach ($files as $file) {
                // Exclude user files from main JS list
                if (basename($file) !== 'user-custom.js') {
                    $jsFiles[] = $this->getDataUrl('js/' . basename($file));
                }
            }
        }
        
        return $jsFiles;
    }
    
    public function getUserJsFile()
    {
        $userJsFile = $this->getDataPath('user_theme/js/user-custom.js', true);
        
        if (file_exists($userJsFile) && filesize($userJsFile) > 0) {
            return $this->getDataUrl('user_theme/js/user-custom.js');
        }
        
        return null;
    }
    
    public function createUserFiles()
    {
        $this->createUserScssFile();
        $this->createUserCssFile();
        $this->createUserJsFile();
    }
    
    private function createUserScssFile()
    {
        $userScssFile = $this->getDataPath('user_theme/scss/user-custom.scss', true);
        
        if (!file_exists($userScssFile)) {
            $content = "// User custom variables\n// Add your custom SCSS variables here\n// Example:\n// \$primary-color: #ff6b6b;\n// \$secondary-color: #4ecdc4;\n";
            file_put_contents($userScssFile, $content);
            chmod($userScssFile, 0644);
        }
    }
    
    private function createUserCssFile()
    {
        $userCssFile = $this->getDataPath('user_theme/css/user-custom.css', true);
        
        if (!file_exists($userCssFile)) {
            $content = "/* User custom styles */\n/* Add your custom CSS here */\n/* Example: */\n/* .custom-class { */\n/*     color: #ff6b6b; */\n/* } */\n";
            file_put_contents($userCssFile, $content);
            chmod($userCssFile, 0644);
        }
    }
    
    private function createUserJsFile()
    {
        $userJsFile = $this->getDataPath('user_theme/js/user-custom.js', true);
        
        if (!file_exists($userJsFile)) {
            $content = "// User custom JavaScript\n// Add your custom JavaScript here\n// Example:\n// document.addEventListener('DOMContentLoaded', function() {\n//     console.log('Custom script loaded');\n// });\n";
            file_put_contents($userJsFile, $content);
            chmod($userJsFile, 0644);
        }
    }
}
EOF
done

### **Step 3: Create User Customization Files**

```bash
# Create user customization files for each theme
for app in site shop blog hub mailer helpdesk; do
    # Create user SCSS variables file
    mkdir -p wa-apps/$app/themes/waboot/user_theme/scss/
    cat > wa-apps/$app/themes/waboot/user_theme/scss/user-custom.scss << 'EOF'
// User custom variables
// Add your custom SCSS variables here
// Example:
// $primary-color: #ff6b6b;
// $secondary-color: #4ecdc4;
EOF

    # Create user CSS file
    mkdir -p wa-apps/$app/themes/waboot/user_theme/css/
    cat > wa-apps/$app/themes/waboot/user_theme/css/user-custom.css << 'EOF'
/* User custom styles */
/* Add your custom CSS here */
/* Example: */
/* .custom-class { */
/*     color: #ff6b6b; */
/* } */
EOF

    # Create user JavaScript file
    mkdir -p wa-apps/$app/themes/waboot/user_theme/js/
    cat > wa-apps/$app/themes/waboot/user_theme/js/user-custom.js << 'EOF'
// User custom JavaScript
// Add your custom JavaScript here
// Example:
// document.addEventListener('DOMContentLoaded', function() {
//     console.log('Custom script loaded');
// });
EOF

    # Set proper permissions
    chmod 644 wa-apps/$app/themes/waboot/user_theme/scss/user-custom.scss
    chmod 644 wa-apps/$app/themes/waboot/user_theme/css/user-custom.css
    chmod 644 wa-apps/$app/themes/waboot/user_theme/js/user-custom.js
done
```
```

## SCSS File Structure

### **Site Theme SCSS**

```scss
// wa-apps/site/themes/waboot/lib/scss/main.scss
@import "_variables";
@import "bootstrap/bootstrap";
@import "_components";
@import "_utilities";
@import "../user_theme/scss/user-custom";  // Пользовательские переменные (последними)
```

### **Shop Theme SCSS**

```scss
// wa-apps/shop/themes/waboot/lib/scss/main.scss
// Parent imports are automatically added by compiler
@import "_shop-variables";
@import "../user_theme/scss/user-custom";  // Пользовательские переменные (последними)
@import "_shop-components";
@import "_shop-custom";
```

### **Blog Theme SCSS**

```scss
// wa-apps/blog/themes/waboot/lib/scss/main.scss
// Parent imports are automatically added by compiler
@import "_blog-variables";
@import "../user_theme/scss/user-custom";  // Пользовательские переменные (последними)
@import "_blog-components";
@import "_blog-custom";
```

### **User Customization Files Structure**

```
wa-apps/{app}/themes/waboot/
├── 📁 lib/scss/
│   ├── _variables.scss          # Основные переменные темы
│   ├── bootstrap/
│   ├── _components.scss
│   ├── _utilities.scss
│   └── main.scss               # Импортирует user-custom.scss
├── 📁 css/
│   ├── main.css                # Скомпилированный SCSS
│   └── bootstrap.css
├── 📁 js/
│   ├── main.js
│   └── alpine.js
├── 📁 user_theme/
│   ├── 📁 scss/
│   │   └── user-custom.scss    # Пользовательские переменные (пустой)
│   ├── 📁 css/
│   │   └── user-custom.css     # Пользовательские стили (пустой)
│   └── 📁 js/
│       └── user-custom.js      # Пользовательский скрипт (пустой)
└── 📁 templates/
    └── layout.html             # Подключает пользовательские файлы
```

## Webasyst Integration

### **Theme Configuration**

```xml
<!-- wa-apps/{app}/themes/waboot/theme.xml -->
<theme>
    <name>Waboot</name>
    <version>1.0.0</version>
    
    <!-- SCSS Compiler Settings -->
    <scss_compiler>
        <enabled>true</enabled>
        <cache_lifetime>3600</cache_lifetime>
        <output_style>compressed</output_style>
        <source_maps>false</source_maps>
    </scss_compiler>
    
    <!-- Asset Configuration -->
    <assets>
        <css>
            <file>css/main.css</file>
            <file>css/bootstrap.css</file>
        </css>
    </assets>
</theme>
```

### **Template Integration**

```smarty
{* In wa-apps/{app}/themes/waboot/templates/layout.html *}
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{$wa->title()|escape}</title>
    
    {* Load compiled CSS files *}
    {foreach $wa->theme()->getCssFiles() as $cssFile}
        <link rel="stylesheet" href="{$cssFile|escape:'url'}" />
    {/foreach}
    
    {* Load user CSS file (if exists) *}
    {if $wa->theme()->getUserCssFile()}
        <link rel="stylesheet" href="{$wa->theme()->getUserCssFile()|escape:'url'}" />
    {/if}
</head>
<body>
    {* Content here *}
    
    {* Load JavaScript files *}
    {foreach $wa->theme()->getJsFiles() as $jsFile}
        <script src="{$jsFile|escape:'url'}"></script>
    {/foreach}
    
    {* Load user JavaScript file (if exists) *}
    {if $wa->theme()->getUserJsFile()}
        <script src="{$wa->theme()->getUserJsFile()|escape:'url'}"></script>
    {/if}
</body>
</html>
```

## Performance Optimization

### **1. Caching Strategy**

```php
// Advanced caching with dependency tracking
class AdvancedCache extends Cache
{
    private $dependencyFile;
    
    public function __construct($cacheDir = null)
    {
        parent::__construct($cacheDir);
        $this->dependencyFile = $this->cacheDir . '/dependencies.json';
    }
    
    /**
     * Track file dependencies
     */
    public function trackDependencies($scssFile, $dependencies)
    {
        $deps = $this->loadDependencies();
        $deps[$scssFile] = $dependencies;
        $this->saveDependencies($deps);
    }
    
    /**
     * Check if any dependencies changed
     */
    public function dependenciesChanged($scssFile)
    {
        $deps = $this->loadDependencies();
        
        if (!isset($deps[$scssFile])) {
            return true;
        }
        
        foreach ($deps[$scssFile] as $depFile) {
            if (!file_exists($depFile) || 
                filemtime($depFile) > filemtime($scssFile)) {
                return true;
            }
        }
        
        return false;
    }
}
```

### **2. Lazy Loading**

```php
// Compile only when needed
public function compileOnDemand($scssFile)
{
    $cssFile = $this->generateOutputFilename($scssFile);
    
    // Check if compilation is needed
    if (file_exists($cssFile) && !$this->needsRecompilation($scssFile)) {
        return $cssFile;
    }
    
    // Compile only this file
    return $this->compile($scssFile, $cssFile);
}
```

## Troubleshooting

### **1. Common Issues**

**Issue: SCSS compilation fails**
```php
// Check file permissions
if (!is_readable($scssFile)) {
    throw new \RuntimeException("Cannot read SCSS file: {$scssFile}");
}

if (!is_writable($outputDir)) {
    throw new \RuntimeException("Cannot write to output directory: {$outputDir}");
}
```

**Issue: Memory exhaustion**
```php
// Set memory limit for large files
ini_set('memory_limit', '256M');

// Process files in chunks
private function compileLargeFile($scssFile)
{
    $content = file_get_contents($scssFile);
    $chunks = str_split($content, 1024 * 1024); // 1MB chunks
    
    foreach ($chunks as $chunk) {
        // Process chunk
        $this->processChunk($chunk);
    }
}
```

**Issue: Cache corruption**
```php
// Validate cache integrity
public function validateCache($cacheKey)
{
    $cacheFile = $this->getCacheFilePath($cacheKey);
    
    if (!file_exists($cacheFile)) {
        return false;
    }
    
    $cacheData = unserialize(file_get_contents($cacheFile));
    
    if (!$cacheData || !isset($cacheData['css_file'])) {
        return false;
    }
    
    return file_exists($cacheData['css_file']);
}
```

### **2. Debug Mode**

```php
// Enable debug mode for development
class DebugCompiler extends Compiler
{
    private $debug = false;
    
    public function setDebug($enabled)
    {
        $this->debug = $enabled;
    }
    
    public function compileForTheme($appId, $scssFile, $cssFile = null)
    {
        if ($this->debug) {
            waLog::log("Compiling SCSS: {$scssFile} for app: {$appId}", "waboot/scss-debug.log");
        }
        
        $result = parent::compileForTheme($appId, $scssFile, $cssFile);
        
        if ($this->debug) {
            waLog::log("Compilation completed: {$result}", "waboot/scss-debug.log");
        }
        
        return $result;
    }
}
```

## Benefits of Centralized Architecture

### **1. Code Efficiency**
- Single compiler instance
- No code duplication
- Easier maintenance

### **2. Performance**
- Shared cache across all themes
- Centralized optimization
- Reduced memory usage

### **3. Consistency**
- Same compilation logic everywhere
- Unified error handling
- Consistent output format

### **4. Webasyst Native**
- Follows platform architecture
- Leverages site theme dependency
- Proper inheritance model

### **5. Simplicity**
- One place to update
- Clear API interface
- Minimal configuration

### **6. User Customization**
- Safe user customization files
- No risk of breaking theme updates
- Clear separation of user and theme code

## Conclusion

The centralized architecture is the **optimal solution for Webasyst** because:

1. **Follows Webasyst Principles** - Site theme is always required
2. **Eliminates Code Duplication** - Single compiler instance
3. **Simplifies Maintenance** - One place to update
4. **Improves Performance** - Shared cache and optimization
5. **Maintains Consistency** - Same logic across all themes

This approach leverages the fundamental Webasyst architecture where the site theme is the mandatory foundation for all child themes.

## User Customization Features

### **Safe Customization Files**

The theme includes three user customization files that are safe to modify:

1. **`user-custom.scss`** - User SCSS variables (imported last, so they override theme variables)
2. **`user-custom.css`** - User CSS styles (loaded after theme styles)
3. **`user-custom.js`** - User JavaScript (loaded after theme scripts)

### **File Protection**

- User files are **never overwritten** during theme updates
- User files are **excluded** from main asset lists
- User files are **loaded last** to ensure they override theme defaults
- User files are **optional** - they only load if they exist and have content

### **Usage Examples**

**SCSS Variables (user-custom.scss):**
```scss
// Override theme colors
$primary-color: #ff6b6b;
$secondary-color: #4ecdc4;

// Add custom variables
$custom-spacing: 2rem;
$custom-border-radius: 8px;
```

**CSS Styles (user-custom.css):**
```css
/* Custom styles */
.custom-header {
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
}

.custom-button {
    border-radius: 8px;
    padding: 1rem 2rem;
}
```

**JavaScript (user-custom.js):**
```javascript
// Custom functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add custom event listeners
    document.querySelectorAll('.custom-button').forEach(button => {
        button.addEventListener('click', function() {
            console.log('Custom button clicked');
        });
    });
});
```

### **Installation Safety**

When users install the theme from Webasyst store:

1. **Empty files are created** automatically
2. **Files are ready for customization** immediately
3. **No risk of breaking** theme functionality
4. **Easy to identify** which files are safe to edit

---

**Version:** 1.0.0  
**Last Updated:** January 2025  
**License:** MIT  
**Maintainer:** Waboot Team