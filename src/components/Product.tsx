import {isEmpty} from 'lodash';
import React from 'react';

import AddToCartButton from 'components/cart/AddToCartButton';
import Link from 'next/link';
import {ProductObject, ProductType} from 'src/mw/metadata/Metadata';

import Price from './single-product/price';

import clientConfig from '../../client-config';

const Product = ({product}: {product: ProductObject}): JSX.Element => (
  // @TODO Need to handle Group products differently.
  product.type !== ProductType.GroupProduct && (
    <div className='product mb-5'>
      <Link href={`/product/${product.slug}`}>
        <button>
          { !isEmpty(product.image) ? (
            <img src={product.image.sourceUrl} alt='Product image' />
          ) : !isEmpty(clientConfig.productImagePlaceholder) ? (
            <img
              src={clientConfig.productImagePlaceholder}
              alt='Placeholder product image'
            />
          ) : null }
        </button>
      </Link>
      <div className='product-info'>
        <h3 className='product-title mt-3 font-medium text-gray-800'>
          {product.name}
        </h3>
        <div className='product-description text-sm text-gray-700'>{product?.description}</div>
        <Price salesPrice={product?.price} regularPrice={product?.regularPrice} />
        <AddToCartButton product={product} />
      </div>

    </div>
  )
);

export default Product;
