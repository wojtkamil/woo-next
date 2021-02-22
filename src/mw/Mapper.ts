import omit from 'lodash/omit';

import {
  ProductObject,
  MyImage,
  GalleryImage,
  ProductCategory,
  CartObject,
  CartItemObject,
} from './metadata/Metadata';

export default class ProductMapper {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public static productFromJson(productJson): ProductObject {
    let image: MyImage = null;
    let galleryImages: GalleryImage[] = null;
    if (productJson.image) {
      // eslint-disable-next-line no-underscore-dangle
      image = {...omit(productJson.image, '__typename'), type: productJson.image.__typename} as MyImage;
    }
    if (productJson.galleryImages?.nodes.length) {
      galleryImages = productJson.galleryImages.nodes.map((galleryImage) => (
        // eslint-disable-next-line no-underscore-dangle
        {...omit(galleryImage, '__typename'), type: galleryImage.__typename}
      ));
    }
    const product = {
      ...omit(productJson, '__typename'),
      averageRating: productJson.averageRating,
      id: productJson.id,
      name: productJson.name,
      productId: productJson.databaseId,
      slug: productJson.slug,
      // eslint-disable-next-line no-underscore-dangle
      type: productJson.__typename,
      image,
      galleryImages,
    };

    return product;
  }

  public static productsFromJson(productsJson): ProductObject[] {
    if (!productsJson) {
      return [];
    }
    return productsJson.map((productJson) => ProductMapper.productFromJson(productJson));
  }

  public static productCategoryFromJson(productCategoryJson): ProductCategory {
    let image: MyImage = null;
    if (productCategoryJson.image) {
      // eslint-disable-next-line no-underscore-dangle
      image = {...omit(productCategoryJson.image, '__typename'), type: productCategoryJson.image.__typename} as MyImage;
    }
    const productCategory = {
      ...omit(productCategoryJson, '__typename'),
      id: productCategoryJson.id,
      name: productCategoryJson.name,
      slug: productCategoryJson.slug,
      // eslint-disable-next-line no-underscore-dangle
      type: productCategoryJson.__typename,
      image,
    };

    return productCategory;
  }

  public static productCategoriesFromJson(productCategoriesJson): ProductObject[] {
    if (!productCategoriesJson) {
      return [];
    }
    return productCategoriesJson.map(
      (productCategoryJson) => ProductMapper.productCategoryFromJson(productCategoryJson),
    );
  }

  public static cartFromJson = (cartJson): CartObject => {
    console.log(cartJson);
    if (!cartJson || !cartJson.contents.nodes.length) {
      return null;
    }

    const cartItems: CartItemObject[] = [];

    cartJson.contents.nodes.forEach((item) => {
      const product = ProductMapper.productFromJson(item.product.node);
      const cartItem = {
        ...omit(item, '__typename'),
        product,
        key: item.key,
        quantity: item.quantity,
        total: item.total,
        // eslint-disable-next-line no-underscore-dangle
        type: item.__typename,
      };
      cartItems.push(cartItem);
    });

    // eslint-disable-next-line max-len
    const shippingMethods = cartJson.availableShippingMethods[0].rates.map((method) => ({...omit(method, '__typename')}));

    const cart: CartObject = {
      cartItems,
      productCount: cartJson.contents.productCount,
      total: cartJson.total,
      subtotal: cartJson.subtotal,
      shippingTotal: cartJson.shippingTotal,
      discountTotal: cartJson.discountTotal,
      shippingMethods,
    };

    return cart;
  }
}
