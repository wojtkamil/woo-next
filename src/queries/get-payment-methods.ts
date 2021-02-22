import {gql} from '@apollo/client';

const GET_PAYMENT_METHODS = gql`
  query GET_PAYMENT_METHODS {
    paymentGateways {
      nodes {
        description
        icon
        id
        title
      }
    }
  }
`;

export default GET_PAYMENT_METHODS;
