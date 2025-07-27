/*!
 * Site App Alpine.js Components
 * Bootstrap 5 + Alpine.js + BEM + Atomic Design
 * Version: 3.0.0
 */

// Wait for Alpine.js to be available
document.addEventListener('alpine:init', () => {
    
    // =========================================================================
    // Global Site Store
    // =========================================================================
    
    Alpine.store('site', {
        // Navigation state
        mobileMenuOpen: false,
        searchOpen: false,
        userMenuOpen: false,
        
        // UI state
        loading: false,
        scrolled: false,
        backToTopVisible: false,
        
        // Contact form state
        contactFormSubmitted: false,
        
        // Methods
        init() {
            this.handleScroll();
            window.addEventListener('scroll', () => this.handleScroll());
            window.addEventListener('resize', () => this.handleResize());
        },
        
        handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            this.scrolled = scrollTop > 50;
            this.backToTopVisible = scrollTop > 300;
        },
        
        handleResize() {
            if (window.innerWidth >= 992) {
                this.mobileMenuOpen = false;
            }
        },
        
        toggleMobileMenu() {
            this.mobileMenuOpen = !this.mobileMenuOpen;
            document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
        },
        
        closeMobileMenu() {
            this.mobileMenuOpen = false;
            document.body.style.overflow = '';
        },
        
        toggleSearch() {
            this.searchOpen = !this.searchOpen;
            if (this.searchOpen) {
                this.$nextTick(() => {
                    document.querySelector('.site__search input')?.focus();
                });
            }
        },
        
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
    
    // =========================================================================
    // Site Header Component
    // =========================================================================
    
    Alpine.data('siteHeader', () => ({
        sticky: false,
        scrolled: false,
        
        init() {
            this.handleScroll();
            window.addEventListener('scroll', () => this.handleScroll());
        },
        
        handleScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            this.scrolled = scrollTop > 50;
            
            if (this.sticky) {
                this.$el.classList.toggle('site__header--scrolled', this.scrolled);
            }
        }
    }));
    
    // =========================================================================
    // Search Component
    // =========================================================================
    
    Alpine.data('siteSearch', () => ({
        query: '',
        suggestions: [],
        showSuggestions: false,
        selectedIndex: -1,
        loading: false,
        
        async search() {
            if (!this.query.trim()) {
                this.suggestions = [];
                this.showSuggestions = false;
                return;
            }
            
            this.loading = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Mock suggestions
                this.suggestions = [
                    { title: 'Sample Page 1', url: '/page1/', type: 'page' },
                    { title: 'Sample Page 2', url: '/page2/', type: 'page' },
                    { title: 'Contact Us', url: '/contact/', type: 'page' }
                ].filter(item => 
                    item.title.toLowerCase().includes(this.query.toLowerCase())
                );
                
                this.showSuggestions = this.suggestions.length > 0;
                this.selectedIndex = -1;
                
            } catch (error) {
                console.error('Search error:', error);
                this.suggestions = [];
                this.showSuggestions = false;
            } finally {
                this.loading = false;
            }
        },
        
        handleKeydown(event) {
            if (!this.showSuggestions) return;
            
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
                    break;
                    
                case 'ArrowUp':
                    event.preventDefault();
                    this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                    break;
                    
                case 'Enter':
                    event.preventDefault();
                    if (this.selectedIndex >= 0) {
                        this.selectSuggestion(this.suggestions[this.selectedIndex]);
                    } else {
                        this.submitSearch();
                    }
                    break;
                    
                case 'Escape':
                    this.showSuggestions = false;
                    this.selectedIndex = -1;
                    break;
            }
        },
        
        selectSuggestion(suggestion) {
            window.location.href = suggestion.url;
        },
        
        submitSearch() {
            if (this.query.trim()) {
                window.location.href = `/search/?q=${encodeURIComponent(this.query)}`;
            }
        },
        
        hideSuggestions() {
            setTimeout(() => {
                this.showSuggestions = false;
                this.selectedIndex = -1;
            }, 200);
        }
    }));
    
    // =========================================================================
    // Contact Form Component
    // =========================================================================
    
    Alpine.data('contactForm', () => ({
        form: {
            name: '',
            email: '',
            subject: '',
            phone: '',
            message: ''
        },
        errors: {},
        loading: false,
        submitted: false,
        
        validateField(field, value) {
            switch (field) {
                case 'name':
                    if (!value?.trim()) {
                        this.errors.name = 'Name is required';
                        return false;
                    }
                    break;
                    
                case 'email':
                    if (!value?.trim()) {
                        this.errors.email = 'Email is required';
                        return false;
                    }
                    if (!this.isValidEmail(value)) {
                        this.errors.email = 'Please enter a valid email address';
                        return false;
                    }
                    break;
                    
                case 'message':
                    if (!value?.trim()) {
                        this.errors.message = 'Message is required';
                        return false;
                    }
                    if (value.trim().length < 10) {
                        this.errors.message = 'Message must be at least 10 characters long';
                        return false;
                    }
                    break;
            }
            
            delete this.errors[field];
            return true;
        },
        
        isValidEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },
        
        async submitForm() {
            this.errors = {};
            
            // Validate all required fields
            const isValid = [
                this.validateField('name', this.form.name),
                this.validateField('email', this.form.email),
                this.validateField('message', this.form.message)
            ].every(Boolean);
            
            if (!isValid) {
                return;
            }
            
            this.loading = true;
            
            try {
                const formData = new FormData();
                Object.keys(this.form).forEach(key => {
                    formData.append(key, this.form[key]);
                });
                
                const response = await fetch(this.$el.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                if (response.ok) {
                    this.submitted = true;
                    this.resetForm();
                    
                    // Store in global state
                    Alpine.store('site').contactFormSubmitted = true;
                    
                } else {
                    const data = await response.json();
                    this.errors.general = data.message || 'Something went wrong. Please try again.';
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                this.errors.general = 'Network error. Please check your connection and try again.';
            } finally {
                this.loading = false;
            }
        },
        
        resetForm() {
            this.form = {
                name: '',
                email: '',
                subject: '',
                phone: '',
                message: ''
            };
            this.errors = {};
        }
    }));
    
    // =========================================================================
    // Animation Helper Component
    // =========================================================================
    
    Alpine.data('animateOnScroll', (options = {}) => ({
        visible: false,
        
        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.visible = true;
                        if (options.once !== false) {
                            observer.unobserve(entry.target);
                        }
                    } else if (options.once === false) {
                        this.visible = false;
                    }
                });
            }, {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '0px'
            });
            
            observer.observe(this.$el);
        }
    }));
    
    // =========================================================================
    // Image Lazy Loading Component
    // =========================================================================
    
    Alpine.data('lazyImage', () => ({
        loaded: false,
        error: false,
        
        init() {
            const img = this.$el;
            const src = img.dataset.src;
            
            if (!src) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(src);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });
            
            observer.observe(img);
        },
        
        loadImage(src) {
            const img = new Image();
            
            img.onload = () => {
                this.$el.src = src;
                this.loaded = true;
                this.$el.classList.add('loaded');
            };
            
            img.onerror = () => {
                this.error = true;
                this.$el.classList.add('error');
            };
            
            img.src = src;
        }
    }));
    
    // =========================================================================
    // Modal Component
    // =========================================================================
    
    Alpine.data('modal', () => ({
        open: false,
        
        show() {
            this.open = true;
            document.body.style.overflow = 'hidden';
            this.$nextTick(() => {
                this.$refs.modal?.focus();
            });
        },
        
        hide() {
            this.open = false;
            document.body.style.overflow = '';
        },
        
        handleKeydown(event) {
            if (event.key === 'Escape') {
                this.hide();
            }
        },
        
        handleBackdropClick(event) {
            if (event.target === event.currentTarget) {
                this.hide();
            }
        }
    }));
    
    // =========================================================================
    // Accordion Component
    // =========================================================================
    
    Alpine.data('accordion', () => ({
        activeIndex: null,
        
        toggle(index) {
            this.activeIndex = this.activeIndex === index ? null : index;
        },
        
        isActive(index) {
            return this.activeIndex === index;
        }
    }));
    
    // =========================================================================
    // Copy to Clipboard Component
    // =========================================================================
    
    Alpine.data('copyToClipboard', () => ({
        copied: false,
        
        async copy(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.copied = true;
                
                setTimeout(() => {
                    this.copied = false;
                }, 2000);
                
            } catch (error) {
                console.error('Copy failed:', error);
                
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    this.copied = true;
                    
                    setTimeout(() => {
                        this.copied = false;
                    }, 2000);
                } catch (fallbackError) {
                    console.error('Fallback copy failed:', fallbackError);
                }
                
                document.body.removeChild(textArea);
            }
        }
    }));
    
    // =========================================================================
    // Utility Functions
    // =========================================================================
    
    Alpine.magic('debounce', () => {
        return (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };
    });
    
    Alpine.magic('throttle', () => {
        return (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };
    });
    
});

// =========================================================================
// Initialize Site Store
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    if (window.Alpine) {
        Alpine.store('site').init();
    }
});