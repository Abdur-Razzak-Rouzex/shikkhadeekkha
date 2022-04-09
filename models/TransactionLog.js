import mongoose from "mongoose";

const TransactionLogSchema = new mongoose.Schema(
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
        },
        transactionStatus: {
            type: Number,
            default: 2,
            required: true
        },
        transactionSessionKey: {
            type: String,
            required: true
        },
        transactionResStatus: {
            type: String,
            required: true
        },
        transactionResFailedReason: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

const TransactionLog = mongoose.models.TransactionLog || mongoose.model('TransactionLog', TransactionLogSchema);
export default TransactionLog
