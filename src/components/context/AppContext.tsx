import React, {useState, useEffect} from 'react';

export const AppContext = React.createContext(null);

export const AppProvider = ({children}: {children: React.ReactNode}): JSX.Element => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    // @TODO Will add option to show the cart with localStorage later.
    if (process.browser) {
      let cartData = localStorage.getItem('woo-next-cart');
      cartData = cartData !== null ? JSON.parse(cartData) : '';
      setCart(cartData);
    }
  }, []);

  return (
    <AppContext.Provider value={[cart, setCart]}>
      { children }
    </AppContext.Provider>
  );
};
