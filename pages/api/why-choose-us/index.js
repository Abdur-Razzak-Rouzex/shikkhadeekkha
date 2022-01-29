import nc from 'next-connect';
import db from "../../../utils/db";
import WhyChooseUs from "../../../models/WhyChooseUs";
import {isAdmin, isAuth} from "../../../utils/auth";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    let allWhyChooseUs;
    if(req.params?.from === 'client') {
        allWhyChooseUs = await WhyChooseUs.find({}).limit(3);
        console.log('call was in client');
    }else {
        allWhyChooseUs = await WhyChooseUs.find({});
    }
    res.send(allWhyChooseUs);
});

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
    await db.connect();
    const newHeroBanner = new WhyChooseUs({
        smallImage: req.body.smallImage,
        largeImage: req.body.largeImage,
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        isFlipBook: req.body.isFlipBook,
        flipBookLink: req.body.flipBookLink,
        contentBody: req.body.contentBody,
    });

    const heroBanner = await newHeroBanner.save();
    res.send({message: 'Hero Banner Created', heroBanner});
});

export default handler;
