/*!
 * Waboot Blog Child Theme JavaScript
 * Alpine.js components and store for blog functionality
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
            suggestions: []
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
        
        // ============================================
        // SEARCH METHODS
        // ============================================
        
        /**
         * Search blog posts
         */
        async searchPosts(query) {
            this.search.query = query;
            this.search.loading = true;
            
            try {
                const response = await fetch(`/blog/search/?q=${encodeURIComponent(query)}`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.search.results = result.data.posts || [];
                    return result;
                }
            } catch (error) {
                console.error('Search error:', error);
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
                }
            } catch (error) {
                console.error('Search suggestions error:', error);
            }
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
                window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            }
        },
        
        /**
         * Copy post URL to clipboard
         */
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.$store.notifications?.add({
                    type: 'success',
                    message: 'URL copied to clipboard!',
                    duration: 3000
                });
            } catch (error) {
                console.error('Copy to clipboard error:', error);
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
            
            try {
                const response = await fetch(`/blog/comments/${postId}/`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.comments.items = result.data.comments || [];
                }
            } catch (error) {
                console.error('Load comments error:', error);
            } finally {
                this.comments.loading = false;
            }
        },
        
        /**
         * Submit a comment
         */
        async submitComment(postId, commentData) {
            this.comments.submitting = true;
            
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
        },
        
        /**
         * Cancel reply
         */
        cancelReply() {
            this.comments.replyTo = null;
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
        
        shareOn(platform) {
            this.$store.blog.sharePost(platform, this.post);
        },
        
        copyUrl() {
            this.$store.blog.copyToClipboard(this.post.url);
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