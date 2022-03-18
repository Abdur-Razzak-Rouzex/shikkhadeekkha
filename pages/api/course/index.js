import nc from 'next-connect';
import {isAdmin, isAuth} from '../../../utils/auth';
import db from '../../../utils/db';
import Course from "../../../models/Course";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const courses = await Course.find({});
    res.send(courses);
});

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
    await db.connect();
    const course = await Course.findOne({slug: req?.body?.slug});
    if (course?.slug !== req?.body?.slug) {
        const newCourse = new Course({
            name: req.body.name,
            type: req.body.type,
            slug: req.body.slug,
            category: req.body.category,
            subCategory: req.body.subCategory,
            image: req.body.image,
            price: req.body.price,
            brand: req.body.brand,
            languageMedium: req.body.languageMedium,
            offerInPercentage: req.body.offerInPercentage,
            isFeatured: req.body.isFeatured,
            isOffered: req.body.isOffered,
            docStatus: req.body.docStatus,
            description: req.body.description,
        });
        const course = await newCourse.save();
        res.send({message: 'Course Created Successfully', course});
    } else {
        res.status(409).send({message: `A Course with slug "${ req.body.slug}" already exists`});
    }
});

export default handler;
