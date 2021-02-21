import {v4} from 'uuid';

/**
 * Extracts and returns float value from a string.
 *
 * @param {string} string String
 * @return {any}
 */
export const getFloatVal = (value: string): number => {
  const floatValue = value.match(/[+-]?\d+(\.\d+)?/g)[0];
  return (floatValue !== null) ? parseFloat(parseFloat(floatValue).toFixed(2)) : null;
};

/**
 * Add first product.
 *
 * @param {Object} product Product
 * @return {{totalProductsCount: number, totalProductsPrice: any, products: Array}}
 */
export const addFirstProduct = (product) => {
  const productPrice = getFloatVal(product.price);

  const newCart = {
    products: [],
    totalProductsCount: 1,
    totalProductsPrice: productPrice,
  };

  const newProduct = createNewProduct(product, productPrice, 1);
  newCart.products.push(newProduct);

  localStorage.setItem('woo-next-cart', JSON.stringify(newCart));

  return newCart;
};

/**
 * Create a new product object.
 *
 * @param {Object} product Product
 * @param {Integer} productPrice Product Price
 * @param {Integer} qty Quantity
 * @return {{image: *, id: *, totalPrice: number, price: *, qty: *, name: *}}
 */
export const createNewProduct = (product, productPrice, qty) => ({
  id: product.id,
  image: product.image,
  name: product.name,
  price: productPrice,
  qty,
  totalPrice: parseFloat((productPrice * qty).toFixed(2)),
});

/**
 * Updates the existing cart with new item.
 *
 * @param {Object} existingCart Existing Cart.
 * @param {Object} product Product.
 * @param {Integer} qtyToBeAdded Quantity.
 * @param {Integer} newQty New Qty to be updated.
 * @return {{totalProductsCount: *, totalProductsPrice: *, products: *}}
 */
export const updateCart = (existingCart, product, qtyToBeAdded, newQty = false) => {
  const updatedProducts = getUpdatedProducts(existingCart.products, product, qtyToBeAdded, newQty);

  const addPrice = (total, item) => {
    total.totalPrice += item.totalPrice;
    total.qty += item.qty;

    return total;
  };

  // Loop through the updated product array and add the totalPrice of each item to get the totalPrice
  const total = updatedProducts.reduce(addPrice, {totalPrice: 0, qty: 0});

  const updatedCart = {
    products: updatedProducts,
    totalProductsCount: parseInt(total.qty),
    totalProductsPrice: parseFloat(total.totalPrice),
  };

  localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));

  return updatedCart;
};

/**
 * Get updated products array
 * Update the product if it exists else,
 * add the new product to existing cart,
 *
 * @param {Object} existingProductsInCart Existing product in cart
 * @param {Object} product Product
 * @param {Integer} qtyToBeAdded Quantity
 * @param {Integer} newQty New qty of the product (optional)
 * @return {*[]}
 */
export const getUpdatedProducts = (existingProductsInCart, product, qtyToBeAdded, newQty) => {
  // Check if the product already exits in the cart.
  const productExitsIndex = isProductInCart(existingProductsInCart, product.id);

  // If product exits ( index of that product found in the array ), update the product quantity and totalPrice
  if (productExitsIndex > -1) {
    const updatedProducts = existingProductsInCart;
    const updatedProduct = updatedProducts[productExitsIndex];

    // If have new qty of the product available, set that else add the qtyToBeAdded
    updatedProduct.qty = newQty ? parseInt(newQty) : parseInt(updatedProduct.qty + qtyToBeAdded);
    updatedProduct.totalPrice = parseFloat((updatedProduct.price * updatedProduct.qty).toFixed(2));

    return updatedProducts;
  }

  // If product not found push the new product to the existing product array.
  const productPrice = getFloatVal(product.price);
  const newProduct = createNewProduct(product, productPrice, qtyToBeAdded);
  existingProductsInCart.push(newProduct);

  return existingProductsInCart;
};

