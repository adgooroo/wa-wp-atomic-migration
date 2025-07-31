/**
 * Alpine.js Store for Blog Theme
 * Global state management for blog functionality
 */

document.addEventListener('alpine:init', () => {
    
    // Main Blog Store
    Alpine.store('blog', {
        // State
        posts: [],
        categories: [],
        tags: [],
        user: null,
        ui: {
            mobileMenuOpen: false,
            searchOpen: false,
            sidebarOpen: false,
            theme: 'light' // light, dark
        },
        notifications: [],
        
        // Initialize store
        init() {
            this.loadUser();
            this.loadTheme();
            this.setupEventListeners();
        },
        
        // User management
        async loadUser() {
            try {
                const response = await fetch('/blog/user');
                const data = await response.json();
                this.user = data.user;
            } catch (error) {
                console.error('Load user error:', error);
            }
        },
        
        // Theme management
        loadTheme() {
            const savedTheme = localStorage.getItem('blog-theme');
            if (savedTheme) {
                this.ui.theme = savedTheme;
                this.applyTheme(savedTheme);
            }
        },
        
        toggleTheme() {
            this.ui.theme = this.ui.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('blog-theme', this.ui.theme);
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
        
        // Posts management
        async loadPosts(params = {}) {
            try {
                const queryString = new URLSearchParams(params).toString();
                const response = await fetch(`/blog/posts?${queryString}`);
                const data = await response.json();
                this.posts = data.posts || [];
                return data;
            } catch (error) {
                console.error('Load posts error:', error);
                return { posts: [] };
            }
        },
        
        async loadPost(postId) {
            try {
                const response = await fetch(`/blog/post/${postId}`);
                const data = await response.json();
                return data.post;
            } catch (error) {
                console.error('Load post error:', error);
                return null;
            }
        },
        
        // Categories management
        async loadCategories() {
            try {
                const response = await fetch('/blog/categories');
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
                const response = await fetch('/blog/tags');
                const data = await response.json();
                this.tags = data.tags || [];
                return this.tags;
            } catch (error) {
                console.error('Load tags error:', error);
                return [];
            }
        },
        
        // Search functionality
        async search(query) {
            if (!query || query.length < 2) {
                return [];
            }
            
            try {
                const response = await fetch(`/blog/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                return data.results || [];
            } catch (error) {
                console.error('Search error:', error);
                return [];
            }
        },
        
        // Comments management
        async loadComments(postId) {
            try {
                const response = await fetch(`/blog/post/${postId}/comments`);
                const data = await response.json();
                return data.comments || [];
            } catch (error) {
                console.error('Load comments error:', error);
                return [];
            }
        },
        
        async submitComment(postId, comment) {
            try {
                const response = await fetch(`/blog/post/${postId}/comment`, {
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
                const response = await fetch('/blog/newsletter/subscribe', {
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
        
        // Post interactions
        async likePost(postId) {
            try {
                const response = await fetch(`/blog/post/${postId}/like`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Like post error:', error);
                return { success: false };
            }
        },
        
        async bookmarkPost(postId) {
            try {
                const response = await fetch(`/blog/post/${postId}/bookmark`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const data = await response.json();
                return data;
            } catch (error) {
                console.error('Bookmark post error:', error);
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
            ...Alpine.store('blog')
        });
    }
}); 