import nc from 'next-connect';
import {isAdmin, isAuth} from "../../../../utils/auth";
import db from "../../../../utils/db";
import FAQ from "../../../../models/FAQ";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const faq = await FAQ.findById(req?.query?.id);
    res.send(faq);
});

handler.use(isAuth, isAdmin);

handler.put(async (req, res) => {
    await db.connect();
    const faq = await FAQ.findById(req?.query?.id);
    if (faq) {
        faq.questions = req?.body?.questions;
        faq.answer = req?.body?.answer;

        await faq.save();
        res.send({ message: 'FAQ updated successfully' });
    } else {
        res.status(404).send({ message: 'FAQ Not Found' });
    }
});

handler.delete(async (req, res) => {
    await db.connect();
    const faq = await FAQ.findById(req.query.id);
    if (faq) {
        await faq.remove();
        res.send({ message: 'FAQ Deleted Successfully' });
    } else {
        res.status(404).send({ message: 'FAQ Not Found' });
    }
});

export default handler;
