/**
 * Waboot Hub Theme - Main JavaScript File
 * Alpine.js components and store for Hub social functionality
 * 
 * @version 1.0.0
 * @author AdGooroo
 * @license MIT
 */

(function() {
    'use strict';

    // Wait for Alpine.js to be ready
    document.addEventListener('alpine:init', () => {
        
        /**
         * Hub Store - Extends parent site store
         */
        Alpine.store('hub', {
            // Inherit from parent site store
            ...Alpine.store('site'),
            
            // Hub-specific state
            state: {
                currentUser: null,
                notifications: [],
                unreadCount: 0,
                onlineUsers: [],
                realTimeEnabled: true,
                theme: 'light' // light, dark, auto
            },
            
            // Hub-specific methods
            methods: {
                
                /**
                 * Initialize Hub functionality
                 */
                init() {
                    this.loadCurrentUser();
                    this.setupRealTimeConnection();
                    this.setupThemePreference();
                    this.setupNotifications();
                },
                
                /**
                 * Load current user data
                 */
                async loadCurrentUser() {
                    try {
                        const response = await fetch('/hub/api/user/current/', {
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-CSRF-Token': this.getCsrfToken(),
                                'Content-Type': 'application/json'
                            },
                            credentials: 'same-origin'
                        });
                        
                        if (response.ok) {
                            const userData = await response.json();
                            this.state.currentUser = userData;
                        }
                    } catch (error) {
                        console.error('Failed to load current user:', error);
                    }
                },
                
                /**
                 * Setup real-time connection
                 */
                setupRealTimeConnection() {
                    if (!this.state.realTimeEnabled) return;
                    
                    // WebSocket connection for real-time updates
                    if (typeof WebSocket !== 'undefined') {
                        this.connectWebSocket();
                    } else if (typeof EventSource !== 'undefined') {
                        this.connectEventSource();
                    }
                },
                
                /**
                 * Connect via WebSocket
                 */
                connectWebSocket() {
                    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                    const wsUrl = `${protocol}//${window.location.host}/hub/ws/`;
                    
                    try {
                        const ws = new WebSocket(wsUrl);
                        
                        ws.onopen = () => {
                            console.log('Hub WebSocket connected');
                            this.sendWebSocketMessage('auth', {
                                user_id: this.state.currentUser?.id
                            });
                        };
                        
                        ws.onmessage = (event) => {
                            const data = JSON.parse(event.data);
                            this.handleRealTimeMessage(data);
                        };
                        
                        ws.onclose = () => {
                            console.log('Hub WebSocket disconnected');
                            // Reconnect after 5 seconds
                            setTimeout(() => this.connectWebSocket(), 5000);
                        };
                        
                        ws.onerror = (error) => {
                            console.error('WebSocket error:', error);
                        };
                        
                        this.state.websocket = ws;
                    } catch (error) {
                        console.error('Failed to connect WebSocket:', error);
                    }
                },
                
                /**
                 * Connect via Server-Sent Events (fallback)
                 */
                connectEventSource() {
                    try {
                        const eventSource = new EventSource('/hub/events/');
                        
                        eventSource.onmessage = (event) => {
                            const data = JSON.parse(event.data);
                            this.handleRealTimeMessage(data);
                        };
                        
                        eventSource.onerror = (error) => {
                            console.error('EventSource error:', error);
                            eventSource.close();
                        };
                        
                        this.state.eventSource = eventSource;
                    } catch (error) {
                        console.error('Failed to connect EventSource:', error);
                    }
                },
                
                /**
                 * Handle real-time messages
                 */
                handleRealTimeMessage(data) {
                    switch (data.type) {
                        case 'notification':
                            this.addNotification(data.notification);
                            break;
                        case 'user_online':
                            this.updateOnlineUsers(data.user_id, true);
                            break;
                        case 'user_offline':
                            this.updateOnlineUsers(data.user_id, false);
                            break;
                        case 'activity_new':
                            this.handleNewActivity(data.activity);
                            break;
                        case 'message_new':
                            this.handleNewMessage(data.message);
                            break;
                    }
                },
                
                /**
                 * Send WebSocket message
                 */
                sendWebSocketMessage(type, data) {
                    if (this.state.websocket && this.state.websocket.readyState === WebSocket.OPEN) {
                        this.state.websocket.send(JSON.stringify({
                            type: type,
                            data: data
                        }));
                    }
                },
                
                /**
                 * Setup theme preference
                 */
                setupThemePreference() {
                    const savedTheme = localStorage.getItem('hub-theme') || 'auto';
                    this.state.theme = savedTheme;
                    this.applyTheme(savedTheme);
                    
                    // Listen for theme changes
                    window.addEventListener('storage', (event) => {
                        if (event.key === 'hub-theme') {
                            this.applyTheme(event.newValue);
                        }
                    });
                },
                
                /**
                 * Apply theme
                 */
                applyTheme(theme) {
                    const root = document.documentElement;
                    
                    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                        root.classList.add('hub-theme-dark');
                        root.classList.remove('hub-theme-light');
                    } else {
                        root.classList.add('hub-theme-light');
                        root.classList.remove('hub-theme-dark');
                    }
                },
                
                /**
                 * Setup notifications
                 */
                setupNotifications() {
                    // Request notification permission
                    if ('Notification' in window && Notification.permission === 'default') {
                        Notification.requestPermission();
                    }
                    
                    // Load existing notifications
                    this.loadNotifications();
                },
                
                /**
                 * Load notifications
                 */
                async loadNotifications() {
                    try {
                        const response = await fetch('/hub/api/notifications/', {
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        });
                        
                        if (response.ok) {
                            const data = await response.json();
                            this.state.notifications = data.notifications;
                            this.state.unreadCount = data.unread_count;
                        }
                    } catch (error) {
                        console.error('Failed to load notifications:', error);
                    }
                },
                
                /**
                 * Add notification
                 */
                addNotification(notification) {
                    this.state.notifications.unshift(notification);
                    
                    if (!notification.read) {
                        this.state.unreadCount++;
                    }
                    
                    // Show browser notification if permitted
                    if (Notification.permission === 'granted' && !document.hasFocus()) {
                        new Notification(notification.title, {
                            body: notification.message,
                            icon: '/themes/waboot/images/notification-icon.png'
                        });
                    }
                    
                    // Dispatch custom event
                    window.dispatchEvent(new CustomEvent('hubNotification', {
                        detail: notification
                    }));
                },
                
                /**
                 * Mark notification as read
                 */
                async markNotificationRead(notificationId) {
                    try {
                        const response = await fetch(`/hub/api/notifications/${notificationId}/read/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRF-Token': this.getCsrfToken(),
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        });
                        
                        if (response.ok) {
                            const notification = this.state.notifications.find(n => n.id === notificationId);
                            if (notification && !notification.read) {
                                notification.read = true;
                                this.state.unreadCount--;
                            }
                        }
                    } catch (error) {
                        console.error('Failed to mark notification as read:', error);
                    }
                },
                
                /**
                 * Update online users
                 */
                updateOnlineUsers(userId, isOnline) {
                    if (isOnline) {
                        if (!this.state.onlineUsers.includes(userId)) {
                            this.state.onlineUsers.push(userId);
                        }
                    } else {
                        const index = this.state.onlineUsers.indexOf(userId);
                        if (index > -1) {
                            this.state.onlineUsers.splice(index, 1);
                        }
                    }
                },
                
                /**
                 * Handle new activity
                 */
                handleNewActivity(activity) {
                    // Dispatch custom event for activity feed components
                    window.dispatchEvent(new CustomEvent('hubNewActivity', {
                        detail: activity
                    }));
                },
                
                /**
                 * Handle new message
                 */
                handleNewMessage(message) {
                    // Dispatch custom event for message components
                    window.dispatchEvent(new CustomEvent('hubNewMessage', {
                        detail: message
                    }));
                },
                
                /**
                 * Get CSRF token
                 */
                getCsrfToken() {
                    return document.querySelector('meta[name="csrf-token"]')?.content || '';
                }
            }
        });
        
        /**
         * Hub Components
         */
        
        /**
         * User Profile Component
         */
        Alpine.data('userProfile', (userId) => ({
            userId: userId,
            user: null,
            activities: [],
            followers: [],
            following: [],
            loading: false,
            
            init() {
                this.loadUserProfile();
                this.loadUserActivities();
                this.loadUserConnections();
            },
            
            async loadUserProfile() {
                this.loading = true;
                
                try {
                    const response = await fetch(`/hub/api/user/${this.userId}/`, {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    
                    if (response.ok) {
                        this.user = await response.json();
                    }
                } catch (error) {
                    console.error('Failed to load user profile:', error);
                } finally {
                    this.loading = false;
                }
            },
            
            async loadUserActivities() {
                try {
                    const response = await fetch(`/hub/api/user/${this.userId}/activities/`, {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        this.activities = data.activities;
                    }
                } catch (error) {
                    console.error('Failed to load user activities:', error);
                }
            },
            
            async loadUserConnections() {
                try {
                    const [followersResponse, followingResponse] = await Promise.all([
                        fetch(`/hub/api/user/${this.userId}/followers/`),
                        fetch(`/hub/api/user/${this.userId}/following/`)
                    ]);
                    
                    if (followersResponse.ok) {
                        const data = await followersResponse.json();
                        this.followers = data.followers;
                    }
                    
                    if (followingResponse.ok) {
                        const data = await followingResponse.json();
                        this.following = data.following;
                    }
                } catch (error) {
                    console.error('Failed to load user connections:', error);
                }
            }
        }));
        
        /**
         * Message System Component
         */
        Alpine.data('messageSystem', () => ({
            conversations: [],
            currentConversation: null,
            messages: [],
            newMessage: '',
            loading: false,
            
            init() {
                this.loadConversations();
                this.setupMessageListener();
            },
            
            async loadConversations() {
                this.loading = true;
                
                try {
                    const response = await fetch('/hub/api/messages/conversations/', {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        this.conversations = data.conversations;
                    }
                } catch (error) {
                    console.error('Failed to load conversations:', error);
                } finally {
                    this.loading = false;
                }
            },
            
            async loadMessages(conversationId) {
                this.currentConversation = conversationId;
                
                try {
                    const response = await fetch(`/hub/api/messages/conversation/${conversationId}/`, {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        this.messages = data.messages;
                        this.scrollToBottom();
                    }
                } catch (error) {
                    console.error('Failed to load messages:', error);
                }
            },
            
            async sendMessage() {
                if (!this.newMessage.trim() || !this.currentConversation) return;
                
                try {
                    const response = await fetch('/hub/api/messages/send/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': this.getCsrfToken(),
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: JSON.stringify({
                            conversation_id: this.currentConversation,
                            message: this.newMessage
                        })
                    });
                    
                    if (response.ok) {
                        const message = await response.json();
                        this.messages.push(message);
                        this.newMessage = '';
                        this.scrollToBottom();
                    }
                } catch (error) {
                    console.error('Failed to send message:', error);
                }
            },
            
            setupMessageListener() {
                window.addEventListener('hubNewMessage', (event) => {
                    const message = event.detail;
                    
                    if (message.conversation_id === this.currentConversation) {
                        this.messages.push(message);
                        this.scrollToBottom();
                    }
                    
                    // Update conversation list
                    this.updateConversationList(message);
                });
            },
            
            updateConversationList(message) {
                const conversation = this.conversations.find(c => c.id === message.conversation_id);
                if (conversation) {
                    conversation.last_message = message;
                    conversation.unread_count = (conversation.unread_count || 0) + 1;
                    
                    // Move conversation to top
                    this.conversations = this.conversations.filter(c => c.id !== message.conversation_id);
                    this.conversations.unshift(conversation);
                }
            },
            
            scrollToBottom() {
                this.$nextTick(() => {
                    const messagesContainer = this.$refs.messagesContainer;
                    if (messagesContainer) {
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                });
            },
            
            getCsrfToken() {
                return document.querySelector('meta[name="csrf-token"]')?.content || '';
            }
        }));
        
        /**
         * Search Component
         */
        Alpine.data('hubSearch', () => ({
            query: '',
            results: [],
            loading: false,
            searchType: 'all', // all, users, activities, topics
            
            async search() {
                if (!this.query.trim()) {
                    this.results = [];
                    return;
                }
                
                this.loading = true;
                
                try {
                    const response = await fetch(`/hub/api/search/?q=${encodeURIComponent(this.query)}&type=${this.searchType}`, {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        this.results = data.results;
                    }
                } catch (error) {
                    console.error('Search failed:', error);
                } finally {
                    this.loading = false;
                }
            },
            
            debounceSearch: Alpine.debounce(function() {
                this.search();
            }, 300)
        }));
        
        /**
         * Notification Component
         */
        Alpine.data('notificationPanel', () => ({
            open: false,
            notifications: [],
            unreadCount: 0,
            
            init() {
                this.loadNotifications();
                this.setupNotificationListener();
            },
            
            async loadNotifications() {
                try {
                    const response = await fetch('/hub/api/notifications/', {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        this.notifications = data.notifications;
                        this.unreadCount = data.unread_count;
                    }
                } catch (error) {
                    console.error('Failed to load notifications:', error);
                }
            },
            
            setupNotificationListener() {
                window.addEventListener('hubNotification', (event) => {
                    const notification = event.detail;
                    this.notifications.unshift(notification);
                    
                    if (!notification.read) {
                        this.unreadCount++;
                    }
                });
            },
            
            async markAllAsRead() {
                try {
                    const response = await fetch('/hub/api/notifications/mark-all-read/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-Token': this.getCsrfToken(),
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    
                    if (response.ok) {
                        this.notifications.forEach(n => n.read = true);
                        this.unreadCount = 0;
                    }
                } catch (error) {
                    console.error('Failed to mark all as read:', error);
                }
            },
            
            getCsrfToken() {
                return document.querySelector('meta[name="csrf-token"]')?.content || '';
            }
        }));
        
    });
    
    /**
     * Initialize Hub theme when DOM is ready
     */
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize Hub store
        if (Alpine.store('hub')) {
            Alpine.store('hub').methods.init();
        }
        
        // Setup global event listeners
        setupGlobalEventListeners();
    });
    
    /**
     * Setup global event listeners
     */
    function setupGlobalEventListeners() {
        // Handle notification clicks
        window.addEventListener('showNotification', (event) => {
            const { message, type } = event.detail;
            showNotification(message, type);
        });
        
        // Handle lightbox
        window.addEventListener('openLightbox', (event) => {
            const { imageUrl } = event.detail;
            openLightbox(imageUrl);
        });
        
        // Handle message dialog
        window.addEventListener('openMessageDialog', (event) => {
            const { recipient_id, recipient_name } = event.detail;
            openMessageDialog(recipient_id, recipient_name);
        });
    }
    
    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `hub-notification hub-notification--${type}`;
        notification.innerHTML = `
            <div class="hub-notification__content">
                <span class="hub-notification__message">${message}</span>
                <button class="hub-notification__close" aria-label="Close notification">×</button>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
        
        // Close button
        notification.querySelector('.hub-notification__close').addEventListener('click', () => {
            notification.remove();
        });
    }
    
    /**
     * Open lightbox
     */
    function openLightbox(imageUrl) {
        const lightbox = document.createElement('div');
        lightbox.className = 'hub-lightbox';
        lightbox.innerHTML = `
            <div class="hub-lightbox__overlay"></div>
            <div class="hub-lightbox__content">
                <img src="${imageUrl}" alt="Lightbox image" class="hub-lightbox__image">
                <button class="hub-lightbox__close" aria-label="Close lightbox">×</button>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Close on overlay click
        lightbox.querySelector('.hub-lightbox__overlay').addEventListener('click', () => {
            lightbox.remove();
        });
        
        // Close on close button
        lightbox.querySelector('.hub-lightbox__close').addEventListener('click', () => {
            lightbox.remove();
        });
        
        // Close on escape key
        document.addEventListener('keydown', function closeOnEscape(event) {
            if (event.key === 'Escape') {
                lightbox.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
    
    /**
     * Open message dialog
     */
    function openMessageDialog(recipientId, recipientName) {
        // Implementation for message dialog
        console.log('Open message dialog for:', recipientName, recipientId);
    }
    
})(); 