/**
 * Alpine.js Store for Shop-Script Theme
 * Global state management for e-commerce functionality
 */

document.addEventListener('alpine:init', () => {
    
    // Main Shop Store
    Alpine.store('shop', {
        // Cart state
        cart: {
            items: [],
            total: 0,
            count: 0,
            loading: false
        },
        
        // Wishlist state
        wishlist: {
            items: [],
            count: 0
        },
        
        // Compare state
        compare: {
            items: [],
            count: 0
        },
        
        // User state
        user: {
            isLoggedIn: false,
            profile: null
        },
        
        // UI state
        ui: {
            mobileMenuOpen: false,
            searchOpen: false,
            filtersOpen: false,
            cartOpen: false
        },
        
        // Initialize store
        init() {
            this.loadCart();
            this.loadWishlist();
            this.loadCompare();
            this.checkUserStatus();
            
            // Listen for global events
            this.setupEventListeners();
        },
        
        // Cart methods
        async loadCart() {
            this.cart.loading = true;
            
            try {
                const response = await fetch('/shop/cart/');
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.cart.items = result.items;
                    this.cart.total = result.total;
                    this.cart.count = result.count;
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            } finally {
                this.cart.loading = false;
            }
        },
        
        async addToCart(productId, quantity = 1) {
            try {
                const response = await fetch('/shop/cart/add/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        product_id: productId,
                        quantity: quantity
                    })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    await this.loadCart();
                    this.showNotification('Товар добавлен в корзину', 'success');
                    return true;
                } else {
                    this.showNotification('Ошибка добавления товара', 'error');
                    return false;
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                this.showNotification('Ошибка добавления товара', 'error');
                return false;
            }
        },
        
        async updateCartItem(itemId, quantity) {
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
                    await this.loadCart();
                    return true;
                }
            } catch (error) {
                console.error('Error updating cart item:', error);
            }
            return false;
        },
        
        async removeFromCart(itemId) {
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
                    await this.loadCart();
                    this.showNotification('Товар удален из корзины', 'success');
                    return true;
                }
            } catch (error) {
                console.error('Error removing from cart:', error);
            }
            return false;
        },
        
        // Wishlist methods
        async loadWishlist() {
            try {
                const response = await fetch('/shop/wishlist/');
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.wishlist.items = result.items;
                    this.wishlist.count = result.count;
                }
            } catch (error) {
                console.error('Error loading wishlist:', error);
            }
        },
        
        async toggleWishlist(productId) {
            try {
                const response = await fetch('/shop/wishlist/toggle/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        product_id: productId
                    })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    await this.loadWishlist();
                    this.showNotification(
                        result.in_wishlist ? 'Добавлено в избранное' : 'Удалено из избранного',
                        'success'
                    );
                    return result.in_wishlist;
                }
            } catch (error) {
                console.error('Error toggling wishlist:', error);
            }
            return false;
        },
        
        // Compare methods
        async loadCompare() {
            try {
                const response = await fetch('/shop/compare/');
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.compare.items = result.items;
                    this.compare.count = result.count;
                }
            } catch (error) {
                console.error('Error loading compare:', error);
            }
        },
        
        async toggleCompare(productId) {
            try {
                const response = await fetch('/shop/compare/toggle/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        product_id: productId
                    })
                });
                
                const result = await response.json();
                
                if (result.status === 'ok') {
                    await this.loadCompare();
                    this.showNotification(
                        result.in_compare ? 'Добавлено к сравнению' : 'Удалено из сравнения',
                        'success'
                    );
                    return result.in_compare;
                }
            } catch (error) {
                console.error('Error toggling compare:', error);
            }
            return false;
        },
        
        // User methods
        async checkUserStatus() {
            try {
                const response = await fetch('/shop/user/status/');
                const result = await response.json();
                
                if (result.status === 'ok') {
                    this.user.isLoggedIn = result.is_logged_in;
                    this.user.profile = result.profile;
                }
            } catch (error) {
                console.error('Error checking user status:', error);
            }
        },
        
        // UI methods
        toggleMobileMenu() {
            this.ui.mobileMenuOpen = !this.ui.mobileMenuOpen;
        },
        
        toggleSearch() {
            this.ui.searchOpen = !this.ui.searchOpen;
        },
        
        toggleFilters() {
            this.ui.filtersOpen = !this.ui.filtersOpen;
        },
        
        toggleCart() {
            this.ui.cartOpen = !this.ui.cartOpen;
        },
        
        closeAllModals() {
            this.ui.mobileMenuOpen = false;
            this.ui.searchOpen = false;
            this.ui.filtersOpen = false;
            this.ui.cartOpen = false;
        },
        
        // Utility methods
        formatPrice(price) {
            return new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB'
            }).format(price);
        },
        
        showNotification(message, type = 'info') {
            // Dispatch custom event for notification
            window.dispatchEvent(new CustomEvent('show-notification', {
                detail: { message, type }
            }));
        },
        
        // Event listeners
        setupEventListeners() {
            // Listen for cart updates
            window.addEventListener('cart-updated', () => {
                this.loadCart();
            });
            
            // Listen for wishlist updates
            window.addEventListener('wishlist-updated', () => {
                this.loadWishlist();
            });
            
            // Listen for compare updates
            window.addEventListener('compare-updated', () => {
                this.loadCompare();
            });
            
            // Close modals on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeAllModals();
                }
            });
            
            // Close modals on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('[x-data]')) {
                    this.closeAllModals();
                }
            });
        }
    });
    
    // Extend parent site store
    if (Alpine.store('site')) {
        Alpine.store('site', {
            ...Alpine.store('site'),
            ...Alpine.store('shop')
        });
    }
}); 