/**
 * Alpine.js Components for Helpdesk Theme
 * Interactive components and functionality
 */

// Helpdesk Search Component
function helpdeskSearch() {
    return {
        query: '',
        filters: {
            category: '',
            type: '',
            sort: 'relevance'
        },
        loading: false,
        
        search() {
            if (!this.query.trim()) return;
            
            this.loading = true;
            
            // Build search URL with filters
            const params = new URLSearchParams();
            params.append('q', this.query.trim());
            
            if (this.filters.category) {
                params.append('category', this.filters.category);
            }
            
            if (this.filters.type) {
                params.append('type', this.filters.type);
            }
            
            if (this.filters.sort) {
                params.append('sort', this.filters.sort);
            }
            
            // Navigate to search results
            window.location.href = `/helpdesk/search/?${params.toString()}`;
        },
        
        // Auto-search on filter change
        handleFilterChange() {
            if (this.query.trim()) {
                this.search();
            }
        }
    };
}

// FAQ Search Component
function faqSearch() {
    return {
        query: '',
        results: [],
        loading: false,
        
        search() {
            if (!this.query.trim()) {
                this.results = [];
                return;
            }
            
            this.loading = true;
            
            // Simulate API call
            fetch(`/helpdesk/api/faq/search?q=${encodeURIComponent(this.query)}`)
                .then(response => response.json())
                .then(data => {
                    this.results = data.results || [];
                })
                .catch(error => {
                    console.error('FAQ search error:', error);
                    this.results = [];
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    };
}

// FAQ Accordion Component
function faqAccordion() {
    return {
        openItems: new Set(),
        
        isOpen(itemId) {
            return this.openItems.has(itemId);
        },
        
        toggleItem(itemId) {
            if (this.isOpen(itemId)) {
                this.openItems.delete(itemId);
            } else {
                this.openItems.add(itemId);
            }
        },
        
        openItem(itemId) {
            this.openItems.add(itemId);
        },
        
        closeItem(itemId) {
            this.openItems.delete(itemId);
        },
        
        closeAll() {
            this.openItems.clear();
        },
        
        openAll() {
            // Get all FAQ items and open them
            const items = document.querySelectorAll('[data-faq-id]');
            items.forEach(item => {
                this.openItems.add(item.dataset.faqId);
            });
        }
    };
}

// FAQ Feedback Component
function faqFeedback() {
    return {
        helpfulCount: 0,
        notHelpfulCount: 0,
        userVote: null,
        
        rateFAQ(faqId, vote) {
            if (this.userVote === vote) return; // Prevent double voting
            
            this.userVote = vote;
            
            if (vote === 'helpful') {
                this.helpfulCount++;
                if (this.userVote === 'not-helpful') {
                    this.notHelpfulCount--;
                }
            } else {
                this.notHelpfulCount++;
                if (this.userVote === 'helpful') {
                    this.helpfulCount--;
                }
            }
            
            // Send feedback to server
            fetch('/helpdesk/api/faq/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.content
                },
                body: JSON.stringify({
                    faq_id: faqId,
                    vote: vote
                })
            }).catch(error => {
                console.error('FAQ feedback error:', error);
            });
        }
    };
}

// Share FAQ Component
function shareFAQ() {
    return {
        share(faqId) {
            const url = `${window.location.origin}/helpdesk/faq/${faqId}`;
            const title = document.title;
            
            if (navigator.share) {
                navigator.share({
                    title: title,
                    url: url
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(url).then(() => {
                    this.showToast('Link copied to clipboard!');
                }).catch(() => {
                    // Fallback: show URL in alert
                    alert(`Share this link: ${url}`);
                });
            }
        },
        
        showToast(message) {
            // Create toast notification
            const toast = document.createElement('div');
            toast.className = 'helpdesk-toast';
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    };
}

// Load More FAQ Component
function loadMoreFAQ() {
    return {
        loading: false,
        page: 1,
        hasMore: true,
        
        loadMore() {
            if (this.loading || !this.hasMore) return;
            
            this.loading = true;
            this.page++;
            
            fetch(`/helpdesk/api/faq?page=${this.page}`)
                .then(response => response.json())
                .then(data => {
                    // Append new FAQ items to the list
                    const faqList = document.querySelector('.waboot-helpdesk__faq-list');
                    if (faqList && data.items) {
                        data.items.forEach(item => {
                            const faqItem = this.createFAQItem(item);
                            faqList.appendChild(faqItem);
                        });
                    }
                    
                    this.hasMore = data.has_more || false;
                })
                .catch(error => {
                    console.error('Load more FAQ error:', error);
                    this.page--; // Revert page number on error
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        
        createFAQItem(item) {
            const div = document.createElement('div');
            div.className = 'waboot-helpdesk__faq-item';
            div.innerHTML = `
                <button class="waboot-helpdesk__faq-item__question">
                    <span class="waboot-helpdesk__faq-item__question__text">${item.question}</span>
                    <span class="waboot-helpdesk__faq-item__question__icon">
                        <i class="fas fa-chevron-down"></i>
                    </span>
                </button>
                <div class="waboot-helpdesk__faq-item__answer">
                    <div class="waboot-helpdesk__faq-item__answer__content">${item.answer}</div>
                </div>
            `;
            return div;
        }
    };
}

// Contact Form Component
function contactForm() {
    return {
        form: {
            name: '',
            email: '',
            subject: '',
            category: '',
            priority: 'medium',
            message: ''
        },
        errors: {},
        loading: false,
        success: false,
        
        validate() {
            this.errors = {};
            
            if (!this.form.name.trim()) {
                this.errors.name = 'Name is required';
            }
            
            if (!this.form.email.trim()) {
                this.errors.email = 'Email is required';
            } else if (!this.isValidEmail(this.form.email)) {
                this.errors.email = 'Please enter a valid email address';
            }
            
            if (!this.form.subject.trim()) {
                this.errors.subject = 'Subject is required';
            }
            
            if (!this.form.category) {
                this.errors.category = 'Please select a category';
            }
            
            if (!this.form.message.trim()) {
                this.errors.message = 'Message is required';
            } else if (this.form.message.trim().length < 10) {
                this.errors.message = 'Message must be at least 10 characters long';
            }
            
            return Object.keys(this.errors).length === 0;
        },
        
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        async submit() {
            if (!this.validate()) return;
            
            this.loading = true;
            
            try {
                const formData = new FormData();
                Object.keys(this.form).forEach(key => {
                    formData.append(key, this.form[key]);
                });
                
                const response = await fetch('/helpdesk/contact', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    this.success = true;
                    this.resetForm();
                } else {
                    const data = await response.json();
                    this.errors = data.errors || { general: 'An error occurred. Please try again.' };
                }
            } catch (error) {
                console.error('Contact form error:', error);
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
                category: '',
                priority: 'medium',
                message: ''
            };
            this.errors = {};
        }
    };
}

// Ticket Status Component
function ticketStatus() {
    return {
        status: '',
        priority: '',
        
        getStatusClass() {
            const statusClasses = {
                'open': 'helpdesk-status--open',
                'in-progress': 'helpdesk-status--in-progress',
                'resolved': 'helpdesk-status--resolved',
                'closed': 'helpdesk-status--closed'
            };
            return statusClasses[this.status] || '';
        },
        
        getPriorityClass() {
            const priorityClasses = {
                'low': 'helpdesk-priority--low',
                'medium': 'helpdesk-priority--medium',
                'high': 'helpdesk-priority--high',
                'critical': 'helpdesk-priority--critical'
            };
            return priorityClasses[this.priority] || '';
        }
    };
}

// Notification Component
function notification() {
    return {
        show: false,
        message: '',
        type: 'info', // info, success, warning, error
        duration: 5000,
        
        showNotification(message, type = 'info', duration = 5000) {
            this.message = message;
            this.type = type;
            this.duration = duration;
            this.show = true;
            
            if (duration > 0) {
                setTimeout(() => {
                    this.hide();
                }, duration);
            }
        },
        
        hide() {
            this.show = false;
        },
        
        getTypeClass() {
            const typeClasses = {
                'info': 'helpdesk-alert--info',
                'success': 'helpdesk-alert--success',
                'warning': 'helpdesk-alert--warning',
                'error': 'helpdesk-alert--danger'
            };
            return typeClasses[this.type] || '';
        }
    };
}

// Dark Mode Toggle Component
function darkModeToggle() {
    return {
        isDark: false,
        
        init() {
            // Check for saved theme preference or default to light mode
            this.isDark = localStorage.getItem('helpdesk-theme') === 'dark' || 
                         (localStorage.getItem('helpdesk-theme') === null && 
                          window.matchMedia('(prefers-color-scheme: dark)').matches);
            
            this.applyTheme();
        },
        
        toggle() {
            this.isDark = !this.isDark;
            this.applyTheme();
            localStorage.setItem('helpdesk-theme', this.isDark ? 'dark' : 'light');
        },
        
        applyTheme() {
            if (this.isDark) {
                document.documentElement.classList.add('theme-dark');
                document.documentElement.classList.remove('theme-light');
            } else {
                document.documentElement.classList.add('theme-light');
                document.documentElement.classList.remove('theme-dark');
            }
        }
    };
}

// Search Suggestions Component
function searchSuggestions() {
    return {
        query: '',
        suggestions: [],
        showSuggestions: false,
        selectedIndex: -1,
        
        async getSuggestions() {
            if (this.query.length < 2) {
                this.suggestions = [];
                this.showSuggestions = false;
                return;
            }
            
            try {
                const response = await fetch(`/helpdesk/api/search/suggestions?q=${encodeURIComponent(this.query)}`);
                const data = await response.json();
                this.suggestions = data.suggestions || [];
                this.showSuggestions = this.suggestions.length > 0;
                this.selectedIndex = -1;
            } catch (error) {
                console.error('Search suggestions error:', error);
                this.suggestions = [];
                this.showSuggestions = false;
            }
        },
        
        selectSuggestion(index) {
            if (index >= 0 && index < this.suggestions.length) {
                this.query = this.suggestions[index];
                this.showSuggestions = false;
                this.selectedIndex = -1;
            }
        },
        
        onKeyDown(event) {
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
                        this.selectSuggestion(this.selectedIndex);
                    }
                    break;
                case 'Escape':
                    this.showSuggestions = false;
                    this.selectedIndex = -1;
                    break;
            }
        },
        
        hideSuggestions() {
            setTimeout(() => {
                this.showSuggestions = false;
                this.selectedIndex = -1;
            }, 200);
        }
    };
}

// Export components for global use
window.helpdeskSearch = helpdeskSearch;
window.faqSearch = faqSearch;
window.faqAccordion = faqAccordion;
window.faqFeedback = faqFeedback;
window.shareFAQ = shareFAQ;
window.loadMoreFAQ = loadMoreFAQ;
window.contactForm = contactForm;
window.ticketStatus = ticketStatus;
window.notification = notification;
window.darkModeToggle = darkModeToggle;
window.searchSuggestions = searchSuggestions; 