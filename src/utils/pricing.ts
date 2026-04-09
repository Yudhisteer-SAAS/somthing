export const POSTER_UNIT_PRICE = 50;
export const THREE_POSTER_PRICE = 130;
export const FIVE_POSTER_PRICE = 200;

export const DELIVERY_CHARGE = 100;
export const FREE_DELIVERY_THRESHOLD = 200;

export const formatINR = (amount: number) => `₹${amount.toFixed(0)}`;

type Bundle = {
    size: number;
    price: number;
};

const BUNDLES: Bundle[] = [
    { size: 1, price: POSTER_UNIT_PRICE },
    { size: 3, price: THREE_POSTER_PRICE },
    { size: 5, price: FIVE_POSTER_PRICE },
];

const getBestDiscountedSubtotal = (quantity: number) => {
    if (quantity <= 0) {
        return 0;
    }

    const dp = Array.from(
        { length: quantity + 1 },
        () => Number.POSITIVE_INFINITY,
    );
    dp[0] = 0;

    for (let i = 1; i <= quantity; i += 1) {
        for (const bundle of BUNDLES) {
            if (i - bundle.size >= 0) {
                dp[i] = Math.min(dp[i], dp[i - bundle.size] + bundle.price);
            }
        }
    }

    return dp[quantity];
};

export const getPosterPricingBreakdown = (quantity: number) => {
    const safeQuantity = Math.max(0, Math.floor(quantity));
    const originalSubtotal = safeQuantity * POSTER_UNIT_PRICE;
    const discountedSubtotal = getBestDiscountedSubtotal(safeQuantity);
    const savings = Math.max(0, originalSubtotal - discountedSubtotal);

    // Delivery is free for order value ₹200 and above.
    // Threshold is evaluated on original order value so the 5-poster offer gets free delivery.
    const shippingCharge =
        originalSubtotal >= FREE_DELIVERY_THRESHOLD || safeQuantity === 0
            ? 0
            : DELIVERY_CHARGE;

    const total = discountedSubtotal + shippingCharge;

    return {
        quantity: safeQuantity,
        originalSubtotal,
        discountedSubtotal,
        savings,
        shippingCharge,
        total,
    };
};
