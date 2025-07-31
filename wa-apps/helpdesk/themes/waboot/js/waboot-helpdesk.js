/**
 * Waboot Helpdesk Theme JavaScript
 * Alpine.js components and functionality for Helpdesk theme
 * Inherits from parent Site app Waboot theme with Helpdesk-specific features
 */

// Import parent theme utilities
import { debounce, throttle } from '../../../site-app/themes/default/js/utils.js';

/**
 * Alpine.js Data and Components
 */
document.addEventListener('alpine:init', () => {
    
    /**
     * Ticket Card Component
     * Handles individual ticket card interactions
     */
    Alpine.data('ticketCard', (ticketId) => ({
        ticketId: ticketId,
        isReplying: false,
        replyText: '',
        
        init() {
            // Initialize ticket card
            this.$watch('replyText', (value) => {
                // Auto-resize textarea if needed
                if (this.$refs.replyTextarea) {
                    this.$refs.replyTextarea.style.height = 'auto';
                    this.$refs.replyTextarea.style.height = this.$refs.replyTextarea.scrollHeight + 'px';
                }
            });
        },
        
        showReplyForm() {
            this.isReplying = true;
            this.$nextTick(() => {
                if (this.$refs.replyTextarea) {
                    this.$refs.replyTextarea.focus();
                }
            });
        },
        
        hideReplyForm() {
            this.isReplying = false;
            this.replyText = '';
        },
        
        async submitReply() {
            if (!this.replyText.trim()) {
                return;
            }
            
            try {
                const response = await fetch(`/helpdesk/ticket/${this.ticketId}/reply`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
                    },
                    body: JSON.stringify({
                        message: this.replyText,
                        ticket_id: this.ticketId
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        // Hide reply form and show success message
                        this.hideReplyForm();
                        this.showNotification('Reply submitted successfully', 'success');
                        
                        // Optionally refresh the page or update the ticket
                        if (result.refresh) {
                            window.location.reload();
                        }
                    } else {
                        this.showNotification(result.message || 'Failed to submit reply', 'error');
                    }
                } else {
                    this.showNotification('Failed to submit reply', 'error');
                }
            } catch (error) {
                console.error('Error submitting reply:', error);
                this.showNotification('An error occurred while submitting your reply', 'error');
            }
        },
        
        showNotification(message, type = 'info') {
            // Use parent theme notification system or create simple alert
            if (window.showNotification) {
                window.showNotification(message, type);
            } else {
                alert(message);
            }
        }
    }));
    
    /**
     * FAQ Item Component
     * Handles FAQ accordion functionality
     */
    Alpine.data('faqItem', (initialExpanded = false) => ({
        expanded: initialExpanded,
        
        toggle() {
            this.expanded = !this.expanded;
            
            // Track FAQ interaction for analytics
            if (this.expanded) {
                this.trackFAQView();
            }
        },
        
        trackFAQView() {
            const faqId = this.$el.dataset.faqId;
            if (faqId && window.gtag) {
                gtag('event', 'faq_view', {
                    'faq_id': faqId,
                    'faq_question': this.$el.querySelector('[itemprop="name"]').textContent
                });
            }
        }
    }));
    
    /**
     * FAQ Section Component
     * Handles FAQ search and filtering
     */
    Alpine.data('faqSection', () => ({
        searchQuery: '',
        selectedCategory: 'all',
        visibleCount: 0,
        allFAQs: [],
        
        init() {
            // Get all FAQ items for filtering
            this.allFAQs = Array.from(this.$el.querySelectorAll('.waboot-helpdesk__faq-section__faq-item'));
            this.updateVisibleCount();
            
            // Initialize search from URL params
            const urlParams = new URLSearchParams(window.location.search);
            this.searchQuery = urlParams.get('q') || '';
            this.selectedCategory = urlParams.get('category') || 'all';
            
            if (this.searchQuery) {
                this.searchFAQs();
            }
        },
        
        searchFAQs() {
            const query = this.searchQuery.toLowerCase().trim();
            
            this.allFAQs.forEach(faq => {
                const question = faq.querySelector('[itemprop="name"]').textContent.toLowerCase();
                const answer = faq.querySelector('[itemprop="text"]').textContent.toLowerCase();
                const category = faq.dataset.category;
                
                const matchesSearch = !query || question.includes(query) || answer.includes(query);
                const matchesCategory = this.selectedCategory === 'all' || category === this.selectedCategory;
                
                const isVisible = matchesSearch && matchesCategory;
                faq.style.display = isVisible ? 'block' : 'none';
            });
            
            this.updateVisibleCount();
            this.updateURL();
            
            // Track search
            if (query && window.gtag) {
                gtag('event', 'faq_search', {
                    'search_term': query,
                    'results_count': this.visibleCount
                });
            }
        },
        
        filterByCategory(category) {
            this.selectedCategory = category;
            this.searchFAQs();
            
            // Track category filter
            if (window.gtag) {
                gtag('event', 'faq_category_filter', {
                    'category': category
                });
            }
        },
        
        updateVisibleCount() {
            this.visibleCount = this.allFAQs.filter(faq => 
                faq.style.display !== 'none'
            ).length;
        },
        
        updateURL() {
            const url = new URL(window.location);
            
            if (this.searchQuery) {
                url.searchParams.set('q', this.searchQuery);
            } else {
                url.searchParams.delete('q');
            }
            
            if (this.selectedCategory !== 'all') {
                url.searchParams.set('category', this.selectedCategory);
            } else {
                url.searchParams.delete('category');
            }
            
            window.history.replaceState({}, '', url);
        },
        
        isVisible(category) {
            return this.selectedCategory === 'all' || category === this.selectedCategory;
        }
    }));
    
    /**
     * Ticket List Component
     * Handles ticket list filtering and pagination
     */
    Alpine.data('ticketList', () => ({
        filters: {
            status: '',
            priority: '',
            sort: 'created_desc',
            search: ''
        },
        
        init() {
            // Initialize filters from URL params
            const urlParams = new URLSearchParams(window.location.search);
            this.filters.status = urlParams.get('status') || '';
            this.filters.priority = urlParams.get('priority') || '';
            this.filters.sort = urlParams.get('sort') || 'created_desc';
            this.filters.search = urlParams.get('search') || '';
        },
        
        applyFilters() {
            const url = new URL(window.location);
            
            // Update URL params
            Object.entries(this.filters).forEach(([key, value]) => {
                if (value) {
                    url.searchParams.set(key, value);
                } else {
                    url.searchParams.delete(key);
                }
            });
            
            // Navigate to filtered URL
            window.location.href = url.toString();
        },
        
        resetFilters() {
            this.filters = {
                status: '',
                priority: '',
                sort: 'created_desc',
                search: ''
            };
            
            // Navigate to base URL
            window.location.href = window.location.pathname;
        }
    }));
    
    /**
     * Helpdesk Layout Component
     * Handles overall layout functionality
     */
    Alpine.data('helpdeskLayout', () => ({
        sidebarOpen: false,
        searchOpen: false,
        
        init() {
            // Handle responsive sidebar
            this.$watch('sidebarOpen', (value) => {
                if (value) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Close sidebar on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.sidebarOpen = false;
                    this.searchOpen = false;
                }
            });
        },
        
        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen;
        },
        
        toggleSearch() {
            this.searchOpen = !this.searchOpen;
            if (this.searchOpen) {
                this.$nextTick(() => {
                    this.$refs.searchInput?.focus();
                });
            }
        },
        
        closeSidebar() {
            this.sidebarOpen = false;
        }
    }));
});

