
import { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { ModalContext } from "../../contexts/modal.context";
import axios from "axios";
import Input from "../Input/Input";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { IntlContext } from "../../contexts/intl.context";

export default function IntlModal () {
  const { isIntlModalOpen, setIsIntlModalOpen } = useContext(ModalContext);
  const [currencies, setCurrencies] = useState([]);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setCurrency } = useContext(IntlContext);

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


  function handleSelectCurrency(currency) {
    if(searchParams.get('currency')) {
      searchParams.set('currency', currency.code);
      setSearchParams(searchParams);
    }
    else {
      navigate(`${location.pathname}${location.search || ''}${location.search ? '&' : '?'}currency=${currency.code}`);
    }
    setCurrency(() => currency);
    setIsIntlModalOpen(false);
  }

  const [currencyInput, setCurrencyInput] = useState('');
  const searchCurrencies = currencies.length > 0 ? currencies.filter(currency => currency.name.includes(currencyInput)) : [];

  const bodyContent = (
    <div>
      <div className="px-8 mb-3">
        <Input 
          label="Currency" 
          className="rounded-lg" 
          value={currencyInput} 
          onChange={(ev => setCurrencyInput(ev.target.value))}  
        />
      </div>
      <div className="w-full px-12 md:px-6 m-auto h-[500px] grid grid-cols-4 gap-2 overflow-y-scroll cursor-pointer">
        { currencies.length > 0 && searchCurrencies.map((currency, i) => currency.symbol && (
          <div 
            key={currency.code + i} 
            className={`py-2 px-3 hover:bg-gray-200 rounded-xl text-[15px] font-light max-h-[120px] ${currency.code === searchParams.get('currency') && 'border border-gray-primary bg-gray-100'}`}
            onClick={() => handleSelectCurrency(currency)}
          >
            <p>{currency.name}</p>
            <p className="opacity-60">{currency.code} - {currency.symbol}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isIntlModalOpen} 
      onClose={() => setIsIntlModalOpen(false)} 
      onSubmit={() => setIsIntlModalOpen(false)}
      title="International"
      body={bodyContent}
    />
  );
}