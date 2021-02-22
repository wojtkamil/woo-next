import React from 'react';

import {PaymentMethod} from 'src/mw/metadata/Metadata';

import Error from './Error';

const PaymentModes = (
  {input, handleOnChange, paymentMethods}
    : { input: any, handleOnChange: any, paymentMethods: PaymentMethod[] },
): JSX.Element => (
  <div className='mt-3'>
    <Error errors={input.errors} fieldName='paymentMethod' />
    {paymentMethods.length && (paymentMethods.map((item) => (
      <div key={item.id} className='form-check woo-next-payment-input-container mt-2'>
        <label className='form-check-label'>
          <input onChange={handleOnChange} value={item.id} className='form-check-input mr-3' name='paymentMethod' type='radio' />
          <span className='woo-next-payment-content'>{item.title}</span>
        </label>
      </div>
    )))}
  </div>
);

export default PaymentModes;
