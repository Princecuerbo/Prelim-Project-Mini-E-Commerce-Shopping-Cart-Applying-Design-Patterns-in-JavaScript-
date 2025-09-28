
class ProductDecorator {
    constructor(product) {
        this.product = product;
    }

    getDetails() {
        return this.product.getDetails();
    }

    getPrice() {
        return this.product.getPrice();
    }
}


class GiftWrapDecorator extends ProductDecorator {
    getDetails() {
        const details = super.getDetails();
        return {
            ...details,
            giftWrap: true
        };
    }

    getPrice() {
        return super.getPrice() + 149.99;
    }
}

class DiscountDecorator extends ProductDecorator {
    getDetails() {
        const details = super.getDetails();
        return {
            ...details,
            discount: '10%'
        };
    }

    getPrice() {
        return super.getPrice() * 0.9; //
    }
}

class ShippingDecorator extends ProductDecorator {
    getDetails() {
        const details = super.getDetails();
        return {
            ...details,
            shipping: 'Free'
        };
    }

    getPrice() {
        const basePrice = super.getPrice();
        
        return basePrice;
    }
}