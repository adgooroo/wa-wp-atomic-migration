<?php

/**
 * Site Frontend Controller
 * Enhanced for Bootstrap 5 + Alpine.js + BEM + Atomic Design
 * 
 * @package Site
 * @version 3.0.0
 */
class siteFrontendController extends waController
{
    protected $theme;
    protected $routing;
    
    public function __construct()
    {
        parent::__construct();
        $this->theme = waRequest::param('theme', 'default');
        $this->routing = wa('site')->getRouting();
    }
    
    public function execute()
    {
        $url = waRequest::param('url', '');
        
        // Handle homepage
        if (empty($url)) {
            $this->executeHome();
            return;
        }
        
        // Handle page routes
        $this->executePage($url);
    }
    
    /**
     * Execute homepage
     */
    protected function executeHome()
    {
        $this->setLayout('layout.html');
        $this->setTemplate('home.html');
        
        $this->assignPageData(array(
            'page_type' => 'home',
            'page_title' => $this->getAppSettings('site_name', 'My Site'),
            'meta_description' => $this->getAppSettings('site_description', ''),
            'body_class' => 'site-home',
            'og_type' => 'website'
        ));
        
        // Assign home page specific data
        $this->view->assign(array(
            'hero_title' => $this->getAppSettings('hero_title', 'Welcome to Our Site'),
            'hero_subtitle' => $this->getAppSettings('hero_subtitle', ''),
            'hero_image' => $this->getAppSettings('hero_image', ''),
            'featured_content' => $this->getFeaturedContent(),
            'testimonials' => $this->getTestimonials(),
            'latest_news' => $this->getLatestNews()
        ));
    }
    
    /**
     * Execute page by URL
     */
    protected function executePage($url)
    {
        $page_model = new sitePageModel();
        $page = $page_model->getByUrl($url);
        
        if (!$page) {
            throw new waException('Page not found', 404);
        }
        
        $this->setLayout('layout.html');
        $this->setTemplate('page.html');
        
        $this->assignPageData(array(
            'page_type' => 'page',
            'page_title' => $page['title'],
            'meta_description' => $page['meta_description'],
            'meta_keywords' => $page['meta_keywords'],
            'body_class' => 'site-page page-' . $page['url'],
            'og_type' => 'article',
            'canonical_url' => $this->getCanonicalUrl($page)
        ));
        
        $this->view->assign(array(
            'page' => $page,
            'content' => $this->renderPageContent($page),
            'breadcrumbs' => $this->getBreadcrumbs($page),
            'sidebar_content' => $this->getSidebarContent($page)
        ));
    }
    
    /**
     * Assign common page data for SEO and meta tags
     */
    protected function assignPageData($data)
    {
        // Set page title
        wa()->getResponse()->setTitle($data['page_title']);
        
        // Set meta description
        if (!empty($data['meta_description'])) {
            wa()->getResponse()->setMeta('description', $data['meta_description']);
        }
        
        // Set meta keywords
        if (!empty($data['meta_keywords'])) {
            wa()->getResponse()->setMeta('keywords', $data['meta_keywords']);
        }
        
        // Set canonical URL
        if (!empty($data['canonical_url'])) {
            wa()->getResponse()->setMeta('canonical', $data['canonical_url']);
        }
        
        // Assign to view
        $this->view->assign(array(
            'wa_title' => $data['page_title'],
            'meta_description' => $data['meta_description'] ?? '',
            'meta_keywords' => $data['meta_keywords'] ?? '',
            'canonical' => $data['canonical_url'] ?? '',
            'page_type' => $data['page_type'],
            'body_class' => $data['body_class'],
            'og_type' => $data['og_type']
        ));
        
        // Load theme assets
        $this->loadThemeAssets();
        
        // Set JSON-LD structured data
        $this->setStructuredData($data);
    }
    
    /**
     * Load theme assets (CSS/JS) based on atomic design
     */
    protected function loadThemeAssets()
    {
        $theme_url = wa()->getAppStaticUrl('site') . 'themes/' . $this->theme . '/';
        
        // Load CSS in order: vendor -> atoms -> molecules -> organisms -> templates -> utilities
        $css_files = array(
            'css/vendor/bootstrap.min.css',
            'css/vendor/aos.min.css',
            'css/atoms/atoms.css',
            'css/molecules/molecules.css',
            'css/organisms/organisms.css',
            'css/templates/templates.css',
            'css/utilities/utilities.css',
            'css/site.css'
        );
        
        foreach ($css_files as $css_file) {
            if (file_exists(wa()->getAppPath('themes/' . $this->theme . '/' . $css_file, 'site'))) {
                wa()->getResponse()->addCss($theme_url . $css_file);
            }
        }
        
        // Load JavaScript: vendor first, then components
        $js_files = array(
            'js/vendor/bootstrap.bundle.min.js',
            'js/vendor/alpine.min.js',
            'js/vendor/aos.min.js',
            'js/components/site-components.js',
            'js/site.js'
        );
        
        foreach ($js_files as $js_file) {
            if (file_exists(wa()->getAppPath('themes/' . $this->theme . '/' . $js_file, 'site'))) {
                wa()->getResponse()->addJs($theme_url . $js_file);
            }
        }
    }
    
    /**
     * Set JSON-LD structured data
     */
    protected function setStructuredData($data)
    {
        $structured_data = array(
            '@context' => 'https://schema.org',
            '@type' => $data['og_type'] === 'article' ? 'Article' : 'WebSite',
            'name' => $data['page_title'],
            'url' => wa()->getRouteUrl('site/frontend'),
            'publisher' => array(
                '@type' => 'Organization',
                'name' => $this->getAppSettings('site_name', 'My Site')
            )
        );
        
        if (!empty($data['meta_description'])) {
            $structured_data['description'] = $data['meta_description'];
        }
        
        wa()->getResponse()->addJs(json_encode($structured_data), array('type' => 'application/ld+json'));
    }
    
    /**
     * Get app settings
     */
    protected function getAppSettings($key, $default = null)
    {
        $app_settings = wa('site')->getSettings();
        return isset($app_settings[$key]) ? $app_settings[$key] : $default;
    }
    
    /**
     * Get featured content for homepage
     */
    protected function getFeaturedContent()
    {
        // This would typically fetch from database
        return array(
            array(
                'title' => 'Feature 1',
                'description' => 'Description of feature 1',
                'image' => '',
                'link' => ''
            ),
            array(
                'title' => 'Feature 2', 
                'description' => 'Description of feature 2',
                'image' => '',
                'link' => ''
            ),
            array(
                'title' => 'Feature 3',
                'description' => 'Description of feature 3', 
                'image' => '',
                'link' => ''
            )
        );
    }
    
    /**
     * Get testimonials
     */
    protected function getTestimonials()
    {
        return array();
    }
    
    /**
     * Get latest news
     */
    protected function getLatestNews()
    {
        return array();
    }
    
    /**
     * Render page content with Smarty
     */
    protected function renderPageContent($page)
    {
        return $page['content'];
    }
    
    /**
     * Get breadcrumbs for page
     */
    protected function getBreadcrumbs($page)
    {
        return array(
            array('name' => 'Home', 'url' => wa()->getRouteUrl('site/frontend')),
            array('name' => $page['title'], 'url' => '')
        );
    }
    
    /**
     * Get sidebar content
     */
    protected function getSidebarContent($page)
    {
        return array();
    }
    
    /**
     * Get canonical URL
     */
    protected function getCanonicalUrl($page)
    {
        return wa()->getRouteUrl('site/frontend') . $page['url'] . '/';
    }
}