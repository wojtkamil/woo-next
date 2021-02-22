import {isEmpty} from 'lodash';
import React, {useContext, useState} from 'react';
import {v4} from 'uuid';

import {useMutation, useQuery} from '@apollo/client';
import CartItem from 'components/cart/cart-page/CartItem';
import {AppContext} from 'components/context/AppContext';
import Link from 'next/link';
import ProductMapper from 'src/mw/Mapper';

import CLEAR_CART_MUTATION from '../../../mutations/clear-cart';
import UPDATE_CART from '../../../mutations/update-cart';
import GET_CART from '../../../queries/get-cart';

const CartItemsContainer = (): JSX.Element => {
  // @TODO wil use it in future variations of the project.
  const [cart, setCart] = useContext(AppContext);
  console.log(cart);
  const [requestError, setRequestError] = useState(null);

  // Get Cart Data.
  const {
    loading, error, data, refetch,
  } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      // console.warn( 'completed GET_CART', data );

      // Update cart in the localStorage.
      const updatedCart = ProductMapper.cartFromJson(data.cart);
      console.log(data, updatedCart);
      localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));

      // Update cart data in React Context.
      setCart(updatedCart);
    },
  });

  // Update Cart Mutation.
  const [
    updateCart,
    {data: updateCartResponse, loading: updateCartProcessing, error: updateCartError},
  ] = useMutation(UPDATE_CART, {
    onCompleted: () => {
      refetch();
    },
    onError: (e) => {
      if (e) {
        const errorMessage = e?.graphQLErrors?.[0]?.message ? e.graphQLErrors[0].message : '';
        setRequestError(errorMessage);
      }
    },
  });

  // Clear Cart Mutation.
  const [
    clearCart,
    {data: clearCartRes, loading: clearCartProcessing, error: clearCartError},
  ] = useMutation(CLEAR_CART_MUTATION, {
    onCompleted: () => {
      refetch();
    },
    onError: (e) => {
      if (e) {
        const errorMessage = !isEmpty(e?.graphQLErrors?.[0]) ? e.graphQLErrors[0]?.message : '';
        setRequestError(errorMessage);
      }
    },
  });

  const handleRemoveProductClick = (event, cartKey) => {
    event.stopPropagation();
    // By passing the newQty to 0 in updateCart Mutation, it will remove the item.
    const newQuantity = 0;

    updateCart({
      variables: {
        input: {
          clientMutationId: v4(),
          items: [{
            key: cartKey,
            quantity: newQuantity,
          }],
        },
      },
    });
  };

  const handleClearCart = (event) => {
    event.stopPropagation();

    if (clearCartProcessing) {
      return;
    }

    clearCart({
      variables: {
        input: {
          clientMutationId: v4(),
          all: true,
        },
      },
    });
  };

  return (
    <div className='cart product-cart-container container mx-auto my-32 px-4 xl:px-0'>
      { cart ? (
        <div className='woo-next-cart-wrapper container'>
          <div className='cart-header grid grid-cols-2 gap-4'>
            <h1 className='text-2xl mb-5 uppercase'>Cart</h1>
            {/* Clear entire cart */}
            <div className='clear-cart text-right'>
              <button className='px-4 py-1 bg-gray-500 text-white rounded-sm w-auto' onClick={(event) => handleClearCart(event)} disabled={clearCartProcessing}>
                <span className='woo-next-cart'>Clear Cart</span>
                <i className='fa fa-arrow-alt-right' />
              </button>
              { clearCartProcessing ? <p>Clearing...</p> : '' }
              { updateCartProcessing ? <p>Updating...</p> : null }
            </div>
          </div>
          <div className='grid grid-cols-1 xl:grid-cols-4 gap-0 xl:gap-4 mb-5'>
            <table className='cart-products table-auto col-span-3 mb-5'>
              <thead className='text-left'>
                <tr className='woo-next-cart-head-container'>
                  <th className='woo-next-cart-heading-el' scope='col' />
                  <th className='woo-next-cart-heading-el' scope='col' />
                  <th className='woo-next-cart-heading-el' scope='col'>Product</th>
                  <th className='woo-next-cart-heading-el' scope='col'>Price</th>
                  <th className='woo-next-cart-heading-el' scope='col'>Quantity</th>
                  <th className='woo-next-cart-heading-el' scope='col'>Total</th>
                </tr>
              </thead>
              <tbody>
                { cart.cartItems.length && (cart.cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    updateCartProcessing={updateCartProcessing}
                    handleRemoveProductClick={handleRemoveProductClick}
                    updateCart={updateCart}
                  />
                )))}
              </tbody>
            </table>

            {/* Cart Total */ }
            <div className='row woo-next-cart-total-container border p-5 bg-gray-200'>
              <div className=''>
                {/* <h2 className="text-2xl">Cart Total</h2> */}
                <table className='table table-hover mb-5'>
                  <tbody>
                    <tr className='table-light flex flex-col'>
                      <td className='woo-next-cart-element-total text-2xl font-normal'>Subtotal</td>
                      <td className='woo-next-cart-element-amt text-2xl font-bold'>
                        {
                          cart.total
                        }
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Link href='/checkout'>
                  <button className='bg-purple-600 text-white px-5 py-3 rounded-sm w-auto xl:w-full'>
                    <span className='woo-next-cart-checkout-txt'>Proceed to Checkout</span>
                    <i className='fas fa-long-arrow-alt-right' />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Display Errors if any */}
          { requestError && (
            <div className='row woo-next-cart-total-container mt-5'>
              {' '}
              { requestError}
              {' '}
            </div>
          )}
        </div>
      ) : (
        <div className='container mx-auto my-32 px-4 xl:px-0'>
          <h2 className='text-2xl mb-5'>No items in the cart</h2>
          <Link href='/'>
            <button className='bg-purple-600 text-white px-5 py-3 rounded-sm'>
              <span className='woo-next-cart-checkout-txt'>Add New Products</span>
              <i className='fas fa-long-arrow-alt-right' />
            </button>
          </Link>
        </div>
      ) }
    </div>

  );
};

export default CartItemsContainer;
