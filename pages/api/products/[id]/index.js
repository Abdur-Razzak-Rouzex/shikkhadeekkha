import nc from 'next-connect';
import db from '../../../../utils/db';
import Course from "../../../../models/Course";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const course = await Course.findById(req.query.id);
    if (course) {
        res.send(course);
    } else {
        res.status(404).send({message: 'Course not found'});
    }
});

export default handler;
