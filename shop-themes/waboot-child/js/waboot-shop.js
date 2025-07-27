/*!
 * Waboot Shop Child Theme JavaScript
 * Alpine.js components and store for e-commerce functionality
 * @version 1.0.0
 * @author AdGooroo
 */

document.addEventListener('alpine:init', () => {
    
    // ============================================
    // SHOP STORE DEFINITION
    // ============================================
    
    Alpine.store('shop', {
        // Cart state
        cart: {
            items: [],
            total: 0,
            count: 0,
            currency: 'USD',
            loading: false
        },
        
        // Product filters
        filters: {
            category: null,
            priceMin: null,
            priceMax: null,
            brand: [],
            inStock: false,
            onSale: false,
            rating: null,
            sortBy: 'default',
            viewMode: 'grid'
        },
        
        // Wishlist state
        wishlist: {
            items: [],
            count: 0
        },
        
        // Compare products
        compare: {
            items: [],
            count: 0,
            maxItems: 4
        },
        
        // Search state
        search: {
            query: '',
            results: [],
            loading: false,
            suggestions: []
        },
        
        // ============================================
        // CART METHODS
        // ============================================
        
        /**
         * Add product to cart
         */
        async addToCart(product) {
            this.cart.loading = true;
            
            try {
                const response = await fetch('/shop/cart/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        product_id: product.product_id,
                        sku_id: product.sku_id || null,
                        quantity: product.quantity || 1
                    })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    await this.updateCart();
                    return result;
                } else {
                    throw new Error(result.errors || 'Failed to add product to cart');
                }
            } catch (error) {
                console.error('Add to cart error:', error);
                throw error;
            } finally {
                this.cart.loading = false;
            }
        },
        
        /**
         * Remove product from cart
         */
        async removeFromCart(itemId) {
            this.cart.loading = true;
            
            try {
                const response = await fetch('/shop/cart/remove/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ item_id: itemId })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    await this.updateCart();
                    return result;
                } else {
                    throw new Error(result.errors || 'Failed to remove product from cart');
                }
            } catch (error) {
                console.error('Remove from cart error:', error);
                throw error;
            } finally {
                this.cart.loading = false;
            }
        },
        
        /**
         * Update cart item quantity
         */
        async updateCartQuantity(itemId, quantity) {
            this.cart.loading = true;
            
            try {
                const response = await fetch('/shop/cart/update/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ 
                        item_id: itemId,
                        quantity: quantity
                    })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    await this.updateCart();
                    return result;
                } else {
                    throw new Error(result.errors || 'Failed to update cart');
                }
            } catch (error) {
                console.error('Update cart error:', error);
                throw error;
            } finally {
                this.cart.loading = false;
            }
        },
        
        /**
         * Clear entire cart
         */
        async clearCart() {
            this.cart.loading = true;
            
            try {
                const response = await fetch('/shop/cart/clear/', {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.cart.items = [];
                    this.cart.total = 0;
                    this.cart.count = 0;
                    return result;
                } else {
                    throw new Error(result.errors || 'Failed to clear cart');
                }
            } catch (error) {
                console.error('Clear cart error:', error);
                throw error;
            } finally {
                this.cart.loading = false;
            }
        },
        
        /**
         * Update cart state from server
         */
        async updateCart() {
            try {
                const response = await fetch('/shop/cart/', {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.cart.items = result.data.items || [];
                    this.cart.total = result.data.total || 0;
                    this.cart.count = result.data.count || 0;
                    this.cart.currency = result.data.currency || 'USD';
                }
            } catch (error) {
                console.error('Update cart error:', error);
            }
        },
        
        // ============================================
        // WISHLIST METHODS
        // ============================================
        
        /**
         * Toggle product in wishlist
         */
        async toggleWishlist(productId) {
            try {
                const response = await fetch('/shop/wishlist/toggle/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({ product_id: productId })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    await this.updateWishlist();
                    return result;
                } else {
                    throw new Error(result.errors || 'Failed to update wishlist');
                }
            } catch (error) {
                console.error('Wishlist error:', error);
                throw error;
            }
        },
        
        /**
         * Check if product is in wishlist
         */
        isInWishlist(productId) {
            return this.wishlist.items.some(item => item.product_id === productId);
        },
        
        /**
         * Update wishlist state from server
         */
        async updateWishlist() {
            try {
                const response = await fetch('/shop/wishlist/', {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.wishlist.items = result.data.items || [];
                    this.wishlist.count = result.data.count || 0;
                }
            } catch (error) {
                console.error('Update wishlist error:', error);
            }
        },
        
        // ============================================
        // PRODUCT COMPARISON METHODS
        // ============================================
        
        /**
         * Toggle product in comparison
         */
        toggleCompare(product) {
            const index = this.compare.items.findIndex(item => item.id === product.id);
            
            if (index > -1) {
                this.compare.items.splice(index, 1);
            } else if (this.compare.items.length < this.compare.maxItems) {
                this.compare.items.push(product);
            } else {
                throw new Error(`Maximum ${this.compare.maxItems} products can be compared`);
            }
            
            this.compare.count = this.compare.items.length;
            
            // Save to localStorage
            localStorage.setItem('shop_compare', JSON.stringify(this.compare.items));
        },
        
        /**
         * Check if product is in comparison
         */
        isInCompare(productId) {
            return this.compare.items.some(item => item.id === productId);
        },
        
        /**
         * Clear comparison
         */
        clearCompare() {
            this.compare.items = [];
            this.compare.count = 0;
            localStorage.removeItem('shop_compare');
        },
        
        // ============================================
        // FILTER METHODS
        // ============================================
        
        /**
         * Update product filters
         */
        updateFilters(newFilters) {
            this.filters = { ...this.filters, ...newFilters };
            this.applyFilters();
        },
        
        /**
         * Clear all filters
         */
        clearFilters() {
            this.filters = {
                category: null,
                priceMin: null,
                priceMax: null,
                brand: [],
                inStock: false,
                onSale: false,
                rating: null,
                sortBy: 'default',
                viewMode: 'grid'
            };
            this.applyFilters();
        },
        
        /**
         * Apply current filters
         */
        async applyFilters() {
            try {
                const params = new URLSearchParams();
                
                Object.entries(this.filters).forEach(([key, value]) => {
                    if (value !== null && value !== '' && value !== false) {
                        if (Array.isArray(value) && value.length > 0) {
                            params.append(key, value.join(','));
                        } else if (!Array.isArray(value)) {
                            params.append(key, value);
                        }
                    }
                });
                
                // Update URL without page reload
                const newUrl = window.location.pathname + '?' + params.toString();
                window.history.pushState({}, '', newUrl);
                
                // Trigger filter event for components to listen
                document.dispatchEvent(new CustomEvent('shop:filters-updated', {
                    detail: this.filters
                }));
                
            } catch (error) {
                console.error('Apply filters error:', error);
            }
        },
        
        // ============================================
        // SEARCH METHODS
        // ============================================
        
        /**
         * Search products
         */
        async searchProducts(query) {
            this.search.query = query;
            this.search.loading = true;
            
            try {
                const response = await fetch(`/shop/search/?q=${encodeURIComponent(query)}`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.search.results = result.data.products || [];
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
                const response = await fetch(`/shop/search/suggestions/?q=${encodeURIComponent(query)}`, {
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
        // INITIALIZATION
        // ============================================
        
        /**
         * Initialize shop store
         */
        async init() {
            // Load cart state
            await this.updateCart();
            
            // Load wishlist state
            await this.updateWishlist();
            
            // Load comparison from localStorage
            const savedCompare = localStorage.getItem('shop_compare');
            if (savedCompare) {
                try {
                    this.compare.items = JSON.parse(savedCompare);
                    this.compare.count = this.compare.items.length;
                } catch (error) {
                    console.error('Failed to load comparison from localStorage:', error);
                }
            }
            
            // Set up event listeners
            this.setupEventListeners();
        },
        
        /**
         * Set up global event listeners
         */
        setupEventListeners() {
            // Listen for cart updates from other sources
            document.addEventListener('shop:cart-updated', (event) => {
                this.updateCart();
            });
            
            // Listen for wishlist updates
            document.addEventListener('shop:wishlist-updated', (event) => {
                this.updateWishlist();
            });
        }
    });
    
    // ============================================
    // COMPONENT: PRODUCT CARD
    // ============================================
    
    Alpine.data('productCard', (product) => ({
        product: product,
        loading: false,
        
        async addToCart() {
            this.loading = true;
            
            try {
                await this.$store.shop.addToCart({
                    product_id: this.product.id,
                    sku_id: this.product.sku_id,
                    quantity: 1
                });
                
                // Show success message
                this.$store.notifications?.add({
                    type: 'success',
                    message: 'Product added to cart!',
                    duration: 3000
                });
                
            } catch (error) {
                this.$store.notifications?.add({
                    type: 'error',
                    message: error.message,
                    duration: 5000
                });
            } finally {
                this.loading = false;
            }
        },
        
        async toggleWishlist() {
            try {
                await this.$store.shop.toggleWishlist(this.product.id);
            } catch (error) {
                this.$store.notifications?.add({
                    type: 'error',
                    message: error.message,
                    duration: 5000
                });
            }
        },
        
        toggleCompare() {
            try {
                this.$store.shop.toggleCompare(this.product);
                
                const isInCompare = this.$store.shop.isInCompare(this.product.id);
                this.$store.notifications?.add({
                    type: 'info',
                    message: isInCompare ? 'Product added to comparison' : 'Product removed from comparison',
                    duration: 3000
                });
                
            } catch (error) {
                this.$store.notifications?.add({
                    type: 'error',
                    message: error.message,
                    duration: 5000
                });
            }
        },
        
        get isInWishlist() {
            return this.$store.shop.isInWishlist(this.product.id);
        },
        
        get isInCompare() {
            return this.$store.shop.isInCompare(this.product.id);
        }
    }));
    
    // ============================================
    // COMPONENT: PRODUCT FILTERS
    // ============================================
    
    Alpine.data('productFilters', () => ({
        filters: {},
        
        init() {
            this.filters = { ...this.$store.shop.filters };
        },
        
        updateFilter(key, value) {
            this.filters[key] = value;
            this.$store.shop.updateFilters({ [key]: value });
        },
        
        clearFilters() {
            this.filters = {};
            this.$store.shop.clearFilters();
        }
    }));
    
    // ============================================
    // COMPONENT: SEARCH
    // ============================================
    
    Alpine.data('productSearch', () => ({
        query: '',
        showSuggestions: false,
        debounceTimer: null,
        
        init() {
            this.query = this.$store.shop.search.query;
        },
        
        handleInput() {
            clearTimeout(this.debounceTimer);
            
            if (this.query.length >= 2) {
                this.debounceTimer = setTimeout(() => {
                    this.$store.shop.getSearchSuggestions(this.query);
                    this.showSuggestions = true;
                }, 300);
            } else {
                this.showSuggestions = false;
            }
        },
        
        search() {
            if (this.query.length > 0) {
                this.$store.shop.searchProducts(this.query);
                this.showSuggestions = false;
                
                // Navigate to search results
                window.location.href = `/shop/search/?q=${encodeURIComponent(this.query)}`;
            }
        },
        
        selectSuggestion(suggestion) {
            this.query = suggestion;
            this.search();
        },
        
        get suggestions() {
            return this.$store.shop.search.suggestions;
        }
    }));
    
});

// ============================================
// INITIALIZE SHOP STORE ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the shop store
    if (window.Alpine && Alpine.store('shop')) {
        Alpine.store('shop').init();
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format price with currency
 */
window.formatPrice = function(price, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(price);
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