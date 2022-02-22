// /api/products/:id/reviews
import mongoose from 'mongoose';
import nextConnect from 'next-connect';
import {onError} from '../../../../utils/error';
import db from '../../../../utils/db';
import Product from '../../../../models/Product';
import {isAuth} from '../../../../utils/auth';
import Review from "../../../../models/Review";
import Course from "../../../../models/Course";

const handler = nextConnect({
    onError,
});

handler.get(async (req, res) => {
    db.connect();
    const review = await Review.find({product: req.query.id}).populate('user', 'name');
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
        const existReview = course.reviews.find((x) => x.user == req.user._id);
        if (existReview) {
            await Product.updateOne(
                {_id: req.query.id, 'reviews._id': existReview._id},
                {
                    $set: {
                        'reviews.$.comment': req.body.comment,
                        'reviews.$.rating': Number(req.body.rating),
                    },
                }
            );

            const updatedProduct = await Product.findById(req.query.id);
            updatedProduct.numReviews = updatedProduct.reviews.length;
            updatedProduct.rating =
                updatedProduct.reviews.reduce((a, c) => c.rating + a, 0) /
                updatedProduct.reviews.length;
            await updatedProduct.save();

            return res.send({message: 'Review updated'});
        } else {
            const review = {
                user: mongoose.Types.ObjectId(req.user._id),
                name: req.user.name,
                rating: Number(req.body.rating),
                comment: req.body.comment,
            };
            product.reviews.push(review);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((a, c) => c.rating + a, 0) /
                product.reviews.length;
            await product.save();
            res.status(201).send({
                message: 'Review submitted',
            });
        }
    } else {
        res.status(404).send({message: 'Product Not Found'});
    }
});

export default handler;
