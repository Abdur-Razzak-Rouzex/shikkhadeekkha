import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
    {
        avatar: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
        },
        designation: {
            type: String
        },
        message: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.Testimonial || mongoose.model('Testimonial', testimonialSchema);
export default User;
