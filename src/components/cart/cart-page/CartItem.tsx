import React, {useState} from 'react';
import {v4} from 'uuid';

import {CartItemObject} from 'src/mw/metadata/Metadata';

import {Cross} from '../../icons';

const CartItem = ({
  item,
  updateCartProcessing,
  handleRemoveProductClick,
  updateCart,
}: {
  item: CartItemObject,
  updateCartProcessing: any,
  handleRemoveProductClick: any,
  updateCart: any,
}): JSX.Element => {
  const [productCount, setProductCount] = useState(item.quantity);

  /*
  * When user changes the qty from product input update the cart in localStorage
  * Also update the cart in global context
  *
  * @param {Object} event event
  *
  * @return {void}
  */
  const handleQuantityChange = (event) => {
    if (process.browser) {
      event.stopPropagation();

      // If the previous update cart mutation request is still processing, then return.
      if (updateCartProcessing) {
        return;
      }

      // If the user tries to delete the count of product,
      // set that to 1 by default (This will not allow him to reduce it less than zero )
      const newQuantity = (event.target.value) ? Number(event.target.value) : 1;
      setProductCount(newQuantity);

      updateCart({
        variables: {
          input: {
            clientMutationId: v4(),
            items: [{
              key: item.key,
              quantity: newQuantity,
            }],
          },
        },
      });
    }
  };

  return (
    <tr className='woo-next-cart-item' key={item.key}>
      <th className='woo-next-cart-element woo-next-cart-el-close'>
        {/* Remove item */}
        <span
          className='woo-next-cart-close-icon cursor-pointer'
          onClick={(event) => handleRemoveProductClick(event, item.key)}
        >
          <Cross />
        </span>
      </th>
      <td className='woo-next-cart-element'>
        <img width='64' src={item.product.image.sourceUrl} srcSet={item.product.image.srcSet} alt={item.product.image.title} />
      </td>
      <td className='woo-next-cart-element'>{ item.product.name }</td>
      <td className='woo-next-cart-element'>{ item.product.price }</td>

      {/* Qty Input */ }
      <td className='woo-next-cart-element woo-next-cart-qty'>
        {/* @TODO Need to update this with graphQL query */ }
        <input
          type='number'
          min='1'
          data-cart-key={item.key}
          className={`woo-next-cart-qty-input form-control ${updateCartProcessing ? 'opacity-25 cursor-not-allowed' : ''} `}
          value={productCount}
          onChange={(event) => handleQuantityChange(event)}
        />
      </td>
      <td className='woo-next-cart-element'>
        { item.total }
      </td>
    </tr>
  );
};

export default CartItem;
