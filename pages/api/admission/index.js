import nc from 'next-connect';
import {isAuth} from '../../../utils/auth';
import db from '../../../utils/db';
import {onError} from '../../../utils/error';
import AdmissionForm from "../../../models/AdmissionForm";

const handler = nc({
    onError,
});

handler.use(isAuth);

handler.post(async (req, res) => {
    await db.connect();

    const studentInfo = req?.body?.studentInfo;
    const parentsInfo = req?.body?.parentsInfo;
    const academicGuardianInfo = req?.body?.academicGuardianInfo;
    const otherInfo = req?.body?.otherInfo;
    const newAdmission = new AdmissionForm({
        studentInfo: studentInfo,
        parentsInfo: parentsInfo,
        academicGuardianInfo: academicGuardianInfo,
        otherInfo: otherInfo,
        user: req.user._id,
    });
    const admission = await newAdmission.save();
    res.status(201).send(admission);
});

export default handler;
