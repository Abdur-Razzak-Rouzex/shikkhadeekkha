import nc from 'next-connect';
import db from "../../../../utils/db";
import AdmissionForm from "../../../../models/AdmissionForm";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const admissionInfo = await AdmissionForm.find({
        "otherInfo.selectedCourse": req?.query?.courseName
    });
    res.send(admissionInfo);
});

export default handler;
