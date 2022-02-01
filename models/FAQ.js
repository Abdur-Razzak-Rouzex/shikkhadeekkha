import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema(
    {
        questions: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.FAQ || mongoose.model('FAQ', faqSchema);
export default User;
