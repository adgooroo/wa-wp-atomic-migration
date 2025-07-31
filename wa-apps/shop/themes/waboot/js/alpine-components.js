/**
 * Alpine.js Components for Shop-Script Theme
 * Based on Bootscore methodology and Atomic Design
 */

document.addEventListener('alpine:init', () => {
    
    // Product Card Component
    Alpine.data('productCard', (product) => ({
        product: product,
        loading: false,
        inWishlist: false,
        inCompare: false,
        
        init() {
            // Check if product is in wishlist/compare on load
            this.checkWishlistStatus();
            this.checkCompareStatus();
        },
        
        async addToCart() {
            this.loading = true;
            
            try {
                const response = await fetch('/shop/cart/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        product_id: this.product.id,
                        quantity: 1
                    })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    // Update cart count in store
                    Alpine.store('shop').updateCartCount(result.cart_count);
                    
                    // Show success notification
                    this.showNotification('Товар добавлен в корзину', 'success');
                } else {
                    this.showNotification('Ошибка добавления товара', 'error');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                this.showNotification('Ошибка добавления товара', 'error');
            } finally {
                this.loading = false;
            }
        },
        
        async toggleWishlist() {
            try {
                const response = await fetch('/shop/wishlist/toggle/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        product_id: this.product.id
                    })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.inWishlist = result.in_wishlist;
                    this.showNotification(
                        this.inWishlist ? 'Добавлено в избранное' : 'Удалено из избранного',
                        'success'
                    );
                }
            } catch (error) {
                console.error('Error toggling wishlist:', error);
            }
        },
        
        async toggleCompare() {
            try {
                const response = await fetch('/shop/compare/toggle/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        product_id: this.product.id
                    })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.inCompare = result.in_compare;
                    this.showNotification(
                        this.inCompare ? 'Добавлено к сравнению' : 'Удалено из сравнения',
                        'success'
                    );
                }
            } catch (error) {
                console.error('Error toggling compare:', error);
            }
        },
        
        checkWishlistStatus() {
            // Check if product is in wishlist
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            this.inWishlist = wishlist.includes(this.product.id);
        },
        
        checkCompareStatus() {
            // Check if product is in compare
            const compare = JSON.parse(localStorage.getItem('compare') || '[]');
            this.inCompare = compare.includes(this.product.id);
        },
        
        showNotification(message, type = 'info') {
            // Dispatch custom event for notification
            window.dispatchEvent(new CustomEvent('show-notification', {
                detail: { message, type }
            }));
        }
    }));
    
    // Shopping Cart Component
    Alpine.data('shoppingCart', () => ({
        open: false,
        items: [],
        total: 0,
        loading: false,
        
        init() {
            this.loadCart();
            
            // Listen for cart updates
            window.addEventListener('cart-updated', () => {
                this.loadCart();
            });
        },
        
        async loadCart() {
            this.loading = true;
            
            try {
                const response = await fetch('/shop/cart/');
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.items = result.items;
                    this.total = result.total;
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            } finally {
                this.loading = false;
            }
        },
        
        async updateQuantity(itemId, quantity) {
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
                    this.loadCart();
                }
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        },
        
        async removeItem(itemId) {
            try {
                const response = await fetch('/shop/cart/remove/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        item_id: itemId
                    })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.loadCart();
                }
            } catch (error) {
                console.error('Error removing item:', error);
            }
        },
        
        toggleCart() {
            this.open = !this.open;
        },
        
        closeCart() {
            this.open = false;
        },
        
        formatPrice(price) {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB'
            }).format(price);
        }
    }));
    
    // Product Filter Component
    Alpine.data('productFilter', () => ({
        filters: {
            category: null,
            price_min: null,
            price_max: null,
            brand: [],
            in_stock: false,
            on_sale: false,
            rating: null
        },
        loading: false,
        results: [],
        total_results: 0,
        
        init() {
            // Load initial filters from URL params
            this.loadFiltersFromURL();
            
            // Watch for filter changes
            this.$watch('filters', () => {
                this.applyFilters();
            }, { deep: true });
        },
        
        loadFiltersFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            
            this.filters.category = urlParams.get('category') || null;
            this.filters.price_min = urlParams.get('price_min') || null;
            this.filters.price_max = urlParams.get('price_max') || null;
            this.filters.brand = urlParams.get('brand') ? urlParams.get('brand').split(',') : [];
            this.filters.in_stock = urlParams.get('in_stock') === 'true';
            this.filters.on_sale = urlParams.get('on_sale') === 'true';
            this.filters.rating = urlParams.get('rating') || null;
        },
        
        async applyFilters() {
            this.loading = true;
            
            try {
                const params = new URLSearchParams();
                
                // Add filters to params
                Object.entries(this.filters).forEach(([key, value]) => {
                    if (value !== null && value !== false && value !== '') {
                        if (Array.isArray(value)) {
                            if (value.length > 0) {
                                params.append(key, value.join(','));
                            }
                        } else {
                            params.append(key, value);
                        }
                    }
                });
                
                const response = await fetch(`/shop/products/?${params.toString()}`);
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.results = result.products;
                    this.total_results = result.total;
                    
                    // Update URL without page reload
                    const newURL = `${window.location.pathname}?${params.toString()}`;
                    window.history.pushState({}, '', newURL);
                }
            } catch (error) {
                console.error('Error applying filters:', error);
            } finally {
                this.loading = false;
            }
        },
        
        clearFilters() {
            this.filters = {
                category: null,
                price_min: null,
                price_max: null,
                brand: [],
                in_stock: false,
                on_sale: false,
                rating: null
            };
        },
        
        toggleBrand(brand) {
            const index = this.filters.brand.indexOf(brand);
            if (index > -1) {
                this.filters.brand.splice(index, 1);
            } else {
                this.filters.brand.push(brand);
            }
        }
    }));
    
    // Search Component
    Alpine.data('productSearch', () => ({
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
            
            try {
                const response = await fetch(`/shop/search/?q=${encodeURIComponent(this.query)}`);
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.results = result.products;
                    this.showResults = true;
                }
            } catch (error) {
                console.error('Error searching:', error);
            } finally {
                this.loading = false;
            }
        },
        
        selectResult(product) {
            window.location.href = product.url;
        },
        
        hideResults() {
            setTimeout(() => {
                this.showResults = false;
            }, 200);
        }
    }));
    
    // Notification Component
    Alpine.data('notification', () => ({
        message: '',
        type: 'info',
        visible: false,
        timeout: null,
        
        show(message, type = 'info', duration = 3000) {
            this.message = message;
            this.type = type;
            this.visible = true;
            
            if (this.timeout) {
                clearTimeout(this.timeout);
            }
            
            this.timeout = setTimeout(() => {
                this.hide();
            }, duration);
        },
        
        hide() {
            this.visible = false;
        }
    }));
}); 