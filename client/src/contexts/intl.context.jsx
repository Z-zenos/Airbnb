import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const IntlContext = createContext({});

// eslint-disable-next-line react/prop-types
export function IntlContextProvider({ children }) {
  const [currency, setCurrency] = useState({ 
    name: 'United State',
    code: 'USD',
    symbol: '$',
    previousCode: 'USD'
  });

  const [currencies, setCurrencies] = useState([]);

  function exchangeRate(number) {
    const curCrc = currencies.find(crc => crc.code === currency.code);
    return curCrc?.code ? Math.round(number * curCrc.rate) : number;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
    }).format(value);
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/resources/currencies');
        const filteredCurrencies = [];
        res.data.data.currencies.forEach(currency => {
          if(!filteredCurrencies.filter(c => c.name === currency.name).length)
            filteredCurrencies.push(currency);
        });
        setCurrencies([...filteredCurrencies.sort((a, b) => a.name > b.name)]);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <IntlContext.Provider value={{
      currency, setCurrency,
      currencies, exchangeRate,
      formatCurrency,
    }}>
      { children }
    </IntlContext.Provider>
  );
}