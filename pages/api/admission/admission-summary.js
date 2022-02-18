import nc from 'next-connect';
import {isAdmin, isAuth} from '../../../utils/auth';
import db from '../../../utils/db';
import {onError} from '../../../utils/error';
import AdmissionForm from "../../../models/AdmissionForm";
import Course from "../../../models/Course";

const handler = nc({
    onError,
});

handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
    await db.connect();

    const availableCourseNames = await Course.find({}).select('name');

    let numberOfAdmissionPerCourse = [];

    for (let courseName of availableCourseNames) {
        let admissionInThisCourse = {
            courseName: courseName.name,
            numOfAdmission: await AdmissionForm.count({
                'otherInfo.selectedCourse': courseName.name
            })
        };
        numberOfAdmissionPerCourse.push(admissionInThisCourse);
    }
    res.send(numberOfAdmissionPerCourse);
});

export default handler;
