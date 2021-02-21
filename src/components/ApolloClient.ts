import fetch from 'node-fetch';

import {
  ApolloClient, ApolloLink, InMemoryCache, createHttpLink,
} from '@apollo/client';

/**
 * Middleware operation
 * If we have a session token in localStorage, add it to the GraphQL request as a Session header.
 */
export const middleware = new ApolloLink((operation, forward) => {
  /**
   * If session data exist in local storage, set value as session header.
   * Here we also delete the session if it is older than 24 hours
   */
  const session = process.browser ? localStorage.getItem('woo-session') : null;
  const sessionAge = process.browser
    ? localStorage.getItem('woo-session-expiry')
    : null;
  const todaysDate = new Date();
  const oneDay = 60 * 60 * 24 * 1000;
  const olderThan24h = +new Date(todaysDate) - +new Date(sessionAge) > oneDay;

  if (olderThan24h && process.browser) {
    localStorage.removeItem('woo-session');
    localStorage.removeItem('woo-session-expiry');
  }
  if (session) {
    operation.setContext(({headers = {}}) => ({
      headers: {
        'woocommerce-session': `Session ${session}`,
      },
    }));
  }
  return forward(operation);
});

/**
 * Afterware operation.
 *
 * This catches the incoming session token and stores it in localStorage,
 * for future GraphQL requests.
 */
export const afterware = new ApolloLink((operation, forward) => forward(operation).map(
  (response) => {
  /**
     * Check for session header and update session in local storage accordingly.
     */
    const context = operation.getContext();
    const {
      response: {headers},
    } = context;

    const session = headers.get('woocommerce-session');

    if (session && process.browser) {
    // Remove session data if session destroyed.
      if (session === 'false') {
        localStorage.removeItem('woo-session');

      // Update session new data if changed.
      } else if (localStorage.getItem('woo-session') !== session) {
        localStorage.setItem('woo-session', headers.get('woocommerce-session'));
        localStorage.setItem('woo-session-expiry', `${new Date()}`);
      }
    }
    return response;
  },
));

// Apollo GraphQL client.
const client = new ApolloClient({
  link: middleware.concat(afterware.concat(createHttpLink({
    uri: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/graphql`,
    fetch,
  }))),
  cache: new InMemoryCache(),
});

export default client;
