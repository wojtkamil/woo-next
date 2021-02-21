import {gql} from '@apollo/client';

const ADD_TO_CART = gql`
  mutation ($input: AddToCartInput!) {
    addToCart(input: $input) {
      cartItem {
        key
        product {
          node {
            id
            name
            description
            type
            onSale
            slug
            averageRating
            reviewCount
            image {
              id
              sourceUrl
              altText      
            }
            galleryImages {
              nodes {
                id
                sourceUrl
                altText
              }
            }
          }
        }
        quantity
        total
        subtotal
        subtotalTax
      }
    }
  }
`;

export default ADD_TO_CART;
