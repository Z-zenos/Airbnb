import { createContext, useState } from "react";

export const IntlContext = createContext({});

// eslint-disable-next-line react/prop-types
export function IntlContextProvider({ children }) {
  const [currency, setCurrency] = useState({ 
    name: 'United State',
    code: 'USD',
    symbol: '$'
  });

  return (
    <IntlContext.Provider value={{
      currency, setCurrency
    }}>
      { children }
    </IntlContext.Provider>
  );
}