import {gql} from '@apollo/client';

const GET_CART = gql`
  query GET_CART {
    cart {
      contents {
        nodes {
          key
          product {
            node {
              id
              databaseId
              name
              description(format: RAW)
              type
              onSale
              slug
              averageRating
              image {
                id
                  sourceUrl
                  srcSet
                  altText
                  title       
              }
              galleryImages {
                nodes {
                  id
                  sourceUrl
                  srcSet
                  altText
                  title   
                }
              }
              ... on VariableProduct {
                price
              }
              ... on ExternalProduct {
                price
              }
              ... on SimpleProduct {
                price
              }
              ... on GroupProduct {
                price
              }
            }
          }
          quantity
          total
        }
        productCount
      }
      subtotal
      total
      shippingTotal
      needsShippingAddress
      discountTotal
    }
  }
`;

export default GET_CART;
