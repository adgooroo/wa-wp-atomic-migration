/*!
 * Waboot Blog Child Theme JavaScript
 * Alpine.js components and store for blog functionality
 * WCAG 2.1 AA compliant
 * @version 1.0.0
 * @author AdGooroo
 */

document.addEventListener('alpine:init', () => {
    
    // ============================================
    // BLOG STORE DEFINITION
    // ============================================
    
    Alpine.store('blog', {
        // Blog state
        posts: [],
        categories: [],
        tags: [],
        authors: [],
        
        // Search state
        search: {
            query: '',
            results: [],
            loading: false,
            suggestions: [],
            selectedIndex: -1
        },
        
        // Reading state
        reading: {
            currentPost: null,
            readingTime: 0,
            progress: 0,
            bookmarks: []
        },
        
        // Social sharing
        social: {
            platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'telegram'],
            shareUrl: '',
            shareTitle: '',
            shareText: ''
        },
        
        // Comments state
        comments: {
            items: [],
            loading: false,
            submitting: false,
            replyTo: null
        },
        
        // Accessibility state
        accessibility: {
            focusVisible: false,
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            highContrast: window.matchMedia('(prefers-contrast: high)').matches
        },
        
        // ============================================
        // SEARCH METHODS
        // ============================================
        
        /**
         * Search blog posts
         */
        async searchPosts(query) {
            this.search.query = query;
            this.search.loading = true;
            
            // Announce search start to screen readers
            this.announceToScreenReader('Searching for posts...');
            
            try {
                const response = await fetch(`/blog/search/?q=${encodeURIComponent(query)}`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.search.results = result.data.posts || [];
                    const count = this.search.results.length;
                    this.announceToScreenReader(`Found ${count} post${count !== 1 ? 's' : ''}`);
                    return result;
                }
            } catch (error) {
                console.error('Search error:', error);
                this.announceToScreenReader('Search failed. Please try again.');
            } finally {
                this.search.loading = false;
            }
        },
        
        /**
         * Get search suggestions
         */
        async getSearchSuggestions(query) {
            if (query.length < 2) {
                this.search.suggestions = [];
                this.search.selectedIndex = -1;
                return;
            }
            
            try {
                const response = await fetch(`/blog/search/suggestions/?q=${encodeURIComponent(query)}`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.search.suggestions = result.data.suggestions || [];
                    this.search.selectedIndex = -1;
                }
            } catch (error) {
                console.error('Search suggestions error:', error);
            }
        },
        
        /**
         * Handle keyboard navigation in search suggestions
         */
        handleSearchKeyboard(event) {
            const suggestions = this.search.suggestions;
            const maxIndex = suggestions.length - 1;
            
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    this.search.selectedIndex = Math.min(this.search.selectedIndex + 1, maxIndex);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    this.search.selectedIndex = Math.max(this.search.selectedIndex - 1, -1);
                    break;
                case 'Enter':
                    event.preventDefault();
                    if (this.search.selectedIndex >= 0 && suggestions[this.search.selectedIndex]) {
                        this.selectSuggestion(suggestions[this.search.selectedIndex]);
                    } else {
                        this.search();
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    this.clearSearch();
                    break;
            }
        },
        
        /**
         * Clear search
         */
        clearSearch() {
            this.search.query = '';
            this.search.suggestions = [];
            this.search.selectedIndex = -1;
            this.search.results = [];
        },
        
        // ============================================
        // ACCESSIBILITY METHODS
        // ============================================
        
        /**
         * Announce message to screen readers
         */
        announceToScreenReader(message, priority = 'polite') {
            const announcement = document.createElement('div');
            announcement.setAttribute('aria-live', priority);
            announcement.setAttribute('aria-atomic', 'true');
            announcement.className = 'sr-only';
            announcement.textContent = message;
            
            document.body.appendChild(announcement);
            
            // Remove after announcement
            setTimeout(() => {
                document.body.removeChild(announcement);
            }, 1000);
        },
        
        /**
         * Manage focus for dynamic content
         */
        manageFocus(element) {
            if (element && typeof element.focus === 'function') {
                element.focus();
            }
        },
        
        /**
         * Trap focus within a container
         */
        trapFocus(container) {
            const focusableElements = container.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            container.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            });
        },
        
        /**
         * Handle escape key
         */
        handleEscape(callback) {
            const handleKeydown = (event) => {
                if (event.key === 'Escape') {
                    callback();
                    document.removeEventListener('keydown', handleKeydown);
                }
            };
            document.addEventListener('keydown', handleKeydown);
        },
        
        // ============================================
        // READING METHODS
        // ============================================
        
        /**
         * Calculate reading time for content
         */
        calculateReadingTime(content) {
            const wordsPerMinute = 200;
            const words = content.trim().split(/\s+/).length;
            return Math.ceil(words / wordsPerMinute);
        },
        
        /**
         * Track reading progress
         */
        trackReadingProgress() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            this.reading.progress = Math.round((scrollTop / docHeight) * 100);
        },
        
        /**
         * Add bookmark
         */
        addBookmark(postId) {
            if (!this.reading.bookmarks.includes(postId)) {
                this.reading.bookmarks.push(postId);
                localStorage.setItem('blog_bookmarks', JSON.stringify(this.reading.bookmarks));
                this.announceToScreenReader('Post bookmarked');
            }
        },
        
        /**
         * Remove bookmark
         */
        removeBookmark(postId) {
            const index = this.reading.bookmarks.indexOf(postId);
            if (index > -1) {
                this.reading.bookmarks.splice(index, 1);
                localStorage.setItem('blog_bookmarks', JSON.stringify(this.reading.bookmarks));
                this.announceToScreenReader('Bookmark removed');
            }
        },
        
        /**
         * Check if post is bookmarked
         */
        isBookmarked(postId) {
            return this.reading.bookmarks.includes(postId);
        },
        
        // ============================================
        // SOCIAL SHARING METHODS
        // ============================================
        
        /**
         * Share post on social media
         */
        sharePost(platform, post) {
            this.social.shareUrl = post.url;
            this.social.shareTitle = post.title;
            this.social.shareText = post.excerpt;
            
            const shareUrls = {
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.social.shareUrl)}`,
                twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.social.shareUrl)}&text=${encodeURIComponent(this.social.shareTitle)}`,
                linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.social.shareUrl)}`,
                whatsapp: `https://wa.me/?text=${encodeURIComponent(this.social.shareTitle + ' ' + this.social.shareUrl)}`,
                telegram: `https://t.me/share/url?url=${encodeURIComponent(this.social.shareUrl)}&text=${encodeURIComponent(this.social.shareTitle)}`
            };
            
            if (shareUrls[platform]) {
                const shareWindow = window.open(shareUrls[platform], '_blank', 'width=600,height=400');
                this.announceToScreenReader(`Opening ${platform} share dialog`);
                
                // Focus management
                if (shareWindow) {
                    this.handleEscape(() => {
                        shareWindow.close();
                    });
                }
            }
        },
        
        /**
         * Copy post URL to clipboard
         */
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.announceToScreenReader('URL copied to clipboard!');
                this.$store.notifications?.add({
                    type: 'success',
                    message: 'URL copied to clipboard!',
                    duration: 3000
                });
            } catch (error) {
                console.error('Copy to clipboard error:', error);
                this.announceToScreenReader('Failed to copy URL');
                this.$store.notifications?.add({
                    type: 'error',
                    message: 'Failed to copy URL',
                    duration: 3000
                });
            }
        },
        
        // ============================================
        // COMMENTS METHODS
        // ============================================
        
        /**
         * Load comments for a post
         */
        async loadComments(postId) {
            this.comments.loading = true;
            this.announceToScreenReader('Loading comments...');
            
            try {
                const response = await fetch(`/blog/comments/${postId}/`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.comments.items = result.data.comments || [];
                    const count = this.comments.items.length;
                    this.announceToScreenReader(`Loaded ${count} comment${count !== 1 ? 's' : ''}`);
                }
            } catch (error) {
                console.error('Load comments error:', error);
                this.announceToScreenReader('Failed to load comments');
            } finally {
                this.comments.loading = false;
            }
        },
        
        /**
         * Submit a comment
         */
        async submitComment(postId, commentData) {
            this.comments.submitting = true;
            this.announceToScreenReader('Submitting comment...');
            
            try {
                const response = await fetch(`/blog/comments/${postId}/submit/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(commentData)
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    await this.loadComments(postId);
                    this.comments.replyTo = null;
                    
                    this.announceToScreenReader('Comment submitted successfully!');
                    this.$store.notifications?.add({
                        type: 'success',
                        message: 'Comment submitted successfully!',
                        duration: 3000
                    });
                    
                    return result;
                } else {
                    throw new Error(result.errors || 'Failed to submit comment');
                }
            } catch (error) {
                console.error('Submit comment error:', error);
                this.announceToScreenReader('Failed to submit comment');
                this.$store.notifications?.add({
                    type: 'error',
                    message: error.message,
                    duration: 5000
                });
                throw error;
            } finally {
                this.comments.submitting = false;
            }
        },
        
        /**
         * Reply to a comment
         */
        replyToComment(commentId) {
            this.comments.replyTo = commentId;
            this.announceToScreenReader('Reply mode activated');
        },
        
        /**
         * Cancel reply
         */
        cancelReply() {
            this.comments.replyTo = null;
            this.announceToScreenReader('Reply cancelled');
        },
        
        // ============================================
        // INITIALIZATION
        // ============================================
        
        /**
         * Initialize blog store
         */
        async init() {
            // Load bookmarks from localStorage
            const savedBookmarks = localStorage.getItem('blog_bookmarks');
            if (savedBookmarks) {
                try {
                    this.reading.bookmarks = JSON.parse(savedBookmarks);
                } catch (error) {
                    console.error('Failed to load bookmarks from localStorage:', error);
                }
            }
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Announce page load to screen readers
            this.announceToScreenReader('Blog page loaded');
        },
        
        /**
         * Set up global event listeners
         */
        setupEventListeners() {
            // Track reading progress on scroll
            window.addEventListener('scroll', () => {
                this.trackReadingProgress();
            });
            
            // Listen for search updates
            document.addEventListener('blog:search-updated', (event) => {
                this.searchPosts(event.detail.query);
            });
            
            // Handle focus visible
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    this.accessibility.focusVisible = true;
                }
            });
            
            document.addEventListener('mousedown', () => {
                this.accessibility.focusVisible = false;
            });
        }
    });
    
    // ============================================
    // COMPONENT: BLOG SEARCH
    // ============================================
    
    Alpine.data('blogSearch', () => ({
        query: '',
        showSuggestions: false,
        debounceTimer: null,
        
        init() {
            this.query = this.$store.blog.search.query;
        },
        
        handleInput() {
            clearTimeout(this.debounceTimer);
            
            if (this.query.length >= 2) {
                this.debounceTimer = setTimeout(() => {
                    this.$store.blog.getSearchSuggestions(this.query);
                    this.showSuggestions = true;
                }, 300);
            } else {
                this.showSuggestions = false;
            }
        },
        
        handleKeydown(event) {
            this.$store.blog.handleSearchKeyboard(event);
        },
        
        search() {
            if (this.query.length > 0) {
                this.$store.blog.searchPosts(this.query);
                this.showSuggestions = false;
                
                // Navigate to search results
                window.location.href = `/blog/search/?q=${encodeURIComponent(this.query)}`;
            }
        },
        
        selectSuggestion(suggestion) {
            this.query = suggestion;
            this.search();
        },
        
        get suggestions() {
            return this.$store.blog.search.suggestions;
        },
        
        get selectedIndex() {
            return this.$store.blog.search.selectedIndex;
        }
    }));
    
    // ============================================
    // COMPONENT: POST CARD
    // ============================================
    
    Alpine.data('postCard', (post) => ({
        post: post,
        readingTime: 0,
        
        init() {
            // Calculate reading time
            if (this.post.excerpt) {
                this.readingTime = this.$store.blog.calculateReadingTime(this.post.excerpt);
            }
        },
        
        toggleBookmark() {
            if (this.$store.blog.isBookmarked(this.post.id)) {
                this.$store.blog.removeBookmark(this.post.id);
            } else {
                this.$store.blog.addBookmark(this.post.id);
            }
        },
        
        sharePost(platform) {
            this.$store.blog.sharePost(platform, this.post);
        },
        
        get isBookmarked() {
            return this.$store.blog.isBookmarked(this.post.id);
        }
    }));
    
    // ============================================
    // COMPONENT: READING PROGRESS
    // ============================================
    
    Alpine.data('readingProgress', () => ({
        progress: 0,
        
        init() {
            this.updateProgress();
            window.addEventListener('scroll', () => {
                this.updateProgress();
            });
        },
        
        updateProgress() {
            this.progress = this.$store.blog.reading.progress;
        }
    }));
    
    // ============================================
    // COMPONENT: COMMENTS
    // ============================================
    
    Alpine.data('comments', (postId) => ({
        postId: postId,
        commentForm: {
            name: '',
            email: '',
            text: '',
            parent_id: null
        },
        
        init() {
            this.loadComments();
        },
        
        async loadComments() {
            await this.$store.blog.loadComments(this.postId);
        },
        
        async submitComment() {
            try {
                await this.$store.blog.submitComment(this.postId, this.commentForm);
                this.resetForm();
            } catch (error) {
                // Error handling is done in the store
            }
        },
        
        replyToComment(commentId) {
            this.$store.blog.replyToComment(commentId);
            this.commentForm.parent_id = commentId;
        },
        
        cancelReply() {
            this.$store.blog.cancelReply();
            this.commentForm.parent_id = null;
        },
        
        resetForm() {
            this.commentForm = {
                name: '',
                email: '',
                text: '',
                parent_id: null
            };
        },
        
        get comments() {
            return this.$store.blog.comments.items;
        },
        
        get loading() {
            return this.$store.blog.comments.loading;
        },
        
        get submitting() {
            return this.$store.blog.comments.submitting;
        },
        
        get replyTo() {
            return this.$store.blog.comments.replyTo;
        }
    }));
    
    // ============================================
    // COMPONENT: SOCIAL SHARING
    // ============================================
    
    Alpine.data('socialSharing', (post) => ({
        post: post,
        linkCopied: false,
        showMessage: false,
        message: '',
        
        shareOnFacebook() {
            this.$store.blog.sharePost('facebook', this.post);
        },
        
        shareOnTwitter() {
            this.$store.blog.sharePost('twitter', this.post);
        },
        
        shareOnLinkedIn() {
            this.$store.blog.sharePost('linkedin', this.post);
        },
        
        shareOnWhatsApp() {
            this.$store.blog.sharePost('whatsapp', this.post);
        },
        
        shareViaEmail() {
            const subject = encodeURIComponent(this.post.title);
            const body = encodeURIComponent(`${this.post.title}\n\n${this.post.excerpt}\n\nRead more: ${this.post.url}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        },
        
        async copyLink() {
            await this.$store.blog.copyToClipboard(this.post.url);
            this.linkCopied = true;
            this.showMessage = true;
            this.message = 'Link copied to clipboard!';
            
            setTimeout(() => {
                this.linkCopied = false;
                this.showMessage = false;
            }, 2000);
        }
    }));
    
});

