import nc from 'next-connect';
import WhyChooseUs from "../../../../models/WhyChooseUs";
import {isAdmin, isAuth} from "../../../../utils/auth";
import db from "../../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const whyChooseUs = await WhyChooseUs.findById(req.query.id);
    res.send(whyChooseUs);
});

handler.use(isAuth, isAdmin);

handler.put(async (req, res) => {
    await db.connect();
    const whyChooseUs = await WhyChooseUs.findById(req.query.id);
    if (whyChooseUs) {
        whyChooseUs.image = req.body.image;
        whyChooseUs.title = req.body.title;
        whyChooseUs.shortDescription = req.body.shortDescription;
        whyChooseUs.isFlipBook = req.body.isFlipBook;
        whyChooseUs.flipBookLink = req.body.flipBookLink;
        whyChooseUs.contentBody = req.body.contentBody;

        await whyChooseUs.save();
        res.send({ message: 'Why choose us: updated successfully' });
    } else {
        res.status(404).send({ message: 'Why choose us: Not Found' });
    }
});

handler.delete(async (req, res) => {
    await db.connect();
    const whyChooseUs = await WhyChooseUs.findById(req.query.id);
    if (whyChooseUs) {
        await whyChooseUs.remove();
        res.send({ message: 'Why choose us: Deleted Successfully' });
    } else {
        res.status(404).send({ message: 'Why choose us: Not Found' });
    }
});

export default handler;