/**
 * Utility Functions
 */

/**
 * Initialize helpdesk theme functionality
 */
function initHelpdeskTheme() {
    // Initialize tooltips
    initTooltips();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize keyboard shortcuts
    initKeyboardShortcuts();
    
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Initialize accessibility features
    initAccessibility();
}

/**
 * Initialize tooltips for helpdesk elements
 */
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    });
}

function showTooltip(event) {
    const element = event.target;
    const tooltipText = element.dataset.tooltip;
    
    if (!tooltipText) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'waboot-helpdesk__tooltip';
    tooltip.textContent = tooltipText;
    tooltip.setAttribute('role', 'tooltip');
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    element.tooltip = tooltip;
}

function hideTooltip(event) {
    const element = event.target;
    if (element.tooltip) {
        element.tooltip.remove();
        element.tooltip = null;
    }
}

/**
 * Initialize form validation for helpdesk forms
 */
function initFormValidation() {
    const forms = document.querySelectorAll('.waboot-helpdesk__form');
    
    forms.forEach(form => {
        form.addEventListener('submit', validateForm);
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    });
}

function validateForm(event) {
    const form = event.target;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField({ target: input })) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        event.preventDefault();
        showNotification('Please fix the errors in the form', 'error');
    }
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    clearFieldError(event);
    
    if (isRequired && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // URL validation
    if (field.type === 'url' && value) {
        try {
            new URL(value);
        } catch {
            showFieldError(field, 'Please enter a valid URL');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'waboot-helpdesk__field-error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    
    field.classList.add('waboot-helpdesk__field--error');
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('waboot-helpdesk__field--error');
    
    const errorDiv = field.parentNode.querySelector('.waboot-helpdesk__field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * Initialize keyboard shortcuts
 */
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Ctrl/Cmd + K: Open search
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            const searchButton = document.querySelector('[data-action="toggle-search"]');
            if (searchButton) {
                searchButton.click();
            }
        }
        
        // Ctrl/Cmd + N: New ticket
        if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
            event.preventDefault();
            const newTicketButton = document.querySelector('a[href*="/helpdesk/new/"]');
            if (newTicketButton) {
                newTicketButton.click();
            }
        }
        
        // Escape: Close modals/sidebars
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.waboot-helpdesk__modal--open');
            modals.forEach(modal => {
                modal.classList.remove('waboot-helpdesk__modal--open');
            });
        }
    });
}

