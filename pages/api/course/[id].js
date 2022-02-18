import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../utils/auth';
import db from '../../../utils/db';
import Course from "../../../models/Course";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const product = await Course.findById(req.query.id);
    res.send(product);
});

handler.use(isAuth, isAdmin);

handler.put(async (req, res) => {
    await db.connect();
    const course = await Course.findById(req.query.id);
    if (course) {
        course.name = req.body.name;
        course.slug = req.body.slug;
        course.category = req.body.category;
        course.subCategory = req.body.subCategory;
        course.image = req.body.image;
        course.price = req.body.price;
        course.languageMedium = req.body.languageMedium;
        course.offerInPercentage = req.body.offerInPercentage;
        course.isFeatured = req.body.isFeatured;
        course.isOffered = req.body.isOffered;
        course.docStatus = req.body.docStatus;
        course.description = req.body.description;
        await course.save();
        res.send({ message: 'Course Updated Successfully' });
    } else {
        res.status(404).send({ message: 'Course Not Found' });
    }
});

handler.delete(async (req, res) => {
    await db.connect();
    const course = await Course.findById(req.query.id);
    if (course) {
        await course.remove();
        res.send({ message: 'Course Deleted' });
    } else {
        res.status(404).send({ message: 'Course Not Found' });
    }
});

export default handler;
