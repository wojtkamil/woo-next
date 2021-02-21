import 'styles/style.scss';
import 'styles/main.scss';

import NProgress from 'nprogress';
import React from 'react';

import {AppProps} from 'next/dist/next-server/lib/router/router';
import Router from 'next/router';

NProgress.configure({showSpinner: false});
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({Component, pageProps}: AppProps): JSX.Element {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} />;
}

export default MyApp;
