import 'styles/style.scss';
import 'styles/main.scss';

import React from 'react';
import Router from 'next/router';
import NProgress from 'nprogress';
import { AppProps } from 'next/dist/next-server/lib/router/router';

NProgress.configure({ showSpinner: false });
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
