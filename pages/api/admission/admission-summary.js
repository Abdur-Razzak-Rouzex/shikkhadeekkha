import nc from 'next-connect';
import {isAuth, isAdmin} from '../../../utils/auth';
import db from '../../../utils/db';
import {onError} from '../../../utils/error';
import AdmissionForm from "../../../models/AdmissionForm";

const handler = nc({
    onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
    await db.connect();

    const ccap = await AdmissionForm.count({
        'otherInfo.selectedCourse': 'CCAP [Cadet College Admission Program]'
    });
    const seven = await AdmissionForm.count({
        'otherInfo.selectedCourse': 'Class Seven [Academic Program]'
    });
    const eight = await AdmissionForm.count({
        'otherInfo.selectedCourse': 'Class Eight [Academic Program]'
    });
    const nine = await AdmissionForm.count({
        'otherInfo.selectedCourse': 'Class Nine [Academic Program]'
    });
    const ten = await AdmissionForm.count({
        'otherInfo.selectedCourse': 'Class Ten [Academic Program]'
    });
    const ani = await AdmissionForm.count({
        'otherInfo.selectedCourse': 'ANI [SSC Examinee]'
    });
    const hsc1 = await AdmissionForm.count({
        'otherInfo.selectedCourse': 'HSC 01'
    });
    const hsc2 = await AdmissionForm.count({
        'otherInfo.selectedCourse': 'HSC 02'
    });

    res.send({ccap, seven, eight, nine, ten, ani, hsc1, hsc2});
});

export default handler;