/**
 * Initialize performance monitoring
 */
function initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vitals' in window) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
        });
    }
    
    // Monitor helpdesk-specific metrics
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            if (entry.entryType === 'measure') {
                console.log(`${entry.name}: ${entry.duration}ms`);
            }
        });
    });
    
    observer.observe({ entryTypes: ['measure'] });
    
    // Measure page load time
    window.addEventListener('load', () => {
        performance.mark('helpdesk-page-loaded');
        performance.measure('helpdesk-page-load', 'navigationStart', 'helpdesk-page-loaded');
    });
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'waboot-helpdesk__skip-link';
    skipLink.setAttribute('tabindex', '0');
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for modals
    const modals = document.querySelectorAll('.waboot-helpdesk__modal');
    modals.forEach(modal => {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Trap focus within modal
        modal.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                if (event.shiftKey) {
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    });
    
    // Announce dynamic content changes
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'waboot-helpdesk__sr-only';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = (message) => {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}

/**
 * Notification system
 */
function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `waboot-helpdesk__notification waboot-helpdesk__notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const icon = document.createElement('span');
    icon.className = 'waboot-helpdesk__notification__icon';
    
    switch (type) {
        case 'success':
            icon.textContent = '✓';
            break;
        case 'error':
            icon.textContent = '✗';
            break;
        case 'warning':
            icon.textContent = '⚠';
            break;
        default:
            icon.textContent = 'ℹ';
    }
    
    const text = document.createElement('span');
    text.className = 'waboot-helpdesk__notification__text';
    text.textContent = message;
    
    const closeButton = document.createElement('button');
    closeButton.className = 'waboot-helpdesk__notification__close';
    closeButton.innerHTML = '&times;';
    closeButton.setAttribute('aria-label', 'Close notification');
    closeButton.onclick = () => removeNotification(notification);
    
    notification.appendChild(icon);
    notification.appendChild(text);
    notification.appendChild(closeButton);
    
    document.body.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    // Announce to screen reader
    if (window.announceToScreenReader) {
        window.announceToScreenReader(message);
    }
}

function removeNotification(notification) {
    notification.classList.add('waboot-helpdesk__notification--removing');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Initialize theme when DOM is ready
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHelpdeskTheme);
} else {
    initHelpdeskTheme();
}

// Export for use in other modules
window.WabootHelpdesk = {
    showNotification,
    initHelpdeskTheme,
    initFormValidation,
    initKeyboardShortcuts
}; 