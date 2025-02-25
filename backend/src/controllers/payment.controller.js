// import Stripe from 'stripe';
// import { generateTicket } from '../utils/generateTicket.js';  // Added .js extension
// import { sendEmail } from '../utils/emailutils.js';  // Added .js extension
// import Event from '../models/event.model.js';  // Added .js extension
// import User from '../models/user.model.js';  // Added .js extension

// const stripeClient = Stripe(process.env.STRIPE_SECRET_KEY);

// // Create Stripe checkout session for event purchase
// export const createCheckoutSession = async (req, res) => {
//   console.log('Received create-checkout-session request');
//   try {
//     const { eventId, userId, quantity } = req.body;

//     // Retrieve the event and user from the database
//     const event = await Event.findById(eventId);  
//     const user = await User.findById(userId);    

//     if (!event || !user) {
//       return res.status(404).json({ error: 'Event or user not found' });
//     }

//     const session = await stripeClient.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [{
//         price_data: {
//           currency: 'inr',
//           product_data: {
//             name: event.name,
//           },
//           unit_amount: event.price * 100, // Convert to paise
//         },
//         quantity: quantity,
//       }],
//       mode: 'payment',
//       success_url: `${process.env.BASE_URL}/api/complete?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.BASE_URL}/api/cancel`,
//       metadata: {
//         event_id: event.id,
//         user_id: user.id,
//         quantity,
//       },
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     console.error('Error creating checkout session:', err);
//     res.status(500).json({ error: 'An error occurred while creating the checkout session' });
//   }
// };

// export const paymentSuccess = async (req, res) => {
//   console.log('Payment successful!');
//   try {
//     const sessionId = req.query.session_id;
//     const session = await stripeClient.checkout.sessions.retrieve(sessionId);
//     const { metadata } = session;

//     const event = await Event.findById(metadata.event_id);
//     const user = await User.findById(metadata.user_id);

//     if (!event || !user) {
//       return res.status(404).json({ error: 'Event or user not found' });
//     }

//     // Generate ticket and send confirmation email
//     const ticket = generateTicket(event, user);
//     await sendEmail(user.email, 'Your Event Ticket', ticket);

//     res.send('Payment successful. Ticket has been emailed to you!');
//   } catch (err) {
//     console.error('Error handling payment success:', err);
//     res.status(500).json({ error: 'An error occurred while processing payment success' });
//   }
// };

// export const paymentCancel = (req, res) => {
//   console.log('Payment cancelled!');
//   res.redirect('/');
// };
