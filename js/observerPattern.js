class CartObserver {
    update(cart) {
        throw new Error("Method 'update()' must be implemented.");
    }
}

class UICartDisplay extends CartObserver {
    constructor() {
        super();
        this.cartItemsElement = document.getElementById('cartItems');
        this.totalPriceElement = document.getElementById('totalPrice');
        this.cart = null;
    }

    update(cart) {
        this.cart = cart;
        this.updateCartItems(cart.getItems());
        this.updateTotalPrice(cart.getTotal());
    }

    updateCartItems(items) {
        this.cartItemsElement.innerHTML = '';
        
        if (items.length === 0) {
            this.cartItemsElement.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            const details = item.getDetails();
            let itemDescription = details.name;
            
            
            if (details.giftWrap) itemDescription += ' 🎁';
            if (details.discount) itemDescription += ' 💰';
            if (details.shipping === 'Free') itemDescription += ' 🚚';
            
                const formattedPrice = item.getPrice().toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                let shippingFee = item.getPrice() >= 10000 ? 1000 : 500;
                let formattedShipping = shippingFee.toLocaleString('en-PH', { minimumFractionDigits: 0 });
                itemElement.innerHTML = `
                    <span>${itemDescription} - ₱${formattedPrice} <span style='color:#888;'>Shipping Fee ${formattedShipping}</span></span>
                    <button class="remove-item" data-index="${index}">❌ Remove</button>
                `;
            this.cartItemsElement.appendChild(itemElement);
        });

        
        this.addRemoveEventListeners();
    }

    addRemoveEventListeners() {
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                if (this.cart) {
                    this.cart.removeItem(index);
                }
            });
        });
    }

    updateTotalPrice(total) {
        let displayText = total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const freeShippingChecked = document.getElementById('freeShipping').checked;
        if (freeShippingChecked) {
            displayText += ' (Free Shipping 🚚)';
        }
        this.totalPriceElement.textContent = displayText;
        
        this.totalPriceElement.style.color = '#e74c3c';
        this.totalPriceElement.style.fontWeight = 'bold';
        setTimeout(() => {
            this.totalPriceElement.style.color = '';
            this.totalPriceElement.style.fontWeight = '';
        }, 500);
    }
}


class Cart {
    constructor() {
        this.items = [];
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.update(this));
    }

    addItem(item) {
        this.items.push(item);
        this.notifyObservers();
    }

    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            const removedItem = this.items.splice(index, 1)[0];
            this.notifyObservers();
            return removedItem;
        }
        return null;
    }

    clearCart() {
        this.items = [];
        this.notifyObservers();
    }

    getItems() {
        return this.items;
    }

    getTotal() {
        const freeShippingChecked = document.getElementById('freeShipping').checked;
        let total = 0;
        let shippingTotal = 0;
        this.items.forEach(item => {
            const price = item.getPrice();
            total += price;
            
            let shippingFee = 0;
            
            const details = item.getDetails();
            if (freeShippingChecked || details.shipping === 'Free') {
                shippingFee = 0;
            } else {
                shippingFee = price >= 10000 ? 1000 : 500;
            }
            shippingTotal += shippingFee;
        });
        return total + shippingTotal;
    }
}