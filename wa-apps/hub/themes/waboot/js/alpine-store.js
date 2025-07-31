/**
 * Alpine.js Store for Hub Theme
 * Global state management for hub community functionality
 */

document.addEventListener('alpine:init', () => {
    
    // Main Hub Store
    Alpine.store('hub', {
        // State
        topics: [],
        categories: [],
        tags: [],
        users: [],
        user: null,
        ui: {
            mobileMenuOpen: false,
            searchOpen: false,
            sidebarOpen: false,
            theme: 'light' // light, dark
        },
        stats: {
            members: 0,
            topics: 0,
            comments: 0,
            views: 0
        },
        notifications: [],
        
        // Initialize store
        init() {
            this.loadUser();
            this.loadTheme();
            this.loadStats();
            this.setupEventListeners();
        },
        
        // User management
        async loadUser() {
            try {
                const response = await fetch('/hub/user');
                const data = await response.json();
                this.user = data.user;
            } catch (error) {
                console.error('Load user error:', error);
            }
        },
        
        // Theme management
        loadTheme() {
            const savedTheme = localStorage.getItem('hub-theme');
            if (savedTheme) {
                this.ui.theme = savedTheme;
                this.applyTheme(savedTheme);
            }
        },
        
        toggleTheme() {
            this.ui.theme = this.ui.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('hub-theme', this.ui.theme);
            this.applyTheme(this.ui.theme);
        },
        
        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            document.body.classList.toggle('dark-mode', theme === 'dark');
        },
        
        // UI management
        toggleMobileMenu() {
            this.ui.mobileMenuOpen = !this.ui.mobileMenuOpen;
        },
        
        toggleSearch() {
            this.ui.searchOpen = !this.ui.searchOpen;
        },
        
        toggleSidebar() {
            this.ui.sidebarOpen = !this.ui.sidebarOpen;
        },
        
        // Stats management
        async loadStats() {
            try {
                const response = await fetch('/hub/stats');
                const data = await response.json();
                this.stats = data.stats || this.stats;
            } catch (error) {
                console.error('Load stats error:', error);
            }
        },
        
        // Topics management
        async loadTopics(params = {}) {
            try {
                const queryString = new URLSearchParams(params).toString();
                const response = await fetch(`/hub/topics?${queryString}`);
                const data = await response.json();
                this.topics = data.topics || [];
                return data;
            } catch (error) {
                console.error('Load topics error:', error);
                return { topics: [] };
            }
        },
        
        async loadTopic(topicId) {
            try {
                const response = await fetch(`/hub/topic/${topicId}`);
                const data = await response.json();
                return data.topic;
            } catch (error) {
                console.error('Load topic error:', error);
                return null;
            }
        },
        
        // Categories management
        async loadCategories() {
            try {
                const response = await fetch('/hub/categories');
                const data = await response.json();
                this.categories = data.categories || [];
                return this.categories;
            } catch (error) {
                console.error('Load categories error:', error);
                return [];
            }
        },
        
        // Tags management
        async loadTags() {
            try {
                const response = await fetch('/hub/tags');
                const data = await response.json();
                this.tags = data.tags || [];
                return this.tags;
            } catch (error) {
                console.error('Load tags error:', error);
                return [];
            }
        },
        
        // Users management
        async loadUsers(params = {}) {
            try {
                const queryString = new URLSearchParams(params).toString();
                const response = await fetch(`/hub/users?${queryString}`);
                const data = await response.json();
                this.users = data.users || [];
                return this.users;
            } catch (error) {
                console.error('Load users error:', error);
                return [];
            }
        },
        
        // Search functionality
        async search(query) {
            if (!query || query.length < 2) {
                return [];
            }
            
            try {
                const response = await fetch(`/hub/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                return data.results || [];
            } catch (error) {
                console.error('Search error:', error);
                return [];
            }
        },
        
        // Comments management
        async loadComments(topicId) {
            try {
                const response = await fetch(`/hub/topic/${topicId}/comments`);
                const data = await response.json();
                return data.comments || [];
            } catch (error) {
                console.error('Load comments error:', error);
                return [];
            }
        },
        
        async submitComment(topicId, comment) {
            try {
                const response = await fetch(`/hub/topic/${topicId}/comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(comment)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.showNotification('Комментарий добавлен', 'success');
                    return data.comment;
                } else {
                    this.showNotification(data.message || 'Ошибка добавления комментария', 'error');
                    return null;
                }
            } catch (error) {
                console.error('Submit comment error:', error);
                this.showNotification('Ошибка подключения', 'error');
                return null;
            }
        },
        
        // Newsletter subscription
        async subscribeNewsletter(email) {
            try {
                const response = await fetch('/hub/newsletter/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.showNotification('Подписка оформлена', 'success');
                    return true;
                } else {
                    this.showNotification(data.message || 'Ошибка подписки', 'error');
                    return false;
                }
            } catch (error) {
                console.error('Newsletter subscription error:', error);
                this.showNotification('Ошибка подключения', 'error');
                return false;
            }
        },
        
        // Topic interactions
        async likeTopic(topicId) {
            try {
                const response = await fetch(`/hub/topic/${topicId}/like`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Like topic error:', error);
                return { success: false };
            }
        },
        
        async bookmarkTopic(topicId) {
            try {
                const response = await fetch(`/hub/topic/${topicId}/bookmark`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Bookmark topic error:', error);
                return { success: false };
            }
        },
        
        // User interactions
        async followUser(userId) {
            try {
                const response = await fetch(`/hub/user/${userId}/follow`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Follow user error:', error);
                return { success: false };
            }
        },
        
        // Notifications
        showNotification(message, type = 'info', duration = 5000) {
            const notification = {
                id: Date.now(),
                message,
                type,
                timestamp: new Date()
            };
            
            this.notifications.push(notification);
            
            setTimeout(() => {
                this.hideNotification(notification.id);
            }, duration);
        },
        
        hideNotification(id) {
            this.notifications = this.notifications.filter(n => n.id !== id);
        },
        
        // Utility methods
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },
        
        formatDateTime(dateString) {
            return new Date(dateString).toLocaleString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        truncateText(text, maxLength = 150) {
            if (text.length <= maxLength) return text;
            return text.substring(0, maxLength) + '...';
        },
        
        // Event listeners
        setupEventListeners() {
            // Close mobile menu on escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.ui.mobileMenuOpen = false;
                    this.ui.searchOpen = false;
                }
            });
            
            // Close mobile menu on outside click
            document.addEventListener('click', (e) => {
                const mobileMenu = document.querySelector('.navbar-collapse');
                const searchForm = document.querySelector('.search-form');
                
                if (mobileMenu && !mobileMenu.contains(e.target) && !e.target.closest('.navbar-toggler')) {
                    this.ui.mobileMenuOpen = false;
                }
                
                if (searchForm && !searchForm.contains(e.target)) {
                    this.ui.searchOpen = false;
                }
            });
        }
    });
    
    // Extend parent site store if it exists
    if (Alpine.store('site')) {
        Alpine.store('site', {
            ...Alpine.store('site'),
            ...Alpine.store('hub')
        });
    }
}); 