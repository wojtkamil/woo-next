import React from 'react';

import {CartItemObject} from 'src/mw/metadata/Metadata';

const CheckoutCartItem = ({item}: {item: CartItemObject}): JSX.Element => (
  <tr className='woo-next-cart-item' key={item.key}>
    <td className='woo-next-cart-element'>
      <img width='64' src={item.product.image.sourceUrl} srcSet={item.product.image.srcSet} alt={item.product.image.title} />
    </td>
    <td className='woo-next-cart-element'>{item.product.name}</td>
    <td className='woo-next-cart-element'>{item.total}</td>
  </tr>
);

export default CheckoutCartItem;
