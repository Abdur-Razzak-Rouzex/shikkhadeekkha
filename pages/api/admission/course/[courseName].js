import nc from 'next-connect';
import db from "../../../../utils/db";
import AdmissionForm from "../../../../models/AdmissionForm";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const faq = await AdmissionForm.find({
        otherInfo: {
            selectedCourse: req?.query?.courseName
        }
    });
    res.send(faq);
});

export default handler;
