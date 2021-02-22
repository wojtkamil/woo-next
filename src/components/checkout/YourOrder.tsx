import React from 'react';

import CheckoutCartItem from 'components/checkout/CheckoutCartItem';
import {CartObject} from 'src/mw/metadata/Metadata';

const YourOrder = ({cart}: {cart: CartObject}): JSX.Element => (
  <>
    { cart ? (
      <>
        {/* Product Listing */}
        <table className='checkout-cart table table-hover w-full mb-10'>
          <thead>
            <tr className='woo-next-cart-head-container text-left'>
              <th className='woo-next-cart-heading-el' scope='col' />
              <th className='woo-next-cart-heading-el' scope='col'>Product</th>
              <th className='woo-next-cart-heading-el' scope='col'>Total</th>
            </tr>
          </thead>
          <tbody>
            { cart.cartItems.length && (
              cart.cartItems.map((item) => <CheckoutCartItem key={item.key} item={item} />)
            ) }
            {/* Total */}
            <tr className='bg-gray-200'>
              <td className='' />
              <td className='woo-next-checkout-total font-normal text-xl'>Subtotal</td>
              <td className='woo-next-checkout-total font-bold text-xl'>{ cart.total }</td>
            </tr>
            {/* <tr className="">
							<td className=""/>
							<td className="woo-next-checkout-total">Total</td>
							<td className="woo-next-checkout-total">{ cart.totalProductsPrice }</td>
						</tr> */}
          </tbody>
        </table>
      </>
    ) : '' }
  </>
);

export default YourOrder;
