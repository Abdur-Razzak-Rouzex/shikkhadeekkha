import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            default: 0
        },
        comment: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review
