import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
    {
        cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart',
            required: true
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        productUnitPrice: {
            type: Number,
            required: false
        },
        productQuantity: {
            type: Number,
            required: true
        },
        productTotalPrice: {
            type: Number,
            required: true
        },
    },
    {
        timestamps: true
    }
);

const CartItem = mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema);
export default CartItem;