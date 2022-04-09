import mongoose from "mongoose";

const TransactionHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        tranId: {
            type: String,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0
        },
        productName: {
            type: String,
            required: true
        },
        cusName: {
            type: String,
            required: true
        },
        cusEmail: {
            type: String,
            required: false
        },
        cusPhone: {
            type: String,
            required: true
        },
        numOfItem: {
            type: Number,
            required: true
        },
        productType: {
            type: String,
            default: 'course',
            required: true
        }
    },
    {
        timestamps: true,
    }
);

const TransactionHistory = mongoose.models.TransactionHistory || mongoose.model('TransactionHistory', TransactionHistorySchema);
export default TransactionHistory
