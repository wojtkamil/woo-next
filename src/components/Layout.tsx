import React from 'react';
import Head from 'next/head';
import Header from 'components/Header';
import Router from 'next/router';
import NProgress from 'nprogress';
import Footer from 'components/Footer';
import {AppProvider} from './context/AppContext';
import client from './ApolloClient';
import {ApolloProvider} from '@apollo/client';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const Layout = ({ children }) => (
  <AppProvider>
    <ApolloProvider client={client}>
      <div>
        <Head>
          <title>Woocommerce React Theme</title>
        </Head>
        <Header />
        {children}
        <Footer />
      </div>
    </ApolloProvider>
  </AppProvider>
);

export default Layout;
