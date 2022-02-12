import mongoose from 'mongoose';
import {reviewSchema} from "./Product";

const CourseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        category: {
            type: String,
            required: true
        },
        subCategory: {
            type: String,
        },
        image: {
            type: String,
            required: true
        },
        courseFee: {
            type: Number,
            required: true
        },
        languageMedium: {
            type: String,
            required: true,
            default: 'Bangla'
        },
        offerInPercentage: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            required: true,
            default: 0
        },
        numOfReviews: {
            type: Number,
            required: true,
            default: 0
        },
        description: {
            type: String,
            required: true
        },
        reviews: [reviewSchema],
        isFeatured: {
            type: Boolean,
            required: true,
            default: false
        },
        isOffered: {
            type: Boolean,
            required: true,
            default: false
        },
        docStatus: {
            type: String,
            required: true,
            default: 'active'
        }
    },
    {
        timestamps: true,
    }
);

const Course =
    mongoose.models.Course || mongoose.model('Course', CourseSchema);
export default Course;
