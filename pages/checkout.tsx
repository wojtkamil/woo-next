import React from 'react';

import CheckoutForm from 'components/checkout/CheckoutForm.tsx';
import Layout from 'components/Layout';

const Checkout = (): JSX.Element => (
  <Layout>
    <div className='checkout container mx-auto my-32 px-4 xl:px-0'>
      <h1 className='mb-5 text-2xl uppercase'>Checkout Page</h1>
      <CheckoutForm />
    </div>
  </Layout>
);

export default Checkout;
