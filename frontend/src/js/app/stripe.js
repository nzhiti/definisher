let stripeInstance = null;

export function get() {
    if (stripeInstance === null) {
        stripeInstance = Stripe(Definisher.STRIPE_KEY);
    }

    return stripeInstance;
}