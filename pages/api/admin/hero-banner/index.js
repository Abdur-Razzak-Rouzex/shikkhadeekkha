import nc from 'next-connect';
import {isAdmin, isAuth} from '../../../../utils/auth';
import HeroBanner from '../../../../models/HeroBanner';
import db from '../../../../utils/db';

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const heroBanners = await HeroBanner.find({});
    res.send(heroBanners);
});

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
    await db.connect();
    const newHeroBanner = new HeroBanner({
        imgUrl: req.body.imgUrl,
        link: req.body.link,
        altTitle: req.body.altTitle
    });

    const heroBanner = await newHeroBanner.save();
    res.send({message: 'Hero Banner Created', heroBanner});
});

export default handler;
