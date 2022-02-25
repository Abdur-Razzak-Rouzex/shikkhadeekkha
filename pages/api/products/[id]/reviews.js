// /api/products/:id/reviews
import mongoose from 'mongoose';
import nextConnect from 'next-connect';
import {onError} from '../../../../utils/error';
import db from '../../../../utils/db';
import {isAuth} from '../../../../utils/auth';
import Review from "../../../../models/Review";
import Course from "../../../../models/Course";
import User from "../../../../models/User";

const handler = nextConnect({
    onError,
});

handler.get(async (req, res) => {
    await db.connect();
    const review = await Review.find({product: req.query.id}).populate('user', 'name', User);
    if (review) {
        res.send(review);
    } else {
        res.status(404).send({message: 'Course not found'});
    }
});

handler.use(isAuth).post(async (req, res) => {
    await db.connect();
    const course = await Course.findById(req.query.id);
    if (course) {
        const newReview = new Review({
            product: mongoose.Types.ObjectId(req?.query?.id),
            user: mongoose.Types.ObjectId(req.user._id),
            rating: Number(req.body.rating),
            comment: req.body.comment,
        });
        await newReview.save();

        const reviews = await Review.find({product: req?.query?.id});
        course.numOfReviews = reviews.length;
        course.rating = reviews.reduce((a, c) => c.rating + a, 0) / (reviews.length);
        await course.save();

        res.status(201).send({
            message: 'Review submitted',
        });
    } else {
        res.status(404).send({message: 'Product Not Found'});
    }
});

export default handler;