/**
 * Returns index of the product if it exists.
 *
 * @param {Object} existingProductsInCart Existing Products.
 * @param {Integer} id Product id.
 * @return {number | *} Index Returns -1 if product does not exist in the array, index number otherwise
 */
const isProductInCart = (existingProductsInCart, id) => {
  const returnItemThatExits = (item, index) => {
    if (id === item.id) {
      return item;
    }
  };

  // This new array will only contain the product which is matched.
  const newArray = existingProductsInCart.filter(returnItemThatExits);

  return existingProductsInCart.indexOf(newArray[0]);
};

/**
 * Remove Item from the cart.
 *
 * @param {Integer} id Product Id.
 * @return {any | string} Updated cart
 */
export const removeItemFromCart = (id) => {
  const existingCart = JSON.parse(localStorage.getItem('woo-next-cart'));

  // If there is only one item in the cart, delete the cart.
  if (existingCart.products.length === 1) {
    localStorage.removeItem('woo-next-cart');
    return null;
  }

  // Check if the product already exits in the cart.
  const productExitsIndex = isProductInCart(existingCart.products, id);

  // If product to be removed exits
  if (productExitsIndex > -1) {
    const productTobeRemoved = existingCart.products[productExitsIndex];
    const qtyToBeRemovedFromTotal = productTobeRemoved.qty;
    const priceToBeDeductedFromTotal = productTobeRemoved.totalPrice;

    // Remove that product from the array and update the total price and total quantity of the cart
    const updatedCart = existingCart;
    updatedCart.products.splice(productExitsIndex, 1);
    updatedCart.totalProductsCount -= qtyToBeRemovedFromTotal;
    updatedCart.totalProductsPrice -= priceToBeDeductedFromTotal;

    localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));
    return updatedCart;
  }
  return existingCart;
};

/**
 * Returns cart data in the required format.
 * @param {String} data Cart data
 */
export const getFormattedCart = (data) => {
  let formattedCart = null;

  if (undefined === data || !data.cart.contents.nodes.length) {
    return formattedCart;
  }

  const givenProducts = data.cart.contents.nodes;

  // Create an empty object.
  formattedCart = {};
  formattedCart.products = [];
  let totalProductsCount = 0;

  givenProducts.forEach((cartElement) => {
    const givenProduct = cartElement.product.node;
    const product = {
      id: givenProduct.id,
      cartKey: cartElement.key,
      name: givenProduct.name,
      qty: cartElement.quantity,
      price: cartElement.total / cartElement.quantity,
      totalPrice: cartElement.total,
      image: {
        sourceUrl: givenProduct.image.sourceUrl,
        srcSet: givenProduct.image.srcSet,
        title: givenProduct.image.title,
      },
    };

    totalProductsCount += cartElement.quantity;

    // Push each item into the products array.
    formattedCart.products.push(product);
  });

  formattedCart.totalProductsCount = totalProductsCount;
  formattedCart.totalProductsPrice = data.cart.total;

  return formattedCart;
};

export const createCheckoutData = (order) => {
  const checkoutData = {
    clientMutationId: v4(),

    billing: {
      firstName: order.firstName,
      lastName: order.lastName,
      address1: order.address1,
      address2: order.address2,
      city: order.city,
      country: order.country,
      state: order.state,
      postcode: order.postcode,
      email: order.email,
      phone: order.phone,
      company: order.company,
    },
    shipping: {
      firstName: order.firstName,
      lastName: order.lastName,
      address1: order.address1,
      address2: order.address2,
      city: order.city,
      country: order.country,
      state: order.state,
      postcode: order.postcode,
      email: order.email,
      phone: order.phone,
      company: order.company,
    },
    shipToDifferentAddress: false,
    paymentMethod: order.paymentMethod,
    isPaid: false,
    transactionId: 'hjkhjkhsdsdiui',
  };

  return checkoutData;
};
