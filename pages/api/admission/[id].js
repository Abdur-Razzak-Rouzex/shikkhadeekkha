import nc from 'next-connect';
import {isAdmin, isAuth} from "../../../utils/auth";
import db from "../../../utils/db";
import AdmissionForm from "../../../models/AdmissionForm";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const faq = await AdmissionForm.findById(req?.query?.id);
    res.send(faq);
});

handler.use(isAuth, isAdmin);

handler.delete(async (req, res) => {
    await db.connect();
    const faq = await AdmissionForm.findById(req.query.id);
    if (faq) {
        await faq.remove();
        res.send({ message: 'FAQ Deleted Successfully' });
    } else {
        res.status(404).send({ message: 'FAQ Not Found' });
    }
});

export default handler;
