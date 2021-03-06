import mongoose from "mongoose";

const whyChooseUsSchema = new mongoose.Schema({
        smallImage: {
            type: String,
            required: true
        },
        largeImage: {
            type: String,
            required: false
        },
        title: {
            type: String,
            required: true
        },
        shortDescription: {
            type: String,
            required: true,
        },
        isFlipBook: {
            type: Boolean,
            required: true,
        },
        flipBookLink: {
            type: String,
            required: false
        },
        contentBody: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const WhyChooseUs = mongoose.models.WhyChooseUs || mongoose.model('WhyChooseUs', whyChooseUsSchema);
export default WhyChooseUs;