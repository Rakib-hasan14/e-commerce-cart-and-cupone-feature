const calculateSubtotal = (items) => {
    return items.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0);
};

const calculateDiscount = (subtotal, coupon) => {
    if (!coupon) return 0;

    let discount = 0;
    if (coupon.discount_type === 'fixed') {
        discount = parseFloat(coupon.discount_value);
    } else if (coupon.discount_type === 'percentage') {
        discount = subtotal * (parseFloat(coupon.discount_value) / 100);

        // Apply max discount cap if it exists
        if (coupon.max_discount_amount) {
            discount = Math.min(discount, parseFloat(coupon.max_discount_amount));
        }
    }

    // Ensure discount doesn't exceed subtotal
    return Math.min(discount, subtotal);
};

const calculateTotal = (subtotal, discount) => {
    return Math.max(0, subtotal - discount);
};

module.exports = {
    calculateSubtotal,
    calculateDiscount,
    calculateTotal,
};
