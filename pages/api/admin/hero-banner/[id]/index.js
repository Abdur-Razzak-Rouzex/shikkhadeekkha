import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import HeroBanner from '../../../../../models/HeroBanner';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
    await db.connect();
    const heroBanner = await HeroBanner.findById(req.query.id);
    res.send(heroBanner);
});

handler.put(async (req, res) => {
    await db.connect();
    const banner = await HeroBanner.findById(req.query.id);
    if (banner) {
        banner.imgUrl = req.body.imgUrl;
        banner.link = req.body.link;
        banner.altTitle = req.body.altTitle;

        await banner.save();
        res.send({ message: 'Hero Banner Updated Successfully' });
    } else {
        res.status(404).send({ message: 'Hero Banner Not Found' });
    }
});

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
