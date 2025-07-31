/**
 * Alpine.js Components for Hub Theme
 * Based on Bootscore methodology and Atomic Design
 */

document.addEventListener('alpine:init', () => {
    
    // Hub Search Component
    Alpine.data('hubSearch', () => ({
        query: '',
        results: [],
        loading: false,
        showResults: false,
        
        async search() {
            if (this.query.length < 2) {
                this.results = [];
                this.showResults = false;
                return;
            }
            
            this.loading = true;
            this.showResults = true;
            
            try {
                const response = await fetch(`/hub/search?q=${encodeURIComponent(this.query)}`);
                const data = await response.json();
                this.results = data.results || [];
            } catch (error) {
                console.error('Search error:', error);
                this.results = [];
            } finally {
                this.loading = false;
            }
        },
        
        selectResult(result) {
            window.location.href = result.url;
        },
        
        hideResults() {
            setTimeout(() => {
                this.showResults = false;
            }, 200);
        }
    }));
    
    // Newsletter Subscription Component
    Alpine.data('newsletterSubscription', () => ({
        email: '',
        loading: false,
        success: false,
        error: '',
        
        async subscribe() {
            if (!this.email) return;
            
            this.loading = true;
            this.error = '';
            
            try {
                const response = await fetch('/hub/newsletter/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ email: this.email })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.success = true;
                    this.email = '';
                } else {
                    this.error = data.message || 'Ошибка подписки';
                }
            } catch (error) {
                console.error('Subscription error:', error);
                this.error = 'Ошибка подключения';
            } finally {
                this.loading = false;
            }
        }
    }));
    
    // Hub Topic Card Component
    Alpine.data('hubTopicCard', (topic) => ({
        topic: topic,
        loading: false,
        liked: false,
        bookmarked: false,
        
        async toggleLike() {
            this.loading = true;
            
            try {
                const response = await fetch(`/hub/topic/${this.topic.id}/like`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const data = await response.json();
                this.liked = data.liked;
                this.topic.likes_count = data.likes_count;
            } catch (error) {
                console.error('Like error:', error);
            } finally {
                this.loading = false;
            }
        },
        
        async toggleBookmark() {
            this.loading = true;
            
            try {
                const response = await fetch(`/hub/topic/${this.topic.id}/bookmark`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const data = await response.json();
                this.bookmarked = data.bookmarked;
            } catch (error) {
                console.error('Bookmark error:', error);
            } finally {
                this.loading = false;
            }
        },
        
        shareTopic(platform) {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(this.topic.title);
            
            let shareUrl = '';
            
            switch (platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'telegram':
                    shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        }
    }));
    
    // Hub Comments Component
    Alpine.data('hubComments', (topicId) => ({
        topicId: topicId,
        comments: [],
        newComment: {
            content: ''
        },
        loading: false,
        submitting: false,
        
        async loadComments() {
            this.loading = true;
            
            try {
                const response = await fetch(`/hub/topic/${this.topicId}/comments`);
                const data = await response.json();
                this.comments = data.comments || [];
            } catch (error) {
                console.error('Load comments error:', error);
            } finally {
                this.loading = false;
            }
        },
        
        async submitComment() {
            if (!this.newComment.content.trim()) return;
            
            this.submitting = true;
            
            try {
                const response = await fetch(`/hub/topic/${this.topicId}/comment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(this.newComment)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    this.comments.unshift(data.comment);
                    this.newComment = { content: '' };
                }
            } catch (error) {
                console.error('Submit comment error:', error);
            } finally {
                this.submitting = false;
            }
        },
        
        formatDate(dateString) {
            return new Date(dateString).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }));
    
    // Hub Pagination Component
    Alpine.data('hubPagination', (currentPage, totalPages) => ({
        currentPage: currentPage,
        totalPages: totalPages,
        
        get pages() {
            const pages = [];
            const start = Math.max(1, this.currentPage - 2);
            const end = Math.min(this.totalPages, this.currentPage + 2);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            return pages;
        },
        
        hasPrevious() {
            return this.currentPage > 1;
        },
        
        hasNext() {
            return this.currentPage < this.totalPages;
        },
        
        getPreviousUrl() {
            return this.currentPage > 1 ? `?page=${this.currentPage - 1}` : '#';
        },
        
        getNextUrl() {
            return this.currentPage < this.totalPages ? `?page=${this.currentPage + 1}` : '#';
        },
        
        getPageUrl(page) {
            return `?page=${page}`;
        }
    }));
    
    // Hub Category Filter Component
    Alpine.data('hubCategoryFilter', () => ({
        selectedCategory: '',
        categories: [],
        loading: false,
        
        async loadCategories() {
            this.loading = true;
            
            try {
                const response = await fetch('/hub/categories');
                const data = await response.json();
                this.categories = data.categories || [];
            } catch (error) {
                console.error('Load categories error:', error);
            } finally {
                this.loading = false;
            }
        },
        
        filterByCategory(categoryId) {
            this.selectedCategory = categoryId;
            const url = categoryId ? `/hub/category/${categoryId}` : '/hub';
            window.location.href = url;
        }
    }));
    
    // Hub Tag Cloud Component
    Alpine.data('hubTagCloud', () => ({
        tags: [],
        loading: false,
        
        async loadTags() {
            this.loading = true;
            
            try {
                const response = await fetch('/hub/tags');
                const data = await response.json();
                this.tags = data.tags || [];
            } catch (error) {
                console.error('Load tags error:', error);
            } finally {
                this.loading = false;
            }
        },
        
        getTagSize(tag) {
            const maxCount = Math.max(...this.tags.map(t => t.count));
            const ratio = tag.count / maxCount;
            return 0.8 + (ratio * 0.8); // 0.8rem to 1.6rem
        }
    }));
    
    // Hub User Profile Component
    Alpine.data('hubUserProfile', (userId) => ({
        userId: userId,
        user: null,
        topics: [],
        comments: [],
        loading: false,
        
        async loadUser() {
            this.loading = true;
            
            try {
                const response = await fetch(`/hub/user/${this.userId}`);
                const data = await response.json();
                this.user = data.user;
                this.topics = data.topics || [];
                this.comments = data.comments || [];
            } catch (error) {
                console.error('Load user error:', error);
            } finally {
                this.loading = false;
            }
        },
        
        async followUser() {
            try {
                const response = await fetch(`/hub/user/${this.userId}/follow`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const data = await response.json();
                this.user.following = data.following;
                this.user.followers_count = data.followers_count;
            } catch (error) {
                console.error('Follow user error:', error);
            }
        }
    }));
    
    // Hub Topic Creation Component
    Alpine.data('hubTopicCreation', () => ({
        topic: {
            title: '',
            content: '',
            category_id: '',
            tags: []
        },
        loading: false,
        submitting: false,
        
        async createTopic() {
            if (!this.topic.title.trim() || !this.topic.content.trim()) return;
            
            this.submitting = true;
            
            try {
                const response = await fetch('/hub/topic/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(this.topic)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    window.location.href = data.topic.url;
                }
            } catch (error) {
                console.error('Create topic error:', error);
            } finally {
                this.submitting = false;
            }
        },
        
        addTag(tag) {
            if (!this.topic.tags.includes(tag)) {
                this.topic.tags.push(tag);
            }
        },
        
        removeTag(tag) {
            this.topic.tags = this.topic.tags.filter(t => t !== tag);
        }
    }));
}); 