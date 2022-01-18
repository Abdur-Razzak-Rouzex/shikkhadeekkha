import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import HeroBanner from '../../../../../models/HeroBanner';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.delete(async (req, res) => {
    await db.connect();
    const heroBanner = await HeroBanner.findById(req.query.id);
    if (heroBanner) {
        await heroBanner.remove();
        res.send({ message: 'Hero Banner Deleted Successfully' });
    } else {
        res.status(404).send({ message: 'Hero Banner Not Found' });
    }
});

export default handler;
