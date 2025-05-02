// // app/api/checkout/route.ts

// import { NextResponse } from 'next/server';
// import Stripe from 'stripe';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(req: Request) {
//     const body = await req.json();

//     const { switch1, switch2, switch3, switch4, qty } = body;

//     let lineItems = [];

//     if (switch1) {
//         lineItems.push({ price: "price_1RIuJ0GatrULTQpyBGvc5qzK", quantity: qty });
//     }
//     if (switch2) {
//         lineItems.push({ price: "price_1RIsc9GatrULTQpyFbOhpEBD", quantity: qty });
//     }
//     if (switch3) {
//         lineItems.push({ price: "price_1RIsndGatrULTQpyTwX8SP0u", quantity: qty });
//     }
//     if (switch4) {
//         lineItems.push({ price: "price_1RIs8eGatrULTQpy4zC9yf0j", quantity: qty });
//     }

//     if (lineItems.length === 0) {
//         return NextResponse.json({ error: 'No products selected' }, { status: 400 });
//     }

//     const session = await stripe.checkout.sessions.create({
//         mode: 'subscription',
//         payment_method_types: ['card'],
//         line_items: lineItems,
//         success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
//         cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
//     });

//     return NextResponse.json({ url: session.url });
// }
