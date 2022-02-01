import nc from 'next-connect';
import db from "../../../utils/db";
import {isAdmin, isAuth} from "../../../utils/auth";
import FAQ from "../../../models/FAQ";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const allFaq = await FAQ.find({});

    res.send(allFaq);
});

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
    await db.connect();
    const newFAQ = new FAQ({
        question: req?.body?.question,
        answer: req?.body?.answer,
    });

    const faq = await newFAQ.save();
    res.send({message: 'FAQ Created Successfully', faq});
});

export default handler;
