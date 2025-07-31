<?php

/**
 * Site Application Configuration
 * Migrated to Bootstrap 5 + Alpine.js + BEM + Atomic Design methodology
 * 
 * @package Site
 * @version 3.0.0
 */

return array(
    'name'        => 'Site',
    'icon'        => 'site',
    'version'     => '3.0.0',
    'critical'    => true,
    'system'      => true,
    'vendor'      => 'webasyst',
    'csrf'        => true,
    'rights'      => true,
    'plugins'     => true,
    'themes'      => true,
    'frontend'    => true,
    'mobile'      => true,
    'description' => 'Webasyst Site app with modern Bootstrap 5 + Alpine.js + BEM + Atomic Design architecture',
    
    // Modern stack features
    'features' => array(
        'bootstrap5' => true,
        'alpinejs' => true,
        'bem_methodology' => true,
        'atomic_design' => true,
        'local_assets' => true,
        'responsive_design' => true,
        'accessibility' => true,
        'seo_optimized' => true,
        'progressive_enhancement' => true
    ),
    
    // Asset management
    'assets' => array(
        'css' => array(
            'vendor/bootstrap-5.3.7.min.css',
            'vendor/aos-2.3.4.css',
            'vendor/fontawesome-7.0.0.all.min.css',
            'atoms/atoms.css',
            'molecules/molecules.css',
            'organisms/organisms.css',
            'templates/templates.css',
            'utilities/utilities.css',
            'site.css'
        ),
        'js' => array(
            'vendor/bootstrap-5.3.7.bundle.min.js',
            'vendor/alpine-3.14.9.min.js',
            'vendor/aos-2.3.4.js',
            'components/site-components.js',
            'site.js'
        )
    ),
    
    // Frontend routing
    'routing' => array(
        'default' => array(
            'url' => '*',
            'module' => 'frontend',
            'action' => 'default'
        ),
        'page' => array(
            'url' => '<url>',
            'module' => 'frontend',
            'action' => 'page'
        )
    ),
    
    // Theme compatibility
    'theme_compatibility' => array(
        'bootstrap_version' => '5.3.7',
        'alpine_version' => '3.14.9',
        'aos_version' => '2.3.4',
        'fontawesome_version' => '7.0.0',
        'css_methodology' => 'BEM',
        'design_system' => 'Atomic Design'
    ),
    
    // Performance settings
    'performance' => array(
        'cache_templates' => true,
        'minify_assets' => true,
        'lazy_loading' => true,
        'preload_critical' => true
    )
);