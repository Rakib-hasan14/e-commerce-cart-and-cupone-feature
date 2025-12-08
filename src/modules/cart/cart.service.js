const { Cart, CartItem, Product, Coupon, CouponUsage } = require('src/modules/entities');
const { sequelize } = require('src/utils/database/database-setup');
const { AppError } = require('src/utils/AppError');
const cartHelper = require('src/modules/cart/cart.helper');
const couponService = require('src/modules/coupon/coupon.service');

const getCart = async (userId) => {
    let cart = await Cart.findOne({
        where: { user_id: userId, status: 'active' },
        include: [
            {
                model: CartItem,
                as: 'items',
                include: [{ model: Product, as: 'product' }]
            },
            { model: Coupon, as: 'coupon' }
        ],
    });

    if (!cart) {
        return null;
    }

    const subtotal = cartHelper.calculateSubtotal(cart.items);

    let coupon = cart.coupon;
    let discount = 0;

    if (coupon) {
        try {
            await couponService.validateCoupon(coupon, { subtotal, items: cart.items, user_id: userId });
            discount = cartHelper.calculateDiscount(subtotal, coupon);
        } catch (error) {
            await cart.setCoupon(null);
            coupon = null;
            discount = 0;
        }
    }

    if (!coupon) {
        const autoCoupon = await couponService.findBestAutoCoupon({ subtotal, items: cart.items, user_id: userId });
        if (autoCoupon) {
            await cart.setCoupon(autoCoupon);
            coupon = autoCoupon;
            discount = cartHelper.calculateDiscount(subtotal, coupon);
        }
    }

    const total = cartHelper.calculateTotal(subtotal, discount);

    return {
        cartId: cart.id,
        items: cart.items,
        coupon,
        summary: {
            subtotal,
            discount,
            total,
        }
    };
};

const createCart = async (userId) => {
    return await Cart.create({ user_id: userId });
};

const addItem = async (userId, productId, quantity) => {
    let cart = await Cart.findOne({ where: { user_id: userId, status: 'active' } });
    if (!cart) {
        cart = await createCart(userId);
    }

    const product = await Product.findByPk(productId);
    if (!product) throw new AppError('Product not found', 404);
    if (product.stock < quantity) throw new AppError('Insufficient stock', 400);

    let cartItem = await CartItem.findOne({ where: { cart_id: cart.id, product_id: productId } });

    if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
    } else {
        await CartItem.create({
            cart_id: cart.id,
            product_id: productId,
            quantity,
            price: product.price,
        });
    }

    return await getCart(userId);
};

const updateItem = async (userId, itemId, quantity) => {
    const cartItem = await CartItem.findByPk(itemId);
    if (!cartItem) throw new AppError('Item not found', 404);

    const cart = await Cart.findByPk(cartItem.cart_id);
    if (cart.user_id !== userId) throw new AppError('Unauthorized', 403);

    if (quantity <= 0) {
        await cartItem.destroy();
    } else {
        cartItem.quantity = quantity;
        await cartItem.save();
    }

    return await getCart(userId);
};

const removeItem = async (userId, itemId) => {
    const cartItem = await CartItem.findByPk(itemId);
    if (!cartItem) throw new AppError('Item not found', 404);

    const cart = await Cart.findByPk(cartItem.cart_id);
    if (cart.user_id !== userId) throw new AppError('Unauthorized', 403);

    await cartItem.destroy();

    return await getCart(userId);
};

const applyCoupon = async (userId, code) => {
    const cart = await Cart.findOne({ where: { user_id: userId, status: 'active' }, include: ['items'] });
    if (!cart) throw new AppError('Cart not found', 404);

    const coupon = await couponService.getCouponByCode(code);
    if (!coupon) throw new AppError('Invalid coupon code', 404);

    const subtotal = cartHelper.calculateSubtotal(cart.items);
    await couponService.validateCoupon(coupon, { subtotal, items: cart.items, user_id: userId });

    await cart.setCoupon(coupon);

    return await getCart(userId);
};

const removeCoupon = async (userId) => {
    const cart = await Cart.findOne({ where: { user_id: userId, status: 'active' } });
    if (!cart) throw new AppError('Cart not found', 404);

    await cart.setCoupon(null);
    return await getCart(userId);
};

const checkout = async (userId) => {
    const t = await sequelize.transaction();

    try {
        const cart = await Cart.findOne({
            where: { user_id: userId, status: 'active' },
            include: ['items'],
            transaction: t
        });

        if (!cart) throw new AppError('Cart not found', 404);
        if (cart.items.length === 0) throw new AppError('Cart is empty', 400);

        if (cart.coupon_id) {
            const coupon = await Coupon.findByPk(cart.coupon_id, {
                lock: t.LOCK.UPDATE,
                transaction: t
            });

            if (!coupon) throw new AppError('Applied coupon no longer exists', 400);

            const now = new Date();
            if (now > coupon.expiry_date) throw new AppError('Coupon has expired', 400);
            if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
                throw new AppError('Coupon usage limit reached', 400);
            }

            coupon.usage_count += 1;
            await coupon.save({ transaction: t });

            await CouponUsage.create({
                coupon_id: coupon.id,
                user_id: userId,
                order_id: null
            }, { transaction: t });
        }

        cart.status = 'completed';
        await cart.save({ transaction: t });

        await t.commit();
        return { message: 'Checkout successful', cartId: cart.id };

    } catch (error) {
        await t.rollback();
        throw error;
    }
};

module.exports = {
    getCart,
    addItem,
    updateItem,
    removeItem,
    applyCoupon,
    removeCoupon,
    checkout,
};
