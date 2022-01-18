import mongoose from "mongoose";

const heroBannerSchema = new mongoose.Schema({
        imgUrl: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const HeroBanner = mongoose.models.HeroBanner || mongoose.model('HeroBanner', heroBannerSchema);
export default HeroBanner;