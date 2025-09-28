
class Product {
    constructor(name, price, category, image = '📦') {
        this.name = name;
        this.price = price;
        this.category = category;
        this.image = image;
    }

    getDetails() {
        return {
            name: this.name,
            price: this.price,
            category: this.category,
            image: this.image
        };
    }

    getPrice() {
        return this.price;
    }
}


class ProductFactory {
    static createProduct(type, name, price, image = '📦') {
        switch(type) {
            case 'electronics':
                return new Product(name, price, 'Electronics', image);
            case 'clothing':
                return new Product(name, price, 'Clothing', image);
            case 'books':
                return new Product(name, price, 'Books', image);
            default:
                return new Product(name, price, 'General', image);
        }
    }
}