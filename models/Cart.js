import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        totalQuantity: {
            type: Number,
            default: 0,
            required: true
        },
        totalPrice: {
            type: Number,
            default: 0,
            required: true
        },
        status: {
            type: Number,
            default: 1,
            required: true
        },
    },
{
    timestamps: true,
}
)

const Cart = mongoose.models.Review || mongoose.model('Cart', cartSchema);
export default Cart