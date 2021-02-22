import React from 'react';

import CheckoutForm from 'components/checkout/CheckoutForm.tsx';
import Layout from 'components/Layout';
import client from 'components/ApolloClient';
import {GetStaticProps} from 'next';
import ProductMapper from 'src/mw/Mapper';
import GET_PAYMENT_METHODS from 'queries/get-payment-methods';
import { PaymentMethod } from 'src/mw/metadata/Metadata';

const Checkout = ({paymentMethods}: {paymentMethods: PaymentMethod[]}): JSX.Element => (
  <Layout>
    <div className='checkout container mx-auto my-32 px-4 xl:px-0'>
      <h1 className='mb-5 text-2xl uppercase'>Checkout Page</h1>
      <CheckoutForm paymentMethods={paymentMethods}/>
    </div>
  </Layout>
);

export default Checkout;

export const getStaticProps: GetStaticProps = async () => {
  const {data} = await client.query({
    query: GET_PAYMENT_METHODS,
  });

  const paymentMethods = data?.paymentGateways?.nodes || [];

  return {
    props: {
      paymentMethods,
    },
    revalidate: 1,
  };
};
