import nc from 'next-connect';
import {isAdmin, isAuth} from '../../../utils/auth';
import db from '../../../utils/db';
import Category from "../../../models/Category";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const categories = await Category.find({});
    res.send(categories);
});

handler.use(isAuth, isAdmin);

handler.post(async (req, res) => {
    await db.connect();
    const newCategory = new Category({
        name: req.body.name
    });

    const category = await newCategory.save();
    res.send({message: 'Category Created successfully', category});
});

export default handler;
