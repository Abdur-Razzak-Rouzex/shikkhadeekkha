import nc from 'next-connect';
import db from "../../../utils/db";
import Testimonial from "../../../models/Testimonial";
import {isAdmin, isAuth} from "../../../utils/auth";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const allTestimonials = await Testimonial.find({});

    res.send(allTestimonials);
});

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
    await db.connect();
    const newTestimonial = new Testimonial({
        avatar: req?.body?.avatar,
        name: req?.body?.name,
        designation: req?.body?.designation,
        message: req?.body?.message,
    });

    const testimonial = await newTestimonial.save();
    res.send({message: 'Testimonial Created Successfully', testimonial});
});

export default handler;
