const stripe = require('stripe');
const { stripe: stripeConfig } = require('#app/config');

module.exports = stripe(stripeConfig.apiKey, { apiVersion: '' });