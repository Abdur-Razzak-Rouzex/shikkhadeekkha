import nc from 'next-connect';
import {isAdmin, isAuth} from "../../../utils/auth";
import db from "../../../utils/db";
import Category from "../../../models/Category";

const handler = nc();

handler.get(async (req, res) => {
    await db.connect();
    const category = await Category.findById(req?.query?.id);
    res.send(category);
});

handler.use(isAuth, isAdmin);

handler.put(async (req, res) => {
    await db.connect();
    const category = await Category.findById(req?.query?.id);
    if (category) {
        category?.subCategory.push(req?.body?.subCategory);
        await category.save();
        res.send({ message: 'Sub-category created successfully' });
    } else {
        res.status(404).send({ message: 'Category Not Found' });
    }
});

handler.delete(async (req, res) => {
    await db.connect();
    const category = await Category.findById(req.query.id);
    if (category) {
        await category.remove();
        res.send({ message: 'Category Deleted Successfully' });
    } else {
        res.status(404).send({ message: 'Category Not Found' });
    }
});

export default handler;