// ============================================
// INITIALIZE BLOG STORE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the blog store
    if (window.Alpine && Alpine.store('blog')) {
        Alpine.store('blog').init();
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format date for blog posts
 */
window.formatBlogDate = function(date, format = 'long') {
    const d = new Date(date);
    const options = {
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric' },
        relative: 'relative'
    };
    
    if (format === 'relative') {
        const now = new Date();
        const diff = now - d;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
        if (days < 365) return `${Math.floor(days / 30)} months ago`;
        return `${Math.floor(days / 365)} years ago`;
    }
    
    return d.toLocaleDateString('en-US', options[format]);
};

/**
 * Truncate text to specified length
 */
window.truncateText = function(text, length = 150, suffix = '...') {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
};

/**
 * Debounce function
 */
window.debounce = function(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
};

/**
 * Accessibility utility: Check if element is visible
 */
window.isElementVisible = function(element) {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
};

/**
 * Accessibility utility: Get next focusable element
 */
window.getNextFocusableElement = function(currentElement, direction = 'forward') {
    const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(currentElement);
    let nextIndex;
    
    if (direction === 'forward') {
        nextIndex = currentIndex + 1 >= focusableElements.length ? 0 : currentIndex + 1;
    } else {
        nextIndex = currentIndex - 1 < 0 ? focusableElements.length - 1 : currentIndex - 1;
    }
    
    return focusableElements[nextIndex];
}; 