/*!
 * Waboot Theme JavaScript
 * WordPress Bootscore to Webasyst Migration
 * Built with Alpine.js for micro-interactions and reactivity
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out-sine',
            once: true,
            mirror: false,
            offset: 50,
            delay: 100
        });
    }

    // Waboot Theme JavaScript Module
    const WabootTheme = {
        
        // Initialize theme functionality
        init: function() {
            this.setupNavigation();
            this.setupSmoothScrolling();
            this.setupFormHandlers();
            this.setupLazyLoading();
            this.setupProductInteractions();
            this.setupNewsletterForm();
            this.setupBackToTop();
            this.setupSearchToggle();
            this.setupMobileMenu();
        },

        // Enhanced Navigation
        setupNavigation: function() {
            // Add active class to current navigation item
            const currentUrl = window.location.pathname;
            const navLinks = document.querySelectorAll('.waboot__nav-link');
            
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentUrl) {
                    link.classList.add('waboot__nav-link--active');
                }
            });

            // Dropdown hover enhancement
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                let hideTimeout;
                
                dropdown.addEventListener('mouseenter', function() {
                    clearTimeout(hideTimeout);
                    const menu = this.querySelector('.dropdown-menu');
                    if (menu) {
                        menu.classList.add('show');
                    }
                });
                
                dropdown.addEventListener('mouseleave', function() {
                    const menu = this.querySelector('.dropdown-menu');
                    hideTimeout = setTimeout(() => {
                        if (menu) {
                            menu.classList.remove('show');
                        }
                    }, 300);
                });
            });
        },

        // Smooth scrolling for anchor links
        setupSmoothScrolling: function() {
            const anchors = document.querySelectorAll('a[href^="#"]');
            anchors.forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        },

        // Enhanced form handling
        setupFormHandlers: function() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => {
                // Add loading states to submit buttons
                const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
                if (submitBtn) {
                    form.addEventListener('submit', function() {
                        submitBtn.disabled = true;
                        const originalText = submitBtn.textContent || submitBtn.value;
                        if (submitBtn.tagName === 'BUTTON') {
                            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Loading...';
                        } else {
                            submitBtn.value = 'Processing...';
                        }
                        
                        // Re-enable after 3 seconds as fallback
                        setTimeout(() => {
                            submitBtn.disabled = false;
                            if (submitBtn.tagName === 'BUTTON') {
                                submitBtn.textContent = originalText;
                            } else {
                                submitBtn.value = originalText;
                            }
                        }, 3000);
                    });
                }
            });
        },

        // Lazy loading for images
        setupLazyLoading: function() {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('lazy-loaded');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                imageObserver.observe(img);
            });
        },

        // Product interaction enhancements
        setupProductInteractions: function() {
            // Quick view functionality
            const quickViewBtns = document.querySelectorAll('.waboot__btn-quick-view');
            quickViewBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const productId = this.dataset.productId;
                    this.showQuickView(productId);
                });
            });

            // Wishlist toggle
            const wishlistBtns = document.querySelectorAll('.waboot__btn-wishlist');
            wishlistBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const productId = this.dataset.productId;
                    this.classList.toggle('active');
                    this.toggleWishlist(productId);
                });
            });

            // Add to cart with animation
            const addToCartBtns = document.querySelectorAll('.waboot__btn-add-to-cart');
            addToCartBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const originalText = this.textContent;
                    this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Adding...';
                    this.disabled = true;

                    // Simulate AJAX call (replace with actual Webasyst cart API)
                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-check me-2"></i>Added!';
                        this.classList.add('btn-success');
                        
                        setTimeout(() => {
                            this.textContent = originalText;
                            this.classList.remove('btn-success');
                            this.disabled = false;
                        }, 1500);
                    }, 1000);
                });
            });
        },

        // Newsletter form handling
        setupNewsletterForm: function() {
            const newsletterForms = document.querySelectorAll('.waboot__newsletter-form');
            newsletterForms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const email = form.querySelector('input[type="email"]').value;
                    const btn = form.querySelector('.waboot__newsletter-btn');
                    
                    if (this.validateEmail(email)) {
                        btn.textContent = 'Subscribing...';
                        btn.disabled = true;
                        
                        // Simulate AJAX call (replace with actual Webasyst newsletter API)
                        setTimeout(() => {
                            btn.textContent = 'Subscribed!';
                            btn.classList.add('btn-success');
                            form.reset();
                            
                            setTimeout(() => {
                                btn.textContent = 'Subscribe';
                                btn.classList.remove('btn-success');
                                btn.disabled = false;
                            }, 2000);
                        }, 1000);
                    }
                });
            });
        },

        // Back to top button
        setupBackToTop: function() {
            const backToTopBtn = document.createElement('button');
            backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            backToTopBtn.className = 'waboot__back-to-top btn btn-primary rounded-circle position-fixed';
            backToTopBtn.style.cssText = `
                bottom: 2rem;
                right: 2rem;
                width: 3rem;
                height: 3rem;
                z-index: 1030;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            `;
            document.body.appendChild(backToTopBtn);

            // Show/hide on scroll
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopBtn.style.opacity = '1';
                    backToTopBtn.style.visibility = 'visible';
                } else {
                    backToTopBtn.style.opacity = '0';
                    backToTopBtn.style.visibility = 'hidden';
                }
            });

            // Scroll to top on click
            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        },

        // Search toggle functionality
        setupSearchToggle: function() {
            const searchToggle = document.querySelector('.waboot__search-toggle');
            const searchForm = document.querySelector('.waboot__search-form');
            
            if (searchToggle && searchForm) {
                searchToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    searchForm.classList.toggle('active');
                    const searchInput = searchForm.querySelector('input[type="search"]');
                    if (searchInput) {
                        searchInput.focus();
                    }
                });

                // Close search on Escape key
                document.addEventListener('keydown', function(e) {
                    if (e.key === 'Escape' && searchForm.classList.contains('active')) {
                        searchForm.classList.remove('active');
                    }
                });
            }
        },

        // Enhanced mobile menu
        setupMobileMenu: function() {
            const mobileToggle = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            
            if (mobileToggle && navbarCollapse) {
                mobileToggle.addEventListener('click', function() {
                    // Add smooth animation class
                    navbarCollapse.classList.add('animating');
                    
                    setTimeout(() => {
                        navbarCollapse.classList.remove('animating');
                    }, 350);
                });

                // Close mobile menu when clicking on links
                const mobileNavLinks = navbarCollapse.querySelectorAll('.nav-link');
                mobileNavLinks.forEach(link => {
                    link.addEventListener('click', function() {
                        if (window.innerWidth < 992) {
                            navbarCollapse.classList.remove('show');
                        }
                    });
                });
            }
        },

        // Utility functions
        validateEmail: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        showQuickView: function(productId) {
            // Implement quick view modal (integrate with Webasyst product API)
            console.log('Quick view for product:', productId);
            // This would be replaced with actual Webasyst implementation
        },

        toggleWishlist: function(productId) {
            // Implement wishlist toggle (integrate with Webasyst wishlist API)
            console.log('Toggle wishlist for product:', productId);
            // This would be replaced with actual Webasyst implementation
        }
    };

    // Initialize theme
    WabootTheme.init();

    // Make WabootTheme available globally
    window.WabootTheme = WabootTheme;
});

// Alpine.js store for theme state management
document.addEventListener('alpine:init', () => {
    Alpine.store('waboot', {
        // Cart state
        cartItems: [],
        cartTotal: 0,
        cartCount: 0,

        // Search state
        searchQuery: '',
        searchResults: [],
        isSearching: false,

        // Wishlist state
        wishlistItems: [],
        wishlistCount: 0,

        // Theme settings
        settings: {
            currency: '$',
            locale: 'en',
            animations: true
        },

        // Methods
        addToCart(product) {
            const existingItem = this.cartItems.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cartItems.push({ ...product, quantity: 1 });
            }
            this.updateCartTotals();
        },

        removeFromCart(productId) {
            this.cartItems = this.cartItems.filter(item => item.id !== productId);
            this.updateCartTotals();
        },

        updateCartTotals() {
            this.cartCount = this.cartItems.reduce((total, item) => total + item.quantity, 0);
            this.cartTotal = this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        },

        toggleWishlist(product) {
            const existingIndex = this.wishlistItems.findIndex(item => item.id === product.id);
            if (existingIndex > -1) {
                this.wishlistItems.splice(existingIndex, 1);
            } else {
                this.wishlistItems.push(product);
            }
            this.wishlistCount = this.wishlistItems.length;
        },

        async search(query) {
            this.isSearching = true;
            this.searchQuery = query;
            
            try {
                // Simulate API call (replace with actual Webasyst search API)
                await new Promise(resolve => setTimeout(resolve, 500));
                this.searchResults = []; // Replace with actual results
                
            } catch (error) {
                console.error('Search error:', error);
                this.searchResults = [];
            } finally {
                this.isSearching = false;
            }
        },

        formatPrice(price) {
            return this.settings.currency + price.toFixed(2);
        }
    });
});

// CSS animations for smooth interactions
const wabootStyles = `
.waboot__back-to-top:hover {
    transform: translateY(-2px);
}

.waboot__search-form {
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
}

.waboot__search-form.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.navbar-collapse.animating {
    transition: height 0.35s ease;
}

.lazy {
    opacity: 0;
    transition: opacity 0.3s;
}

.lazy-loaded {
    opacity: 1;
}

.waboot__btn-wishlist.active {
    color: #dc3545 !important;
    border-color: #dc3545 !important;
}

.waboot__product-card {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.waboot__testimonial-card {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = wabootStyles;
document.head.appendChild(styleSheet);
