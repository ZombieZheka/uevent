// PaymentComponent.js

import React, { useState } from 'react';

const PaymentComponent = () => {
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleAdyenPayment = async () => {
        try {
            // Call your backend to initiate payment
            const response = await fetch('http://localhost:4000/api/paymentMethod', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 10, token: paymentMethod }),
            });
            // Make a payment request
            const result = await response.json();

            // Handle the payment result
            console.log(result);
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Error processing payment');
        }
    };

    return (
        <div>
            <button onClick={handleAdyenPayment}>Pay with Adyen</button>
        </div>
    );
};

export default PaymentComponent;
