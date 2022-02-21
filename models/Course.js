import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: 'course',
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        subCategory: {
            type: String,
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        brand: {
            type: String,
            default: 'general'
        },
        countInStock: {
            type: Number,
            default: 0
        },
        languageMedium: {
            type: String,
            default: 'Bangla'
        },
        offerInPercentage: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0
        },
        numOfReviews: {
            type: Number,
            default: 0
        },
        description: {
            type: String,
            required: true
        },
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
            type: Boolean,
            required: true,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

const Course =
    mongoose.models.Course || mongoose.model('Course', CourseSchema);
export default Course;
