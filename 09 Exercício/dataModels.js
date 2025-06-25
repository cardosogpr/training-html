class Order {
  constructor() {
    this.id = undefined;
    this.requesterName = '';
    this.products = [];
  }

  // addProduct(product) {
  //   this.products.push(product)
  // }

  save() {
    this.id = new Date().getTime();
    // save in db
  }
}

class Product {
  constructor(name, extra) {
    this.name = name;
    if (extra) {
      this.extra = ''
    }
  }

  // add more methods
}