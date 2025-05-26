class GrocerySystem {
    constructor() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.validCredentials = {
            email: "ian.zapcart@gmail.com",
            password: "icecreamlover23"
        };
        this.cart = [];
        this.orderHistory = []; // Store past orders

        this.categories = {
            beverages: [
                { id: 1, name: 'Coca-Cola', price: 30, image: 'coca-cola.jpg' },
                { id: 2, name: 'Pepsi', price: 30, image: 'pepsi.jpg' }
            ],
            condiments: [
                { id: 3, name: 'Soy Sauce', price: 35, image: 'soy-sauce.jpg' },
                { id: 4, name: 'Vinegar', price: 25, image: 'vinegar.jpg' }
            ],
            frozenGoods: [
                { id: 5, name: 'Ice Cream', price: 120, image: 'ice-cream.jpg' },
                { id: 6, name: 'Frozen Fish', price: 180, image: 'frozen-fish.jpg' }
            ],
            snacks: [
                { id: 7, name: 'Nova', price: 65, image: 'nova.jpg' },
                { id: 8, name: 'Piattos', price: 65, image: 'piattos.jpg' }
            ]
        };
        this.initializeEventListeners();
    }

    
    addToCart(productId) {
        // Check if user is logged in
    if (!this.isLoggedIn) {
         this.showLoginModal();
      return;
    }
        const product = this.findProductById(productId);
        if (product) {
            const existingItem = this.cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({...product, quantity: 1});
            }
            this.updateCartDisplay();
            this.showNotification(`${product.name} added to cart!`);
        }
    }

    removeFromCart(productId) {
        const index = this.cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            const product = this.cart[index];
            this.cart.splice(index, 1);
            this.updateCartDisplay();
            this.showNotification(`${product.name} removed from cart!`);
        }
    }

    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = newQuantity;
                this.updateCartDisplay();
            }
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--primary-color)';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.borderRadius = 'var(--border-radius)';
        notification.style.boxShadow = 'var(--shadow)';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        notification.style.transition = 'all 0.3s ease';
        
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    findProductById(id) {
        for (let category in this.categories) {
            const product = this.categories[category].find(p => p.id === id);
            if (product) return product;
        }
        return null;
    }

    updateCartDisplay() {
        const cartContainer = document.querySelector('.cart-items');
        const emptyCartEl = document.querySelector('.empty-cart');
        const cartSummaryEl = document.querySelector('.cart-summary');
        const totalElement = document.getElementById('cart-total');
        const cartCountElement = document.querySelector('.cart-count');
        
        cartContainer.innerHTML = '';

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;

        if (this.cart.length === 0) {
            emptyCartEl.style.display = 'block';
            cartContainer.style.display = 'none';
            cartSummaryEl.style.display = 'none';
            return;
        }

        emptyCartEl.style.display = 'none';
        cartContainer.style.display = 'block';
        cartSummaryEl.style.display = 'block';

        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <div class="cart-item-image">
                        <img src="${this.getIconForProduct(item.id)}" alt="Product Image" class="product-image-2">
                    </div>
                    <div>
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p class="cart-item-price">₱${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="grocerySystem.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="grocerySystem.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" onclick="grocerySystem.removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const total = subtotal;
        
        document.querySelector('.cart-summary-item:first-child').innerHTML = `
            <span>Subtotal</span>
            <span>₱${subtotal.toFixed(2)}</span>
        `;
        
        totalElement.textContent = total.toFixed(2);
    }

    getIconForProduct(productId) {
        if (productId === 1) return 'images/Coke.png';
        if (productId === 2) return 'images/Pepsi.png';
        if (productId === 3) return 'images/Toyo.png';
        if (productId === 4) return 'images/Suka.png';
        if (productId === 5) return 'images/IceCream.png';
        if (productId === 6) return 'images/Fish.png';
        if (productId === 7) return 'images/Nova.png';
        if (productId === 8) return 'images/Piattos.png';
        return 'images/default-product.png';
    }

    redeemOrder(orderIndex) {
        const order = this.orderHistory[orderIndex];
        if (!order) return;

        if (order.redeemed) {
            this.showRedemptionModal(false, 'This order has already been redeemed!');
            return;
        }

        order.redeemed = true;
        order.redemptionDate = new Date().toLocaleString();

        this.showRedemptionModal(true, `Order #${String(orderIndex + 1).padStart(4, '0')} has been successfully redeemed!`);

        this.updateOrderHistoryDisplay();
    }

    showRedemptionModal(success, message) {
        let modal = document.getElementById('redemption-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'redemption-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content redemption-modal-content">
                    <div class="redemption-icon">
                        <i class="fas fa-check-circle" id="redemption-success-icon"></i>
                        <i class="fas fa-exclamation-triangle" id="redemption-error-icon" style="display: none;"></i>
                    </div>
                    <h2 id="redemption-title">Order Redeemed!</h2>
                    <p id="redemption-message">Your order has been successfully redeemed.</p>
                    <button id="redemption-ok-btn" class="btn btn-primary">OK</button>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('redemption-ok-btn').addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300);
                }
            });
        }

        const successIcon = document.getElementById('redemption-success-icon');
        const errorIcon = document.getElementById('redemption-error-icon');
        const title = document.getElementById('redemption-title');
        const messageEl = document.getElementById('redemption-message');

        if (success) {
            successIcon.style.display = 'block';
            errorIcon.style.display = 'none';
            title.textContent = 'Order Redeemed!';
            title.style.color = '#16a34a';
            successIcon.style.color = '#16a34a';
        } else {
            successIcon.style.display = 'none';
            errorIcon.style.display = 'block';
            title.textContent = 'Already Redeemed';
            title.style.color = '#dc2626';
            errorIcon.style.color = '#dc2626';
        }

        messageEl.textContent = message;

        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    initializeEventListeners() {
        const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        const navOverlay = document.querySelector('.nav-overlay');

        const loginBtn = document.getElementById('login-btn');
        const loginModalClose = document.querySelector('#login-modal .modal-close');
        
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navOverlay.classList.toggle('active');
            
            const icon = mobileNavToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        navOverlay.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navOverlay.classList.remove('active');
            const icon = mobileNavToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });

        const categoryBtns = document.querySelectorAll('.category-btn');
        const categorySections = document.querySelectorAll('.category-section');
        
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const category = btn.textContent.trim().toLowerCase();
                
                if (category === 'all products') {
                    categorySections.forEach(section => {
                        section.style.display = 'block';
                    });
                } else {
                    categorySections.forEach(section => {
                        if (section.id === category.replace(' ', '-') || 
                            section.id === category.replace(' ', '')) {
                            section.style.display = 'block';
                        } else {
                            section.style.display = 'none';
                        }
                    });
                }
            });
        });

        const checkoutBtn = document.getElementById('checkout-btn');
        const confirmOrderBtn = document.getElementById('confirm-order');
        const modal = document.getElementById('checkout-modal');
        const modalClose = document.querySelector('.modal-close');
        
        checkoutBtn.addEventListener('click', () => {
            modal.style.display = 'block';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        });
        
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });

        confirmOrderBtn.addEventListener('click', this.processOrder.bind(this));
        
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                navLinks.classList.remove('active');
                navOverlay.classList.remove('active');
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });

        loginBtn.addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            if (email && password) {
                this.login(email, password);
            } else {
                this.showNotification('Please fill in all fields');
            }
        });

        window.addEventListener('click', (e) => {
            const loginModal = document.getElementById('login-modal');
            
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
                setTimeout(() => {
                    loginModal.style.display = 'none';
                    document.getElementById('login-message').style.display = 'none';
                    document.getElementById('login-btn').disabled = false;
                }, 300);
            }
        });

        this.updateLoggedInState();
    }

   processOrder() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
    const pickupTime = document.getElementById('pickup-time').value;
    const deliveryOption = document.querySelector('select').value;
    const customerName = document.getElementById('customer-name').value;
    const contactNumber = document.getElementById('contact-number').value;

    if (!paymentMethod || !pickupTime || !customerName || !contactNumber) {
        this.showNotification('Please fill in all required fields!');
        return;
    }

    const order = {
        items: [...this.cart],
        paymentMethod: paymentMethod.value,
        pickupTime: pickupTime,
        deliveryOption: deliveryOption,
        orderDate: new Date().toLocaleString(),
        customerName: customerName,
        contactNumber: contactNumber,
        redeemed: false
    };

    // Calculate total amount (this is the amount the customer pays)
    const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate subtotal and VAT
    const vatRate = 0.12;
    const subtotal = total / (1 + vatRate);
    const vat = total - subtotal;

    // Add subtotal, VAT, and total to the order
    order.subtotal = subtotal;
    order.vat = vat;
    order.total = total;

    this.orderHistory.push(order);

    this.cart = [];
    this.updateCartDisplay();

    const modal = document.getElementById('checkout-modal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);

    this.showNotification(`Order Placed Successfully! Your ${deliveryOption} is confirmed.`);
    this.updateOrderHistoryDisplay();
}

    updateOrderHistoryDisplay() {
        const historyContainer = document.querySelector('.order-history');
        historyContainer.innerHTML = '<h2>Order History</h2>';

        if (this.orderHistory.length === 0) {
            historyContainer.innerHTML += `
                <div class="empty-orders">
                    <i class="fas fa-clipboard-list" style="font-size: 3rem; color: #94a3b8; margin-bottom: 1rem;"></i>
                    <h3 style="color: #334155;">No orders yet</h3>
                    <p style="color: #94a3b8;">Your order history will appear here once you make your first purchase.</p>
                </div>
            `;
            return;
        }

        const ordersList = document.createElement('div');
        ordersList.classList.add('orders-list');

        this.orderHistory.forEach((order, index) => {
            const orderDiv = document.createElement('div');
            orderDiv.classList.add('order-card');
            
            const statusClass = order.redeemed ? 'redeemed' : 'confirmed';
            const statusText = order.redeemed ? 'Redeemed' : 'Confirmed';
            const statusIcon = order.redeemed ? 'fa-check-double' : 'fa-check-circle';
            
            orderDiv.innerHTML = `
                <div class="order-header">
                    <div class="order-info">
                        <h3 class="order-number">Order #${String(index + 1).padStart(4, '0')}</h3>
                        <div class="order-status">
                            <span class="status-badge ${statusClass}">
                                <i class="fas ${statusIcon}"></i> ${statusText}
                            </span>
                        </div>
                    </div>
                    <div class="order-total">
                        <span class="total-label">Total</span>
                        <span class="total-amount">₱${order.total.toFixed(2)}</span>
                    </div>
                </div>
                
                <div class="order-details">
                    <div class="customer-info">
                        <div class="info-row">
                            <i class="fas fa-user"></i>
                            <span>${order.customerName}</span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-phone"></i>
                            <span>${order.contactNumber}</span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-calendar"></i>
                            <span>${order.orderDate}</span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-clock"></i>
                            <span>Pickup: ${new Date(order.pickupTime).toLocaleString()}</span>
                        </div>
                        <div class="info-row">
                            <i class="fas fa-credit-card"></i>
                            <span>${order.paymentMethod === 'cash' ? 'Cash on Pickup' : 'Online Payment'}</span>
                        </div>
                        ${order.redeemed ? `
                        <div class="info-row">
                            <i class="fas fa-check-double"></i>
                            <span>Redeemed: ${order.redemptionDate}</span>
                        </div>
                        ` : ''}
                    </div>
                    
                    <div class="order-qr">
                        <div class="qr-code ${order.redeemed ? 'redeemed' : ''}" onclick="grocerySystem.redeemOrder(${index})" style="cursor: pointer;">
                            <img src="images/qrCode.png" alt="Order QR Code" width="240" height="240">
                            ${order.redeemed ? '<div class="redeemed-overlay"><i class="fas fa-check-circle"></i><span>REDEEMED</span></div>' : ''}
                        </div>
                        <p class="qr-label">${order.redeemed ? 'Order Redeemed' : 'Click to Redeem Order'}</p>
                    </div>
                   
                </div>
                
                <div class="order-items">
                    <h4 class="items-title">
                        <i class="fas fa-shopping-bag"></i>
                        Items Ordered (${order.items.length})
                    </h4>
                    <div class="items-list">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <div class="item-info">
                                    <span class="item-name">${item.name}</span>
                                    <span class="item-quantity">×${item.quantity}</span>
                                </div>
                                <span class="item-price">₱${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="order-summary">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>₱${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>VAT (12%)</span>
                        <span>₱${order.vat.toFixed(2)}</span>
                    </div>
                    <div class="summary-row total-row">
                        <strong>Total (Incl. VAT)</strong>
                        <strong>₱${order.total.toFixed(2)}</strong>
                    </div>
                </div>
            `;
            
            ordersList.appendChild(orderDiv);
        });

        historyContainer.appendChild(ordersList);

        if (!document.getElementById('order-history-styles')) {
            const styles = document.createElement('style');
            styles.id = 'order-history-styles';
            styles.textContent = `
                .empty-orders {
                    text-align: center;
                    padding: 3rem 2rem;
                    background: #f8fafc;
                    border-radius: 12px;
                    margin: 2rem 0;
                }
                
                .orders-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-top: 2rem;
                }
                
                .order-card {
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    overflow: hidden;
                    transition: all 0.3s ease;
                }
                
                .order-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
                
                .order-header {
                    background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%);
                    padding: 1.5rem;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .order-number {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 0 0 0.5rem 0;
                }
                
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.2);
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                
                .status-badge.confirmed {
                    background: rgba(34, 197, 94, 0.3);
                }
                
                .status-badge.redeemed {
                    background: rgba(59, 130, 246, 0.3);
                }
                
                .total-label {
                    display: block;
                    font-size: 0.875rem;
                    opacity: 0.9;
                    margin-bottom: 0.25rem;
                }
                
                .total-amount {
                    font-size: 1.5rem;
                    font-weight: 700;
                }
                
                .order-details {
                    padding: 1.5rem;
                    display: grid;
                    grid-template-columns: 1fr auto;
                    gap: 2rem;
                    align-items: start;
                }
                
                .customer-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .info-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: #334155;
                }
                
                .info-row i {
                    color: #4ade80;
                    width: 16px;
                    text-align: center;
                }
                
                .order-qr {
                    text-align: center;
                    padding: 1rem;
                    background: #f8fafc;
                    border-radius: 8px;
                    position: relative;
                }
                
                .qr-code {
                    margin-bottom: 0.5rem;
                    position: relative;
                    display: inline-block;
                    transition: all 0.3s ease;
                }
                
                .qr-code:hover {
                    transform: scale(1.05);
                }
                
                .qr-code.redeemed {
                    opacity: 0.6;
                }
                
                .redeemed-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(59, 130, 246, 0.9);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: bold;
                    border-radius: 8px;
                }
                
                .redeemed-overlay i {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }
                
                .qr-label {
                    font-size: 0.75rem;
                    color: #94a3b8;
                    margin: 0;
                    font-weight: 500;
                }
                
                .order-items {
                    padding: 0 1.5rem 1.5rem;
                    border-top: 1px solid #e2e8f0;
                    margin-top: 1rem;
                    padding-top: 1.5rem;
                }
                
                .items-title {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #334155;
                    font-size: 1rem;
                    margin: 0 0 1rem 0;
                }
                
                .items-title i {
                    color: #4ade80;
                }
                
                .items-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .order-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.75rem;
                    background: #f8fafc;
                    border-radius: 6px;
                }
                
                .item-info {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .item-name {
                    color: #334155;
                    font-weight: 500;
                }
                
                .item-quantity {
                    color: #94a3b8;
                    font-size: 0.875rem;
                    background: #e2e8f0;
                    padding: 0.125rem 0.5rem;
                    border-radius: 12px;
                }
                
                .item-price {
                    color: #16a34a;
                    font-weight: 600;
                }

                .order-summary {
                    padding: 0 1.5rem 1.5rem;
                    border-top: 1px solid #e2e8f0;
                    margin-top: 1rem;
                }

                .order-summary .summary-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 1rem;
                    padding: 0.25rem 0;
                    color: #334155;
                }

                .order-summary .total-row strong {
                    font-weight: 700;
                    color: #16a34a;
                }
                
                /* Redemption Modal Styles */
                .redemption-modal-content {
                    text-align: center;
                    padding: 2rem;
                    max-width: 400px;
                }
                
                .redemption-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }
                
                .redemption-modal-content h2 {
                    margin: 0 0 1rem 0;
                    font-size: 1.5rem;
                }
                
                .redemption-modal-content p {
                    margin: 0 0 2rem 0;
                    color: #64748b;
                    font-size: 1rem;
                    line-height: 1.5;
                }
                
                .redemption-modal-content .btn {
                    padding: 0.75rem 2rem;
                    font-size: 1rem;
                    font-weight: 600;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .redemption-modal-content .btn-primary {
                    background: #4ade80;
                    color: white;
                }
                
                .redemption-modal-content .btn-primary:hover {
                    background: #16a34a;
                    transform: translateY(-1px);
                }
                
                @media (max-width: 768px) {
                    .order-header {
                        flex-direction: column;
                        gap: 1rem;
                        text-align: center;
                    }
                    
                    .order-details {
                        grid-template-columns: 1fr;
                        gap: 1.5rem;
                    }
                    
                    .order-qr {
                        order: -1;
                        text-align: center;
                    }
                    
                    .redemption-modal-content {
                        padding: 1.5rem;
                        margin: 1rem;
                    }
                    
                    .redemption-icon {
                        font-size: 3rem;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
    }


    showLoginModal() {
        const modal = document.getElementById('login-modal');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    login(email, password) {
        const loginMessage = document.getElementById('login-message');
        const loginBtn = document.getElementById('login-btn');
        
        loginMessage.style.display = 'block';
        loginBtn.disabled = true;
        
        setTimeout(() => {
            if (email === this.validCredentials.email && password === this.validCredentials.password) {
                this.isLoggedIn = true;
                this.currentUser = { email: email };
                
                const modal = document.getElementById('login-modal');
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.style.display = 'none';
                    loginMessage.style.display = 'none';
                    loginBtn.disabled = false;
                    
                    document.getElementById('login-email').value = '';
                    document.getElementById('login-password').value = '';
                }, 300);
                
                this.showNotification(`Welcome back, ${email.split('@')[0]}!`);
                this.updateLoggedInState();
            } else {
                loginMessage.style.display = 'none';
                loginBtn.disabled = false;
                this.showNotification('Invalid email or password!');
            }
        }, 1500);
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.cart = [];
        this.updateCartDisplay();
        this.updateLoggedInState();
        this.showNotification('You have been logged out');
    }

    updateLoggedInState() {
        const navLinks = document.querySelector('.nav-links');
        
        const existingAuthLink = document.querySelector('.auth-link');
        if (existingAuthLink) {
            navLinks.removeChild(existingAuthLink);
        }
        
        const authLink = document.createElement('a');
        authLink.classList.add('auth-link');
        
        if (this.isLoggedIn) {
            const displayName = this.currentUser.email.split('@')[0];
            authLink.innerHTML = `<i class="fas fa-user"></i> ${displayName} (Logout)`;
            authLink.href = "#";
            authLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        } else {
            authLink.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
            authLink.href = "#";
            authLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginModal();
            });
        }
        
        navLinks.appendChild(authLink);
    }
}


function toggleOrderModal() {
    const modal = document.getElementById('order-history-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
}

window.onclick = function(event) {
    const modal = document.getElementById('order-history-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};


document.addEventListener('DOMContentLoaded', () => {
    window.grocerySystem = new GrocerySystem();
});

