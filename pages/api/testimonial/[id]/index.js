import nc from 'next-connect';
import Testimonial from "../../../../models/Testimonial";
import {isAdmin, isAuth} from "../../../../utils/auth";
import db from "../../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const testimonial = await Testimonial.findById(req?.query?.id);
    res.send(testimonial);
});

handler.use(isAuth, isAdmin);

handler.put(async (req, res) => {
    await db.connect();
    const testimonial = await Testimonial.findById(req?.query?.id);
    if (testimonial) {
        testimonial.avatar = req?.body?.avatar;
        testimonial.name = req?.body?.name;
        testimonial.designation = req?.body?.designation;
        testimonial.message = req?.body?.message;

        await Testimonial.save();
        res.send({ message: 'Testimonial updated successfully' });
    } else {
        res.status(404).send({ message: 'Testimonial Not Found' });
    }
});

handler.delete(async (req, res) => {
    await db.connect();
    const testimonial = await Testimonial.findById(req.query.id);
    if (testimonial) {
        await testimonial.remove();
        res.send({ message: 'Testimonial Deleted Successfully' });
    } else {
        res.status(404).send({ message: 'Testimonial Not Found' });
    }
});

export default handler;
