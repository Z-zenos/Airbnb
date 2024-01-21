import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import axios from 'axios'; 

// Make sure to call 'loadStripe' outside of a component's render to avoid
// recreating the 'Stripe' object on every render
const stripePromise = loadStripe('pk_test_51OXKvCEpprKrC1LztwiszELyKt96XSuNpiugcRHLJHmAEJx2e8uN9D1JNTRCLZ7phVNZWqLox1JnkjJvEwiIDEGO009plMkgUs');

export default function Checkout({ 
  placeId, checkin, checkout, guests,
  hasMessage, hasPhone
}) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    (async () => {
      const config = {
        headers: {
          "Content-Type": "application/json"
        },
      };
      // Create a Checkout Session as soon as the page loads
      const res = await axios.post(
        `/bookings/checkout-session/${placeId}`, 
        {
          checkin: checkin.getTime(),
          checkout: checkout.getTime(),
          guests,
          hasMessage,
          hasPhone,
        }, 
        config
      );

      setClientSecret(res.data.clientSecret);
    })();
  }, []);

  const options = {clientSecret};

  return (
    <div id='checkout'>
      { clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={options}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  )
}