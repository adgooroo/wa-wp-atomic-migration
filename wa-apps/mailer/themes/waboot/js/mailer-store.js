/**
 * Mailer Theme Alpine.js Store
 * Extends parent site store with mailer-specific functionality
 */

document.addEventListener('alpine:init', () => {
    // Extend parent site store with mailer-specific functionality
    Alpine.store('mailer', {
        // Inherit from parent store
        ...Alpine.store('site'),
        
        // Mailer-specific state
        campaigns: {
            list: [],
            loading: false,
            filters: {
                status: 'all',
                dateRange: 'all',
                search: ''
            },
            pagination: {
                page: 1,
                perPage: 10,
                total: 0
            }
        },
        
        subscribers: {
            list: [],
            loading: false,
            filters: {
                status: 'all',
                source: 'all',
                search: ''
            },
            pagination: {
                page: 1,
                perPage: 50,
                total: 0
            }
        },
        
        templates: {
            list: [],
            loading: false,
            categories: [],
            selectedCategory: 'all'
        },
        
        statistics: {
            overview: {
                totalSubscribers: 0,
                activeSubscribers: 0,
                totalCampaigns: 0,
                sentEmails: 0,
                openRate: 0,
                clickRate: 0,
                bounceRate: 0
            },
            recent: {
                campaigns: [],
                activities: []
            },
            loading: false
        },
        
        // Mailer-specific methods
        async loadCampaigns() {
            this.campaigns.loading = true;
            
            try {
                const response = await fetch('/mailer/campaigns/', {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.campaigns.list = result.data.campaigns;
                    this.campaigns.pagination = result.data.pagination;
                }
            } catch (error) {
                console.error('Failed to load campaigns:', error);
                this.showNotification('Failed to load campaigns', 'error');
            } finally {
                this.campaigns.loading = false;
            }
        },
        
        async loadSubscribers() {
            this.subscribers.loading = true;
            
            try {
                const response = await fetch('/mailer/subscribers/', {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.subscribers.list = result.data.subscribers;
                    this.subscribers.pagination = result.data.pagination;
                }
            } catch (error) {
                console.error('Failed to load subscribers:', error);
                this.showNotification('Failed to load subscribers', 'error');
            } finally {
                this.subscribers.loading = false;
            }
        },
        
        async loadTemplates() {
            this.templates.loading = true;
            
            try {
                const response = await fetch('/mailer/templates/', {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.templates.list = result.data.templates;
                    this.templates.categories = result.data.categories;
                }
            } catch (error) {
                console.error('Failed to load templates:', error);
                this.showNotification('Failed to load templates', 'error');
            } finally {
                this.templates.loading = false;
            }
        },
        
        async loadStatistics() {
            this.statistics.loading = true;
            
            try {
                const response = await fetch('/mailer/statistics/', {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.statistics.overview = result.data.overview;
                    this.statistics.recent = result.data.recent;
                }
            } catch (error) {
                console.error('Failed to load statistics:', error);
                this.showNotification('Failed to load statistics', 'error');
            } finally {
                this.statistics.loading = false;
            }
        },
        
        async createCampaign(campaignData) {
            try {
                const response = await fetch('/mailer/campaigns/create/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': this.getCsrfToken()
                    },
                    body: JSON.stringify(campaignData)
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.showNotification('Campaign created successfully', 'success');
                    await this.loadCampaigns();
                    return result.data.campaign;
                } else {
                    throw new Error(result.errors || 'Failed to create campaign');
                }
            } catch (error) {
                console.error('Failed to create campaign:', error);
                this.showNotification('Failed to create campaign', 'error');
                throw error;
            }
        },
        
        async updateCampaign(campaignId, campaignData) {
            try {
                const response = await fetch(`/mailer/campaigns/${campaignId}/update/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': this.getCsrfToken()
                    },
                    body: JSON.stringify(campaignData)
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.showNotification('Campaign updated successfully', 'success');
                    await this.loadCampaigns();
                    return result.data.campaign;
                } else {
                    throw new Error(result.errors || 'Failed to update campaign');
                }
            } catch (error) {
                console.error('Failed to update campaign:', error);
                this.showNotification('Failed to update campaign', 'error');
                throw error;
            }
        },
        
        async deleteCampaign(campaignId) {
            if (!confirm('Are you sure you want to delete this campaign?')) {
                return;
            }
            
            try {
                const response = await fetch(`/mailer/campaigns/${campaignId}/delete/`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': this.getCsrfToken()
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.showNotification('Campaign deleted successfully', 'success');
                    await this.loadCampaigns();
                } else {
                    throw new Error(result.errors || 'Failed to delete campaign');
                }
            } catch (error) {
                console.error('Failed to delete campaign:', error);
                this.showNotification('Failed to delete campaign', 'error');
            }
        },
        
        async sendCampaign(campaignId) {
            try {
                const response = await fetch(`/mailer/campaigns/${campaignId}/send/`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': this.getCsrfToken()
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.showNotification('Campaign sent successfully', 'success');
                    await this.loadCampaigns();
                } else {
                    throw new Error(result.errors || 'Failed to send campaign');
                }
            } catch (error) {
                console.error('Failed to send campaign:', error);
                this.showNotification('Failed to send campaign', 'error');
            }
        },
        
        async addSubscriber(subscriberData) {
            try {
                const response = await fetch('/mailer/subscribers/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': this.getCsrfToken()
                    },
                    body: JSON.stringify(subscriberData)
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.showNotification('Subscriber added successfully', 'success');
                    await this.loadSubscribers();
                    return result.data.subscriber;
                } else {
                    throw new Error(result.errors || 'Failed to add subscriber');
                }
            } catch (error) {
                console.error('Failed to add subscriber:', error);
                this.showNotification('Failed to add subscriber', 'error');
                throw error;
            }
        },
        
        async removeSubscriber(subscriberId) {
            if (!confirm('Are you sure you want to remove this subscriber?')) {
                return;
            }
            
            try {
                const response = await fetch(`/mailer/subscribers/${subscriberId}/remove/`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-Token': this.getCsrfToken()
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.showNotification('Subscriber removed successfully', 'success');
                    await this.loadSubscribers();
                } else {
                    throw new Error(result.errors || 'Failed to remove subscriber');
                }
            } catch (error) {
                console.error('Failed to remove subscriber:', error);
                this.showNotification('Failed to remove subscriber', 'error');
            }
        },
        
        async importSubscribers(file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('csrf_token', this.getCsrfToken());
            
            try {
                const response = await fetch('/mailer/subscribers/import/', {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.showNotification(`Imported ${result.data.imported} subscribers successfully`, 'success');
                    await this.loadSubscribers();
                } else {
                    throw new Error(result.errors || 'Failed to import subscribers');
                }
            } catch (error) {
                console.error('Failed to import subscribers:', error);
                this.showNotification('Failed to import subscribers', 'error');
            }
        },
        
        async exportSubscribers(format = 'csv') {
            try {
                const response = await fetch(`/mailer/subscribers/export/?format=${format}`, {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `subscribers.${format}`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    
                    this.showNotification('Subscribers exported successfully', 'success');
                } else {
                    throw new Error('Failed to export subscribers');
                }
            } catch (error) {
                console.error('Failed to export subscribers:', error);
                this.showNotification('Failed to export subscribers', 'error');
            }
        },
        
        // Utility methods
        getCsrfToken() {
            return document.querySelector('meta[name="csrf-token"]')?.content || '';
        },
        
        formatNumber(number) {
            return new Intl.NumberFormat().format(number);
        },
        
        formatPercentage(value, total) {
            if (total === 0) return '0%';
            return `${((value / total) * 100).toFixed(1)}%`;
        },
        
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString();
        },
        
        formatDateTime(dateString) {
            return new Date(dateString).toLocaleString();
        },
        
        // Filter methods
        filterCampaigns() {
            // Implementation for filtering campaigns based on current filters
            return this.campaigns.list.filter(campaign => {
                if (this.campaigns.filters.status !== 'all' && campaign.status !== this.campaigns.filters.status) {
                    return false;
                }
                
                if (this.campaigns.filters.search && !campaign.name.toLowerCase().includes(this.campaigns.filters.search.toLowerCase())) {
                    return false;
                }
                
                return true;
            });
        },
        
        filterSubscribers() {
            // Implementation for filtering subscribers based on current filters
            return this.subscribers.list.filter(subscriber => {
                if (this.subscribers.filters.status !== 'all' && subscriber.status !== this.subscribers.filters.status) {
                    return false;
                }
                
                if (this.subscribers.filters.search && !subscriber.email.toLowerCase().includes(this.subscribers.filters.search.toLowerCase())) {
                    return false;
                }
                
                return true;
            });
        },
        
        // Initialize store
        init() {
            // Load initial data
            this.loadCampaigns();
            this.loadSubscribers();
            this.loadTemplates();
            this.loadStatistics();
        }
    });
    
    // Initialize mailer store
    Alpine.store('mailer').init();
}); 