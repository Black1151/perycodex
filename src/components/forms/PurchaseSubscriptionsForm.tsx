'use client';

import Stripe from 'stripe';
import {SubmitHandler, useForm} from "react-hook-form";

export type PaymentFormInputs = {
    switch1: boolean;
    switch2: boolean;
    switch3: boolean;
    switch4: boolean;
    qty: number;
};

export default function PurchaseSubscriptionsForm() {

    const stripe = new Stripe('sk_test_51RH2KNGatrULTQpyFzTvLK1NXZnPNKRr8b1MdMOdM6DDpyFBkJXTiuhuiMdt48FCDhr892IP0csM1X4bzf8Wl4aT00XQ9VcB3Q');

    const { handleSubmit, register, formState: { errors: formErrors } } = useForm<PaymentFormInputs>();


    const handlePaymentSubmit: SubmitHandler<PaymentFormInputs> = async (paymentFormData) => {
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentFormData),
            });

            if (!res.ok) {
                throw new Error('Checkout session creation failed');
            }

            const { url } = await res.json();
            window.location.href = url;
        } catch (error) {
            console.error('Checkout failed:', error);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(handlePaymentSubmit)}
            className="p-4 border rounded max-w-md mx-auto"
        >
            <div className="flex flex-col space-y-4">
                <label>
                    How many users?:
                    <input
                        type="number"
                        {...register("qty", { required: true })}
                        className="ml-2 p-1 border"
                    />
                </label>
                <br />
                <label>
                    <input
                        type="checkbox"
                        {...register("switch1")}
                    />
                    Client NPS
                </label>
                <br/>
                <label>
                    <input
                        type="checkbox"
                        {...register("switch2")}
                    />
                    Recognition Hub
                </label>
                <br/>
                <label>
                    <input
                        type="checkbox"
                        {...register("switch3")}
                    />
                    Client Satisfaction
                </label>
                <br/>
                <label>
                    <input
                        type="checkbox"
                        {...register("switch4")}
                    />
                    Happiness Score
                </label>
                <br/>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Submit
                </button>
            </div>
        </form>
    );
}
