document.addEventListener('DOMContentLoaded', function() {
    
    const cart = new Cart();
    const uiCartDisplay = new UICartDisplay();
    cart.addObserver(uiCartDisplay);

    
    const products = [
        ProductFactory.createProduct('electronics', 'Gaming Laptop', 55499.99, '💻'),
        ProductFactory.createProduct('electronics', 'Flagship Smartphone', 39499.99, '📱'),
        ProductFactory.createProduct('electronics', 'Bluetooth Speaker', 4899.99, '🔊'),
        ProductFactory.createProduct('electronics', 'Smart Watch', 9299.99, '⌚'),
        ProductFactory.createProduct('electronics', 'Wireless Headset', 3599.99, '🎧'),
        ProductFactory.createProduct('electronics', 'Mechanical Keyboard', 2799.99, '⌨️'),
    ];

 
    const productsGrid = document.getElementById('productsGrid');
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.getDetails().image}</div>
            <h3>${product.getDetails().name}</h3>
            <p class="category">${product.getDetails().category}</p>
            <p class="price">₱${product.getPrice().toLocaleString('en-PH', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <button class="add-to-cart" data-index="${index}">Add to Cart</button>
        `;
        productsGrid.appendChild(productCard);
    });

  
    function applyDecorators(product) {
        const giftWrap = document.getElementById('giftWrap').checked;
        const discount = document.getElementById('discount').checked;
        const freeShipping = document.getElementById('freeShipping').checked;

        let decoratedProduct = product;

        if (giftWrap) {
            decoratedProduct = new GiftWrapDecorator(decoratedProduct);
        }
        if (discount) {
            decoratedProduct = new DiscountDecorator(decoratedProduct);
        }
        if (freeShipping) {
            decoratedProduct = new ShippingDecorator(decoratedProduct);
        }

        return decoratedProduct;
    }

 
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const index = parseInt(e.target.dataset.index);
            const originalProduct = products[index];
            
           
            const decoratedProduct = applyDecorators(originalProduct);
            
            cart.addItem(decoratedProduct);
            
     
            showNotification(`${originalProduct.getDetails().name} added to cart!`);
        }
    });

  
    document.getElementById('clearCart').addEventListener('click', () => {
        if (cart.getItems().length > 0) {
            if (confirm('Are you sure you want to clear the cart?')) {
                cart.clearCart();
                showNotification('Cart cleared successfully!');
            }
        }
    });

    function showNotification(message) {
        
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    function renderCartItem(item) {
        const cartItemsDiv = document.getElementById('cartItems');
        const formattedPrice = item.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'cart-item';
        cartItemDiv.innerHTML = `
            <span>${item.name} - ₱${formattedPrice}</span>
            <!-- Add remove button or other controls here -->
        `;
        cartItemsDiv.appendChild(cartItemDiv);
    }

    cart.notifyObservers();

    function updateTotalPrice(total) {
        document.getElementById('totalPrice').textContent = total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
});