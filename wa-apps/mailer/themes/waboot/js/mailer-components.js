/**
 * Mailer Theme Alpine.js Components
 * Provides reactive functionality for Mailer app components
 */

document.addEventListener('alpine:init', () => {
    
    // Subscribe Button Component
    Alpine.data('subscribeButton', () => ({
        loading: false,
        buttonText: '{_w("Subscribe")}',
        
        async subscribe() {
            if (this.loading) return;
            
            this.loading = true;
            this.buttonText = '{_w("Subscribing...")}';
            
            try {
                const form = this.$el.closest('form');
                const emailInput = form.querySelector('input[type="email"]');
                const email = emailInput.value;
                
                if (!email || !this.isValidEmail(email)) {
                    throw new Error('{_w("Please enter a valid email address")}');
                }
                
                // Get CSRF token from form or meta tag
                const csrfToken = form.querySelector('input[name="csrf_token"]')?.value || 
                                 document.querySelector('meta[name="csrf-token"]')?.content || '';
                
                const response = await fetch('/mailer/subscribe/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': csrfToken
                    },
                    body: JSON.stringify({ 
                        email: email,
                        csrf_token: csrfToken
                    })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.buttonText = '{_w("Subscribed!")}';
                    emailInput.value = '';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        this.buttonText = '{_w("Subscribe")}';
                        this.loading = false;
                    }, 2000);
                } else {
                    throw new Error(result.errors || '{_w("Subscription failed")}');
                }
            } catch (error) {
                this.buttonText = '{_w("Error")}';
                console.error('Subscribe error:', error);
                
                // Reset after 3 seconds
                setTimeout(() => {
                    this.buttonText = '{_w("Subscribe")}';
                    this.loading = false;
                }, 3000);
            }
        },
        
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }));
    
    // Subscribe Form Component
    Alpine.data('subscribeForm', () => ({
        email: '',
        loading: false,
        message: '',
        messageType: 'info',
        
        async subscribe() {
            if (this.loading) return;
            
            this.loading = true;
            this.message = '';
            
            try {
                if (!this.email || !this.isValidEmail(this.email)) {
                    throw new Error('{_w("Please enter a valid email address")}');
                }
                
                // Get CSRF token
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';
                
                const response = await fetch('/mailer/subscribe/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': csrfToken
                    },
                    body: JSON.stringify({ 
                        email: this.email,
                        csrf_token: csrfToken
                    })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.message = '{_w("Successfully subscribed!")}';
                    this.messageType = 'success';
                    this.email = '';
                } else {
                    this.message = result.errors || '{_w("Subscription failed")}';
                    this.messageType = 'error';
                }
            } catch (error) {
                this.message = error.message || '{_w("Network error occurred")}';
                this.messageType = 'error';
            } finally {
                this.loading = false;
            }
        },
        
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }));
    
    // Campaign Dashboard Component
    Alpine.data('campaignDashboard', () => ({
        campaigns: [],
        stats: {},
        loading: false,
        
        async init() {
            await this.loadDashboard();
        },
        
        async loadDashboard() {
            this.loading = true;
            
            try {
                const response = await fetch('/mailer/dashboard/');
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.campaigns = result.data.campaigns || [];
                    this.stats = result.data.stats || {};
                }
            } catch (error) {
                console.error('Failed to load dashboard:', error);
            } finally {
                this.loading = false;
            }
        },
        
        createCampaign() {
            window.location.href = '/mailer/campaigns/new/';
        },
        
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        }
    }));
    
    // Subscriber List Component
    Alpine.data('subscriberList', () => ({
        subscribers: [],
        loading: false,
        
        async init() {
            await this.loadSubscribers();
        },
        
        async loadSubscribers() {
            this.loading = true;
            
            try {
                const response = await fetch('/mailer/subscribers/');
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.subscribers = result.data.subscribers || [];
                }
            } catch (error) {
                console.error('Failed to load subscribers:', error);
            } finally {
                this.loading = false;
            }
        },
        
        async importSubscribers() {
            // Implementation for import functionality
            console.log('Import subscribers');
        },
        
        async exportSubscribers() {
            // Implementation for export functionality
            console.log('Export subscribers');
        },
        
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        }
    }));
    
    // Email Editor Component
    Alpine.data('emailEditor', () => ({
        email: {
            subject: '',
            from_name: '',
            blocks: []
        },
        selectedBlock: null,
        
        addBlock(type) {
            const block = {
                id: Date.now(),
                type: type,
                content: '',
                src: '',
                alt: '',
                text: ''
            };
            
            this.email.blocks.push(block);
            this.selectBlock(this.email.blocks.length - 1);
        },
        
        selectBlock(index) {
            this.selectedBlock = index;
        },
        
        getSelectedBlock() {
            return this.selectedBlock !== null ? this.email.blocks[this.selectedBlock] : null;
        },
        
        editBlock(index) {
            this.selectBlock(index);
            // Implementation for editing block
        },
        
        deleteBlock(index) {
            this.email.blocks.splice(index, 1);
            if (this.selectedBlock === index) {
                this.selectedBlock = null;
            } else if (this.selectedBlock > index) {
                this.selectedBlock--;
            }
        }
    }));
    
    // Statistics Component
    Alpine.data('statistics', () => ({
        stats: {},
        loading: false,
        
        async init() {
            await this.loadStatistics();
        },
        
        async loadStatistics() {
            this.loading = true;
            
            try {
                const response = await fetch('/mailer/statistics/');
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.stats = result.data || {};
                }
            } catch (error) {
                console.error('Failed to load statistics:', error);
            } finally {
                this.loading = false;
            }
        },
        
        formatNumber(number) {
            return new Intl.NumberFormat().format(number);
        },
        
        formatPercentage(value, total) {
            if (total === 0) return '0%';
            return ((value / total) * 100).toFixed(1) + '%';
        }
    }));
});

// Utility functions
window.MailerUtils = {
    showNotification(message, type = 'info') {
        // Implementation for showing notifications
        console.log(`${type}: ${message}`);
    },
    
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    },
    
    formatNumber(number) {
        return new Intl.NumberFormat().format(number);
    },
    
    // Security utility for sanitizing user input
    sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        return input.trim().replace(/[<>]/g, '').replace(/javascript:/gi, '');
    },
    
    // Get CSRF token safely
    getCsrfToken() {
        return document.querySelector('meta[name="csrf-token"]')?.content || 
               document.querySelector('input[name="csrf_token"]')?.value || '';
    }
}; 