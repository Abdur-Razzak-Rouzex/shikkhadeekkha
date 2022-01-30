import nc from 'next-connect';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';
import db from '../../../utils/db';
import {signToken} from '../../../utils/auth';
import {onError} from "../../../utils/error";

const handler = nc({
    onError,
});

handler.post(async (req, res) => {
    await db.connect();
    const user = await User.findOne({phone: req?.body?.phone});
    if (user?.phone !== req?.body?.phone) {
        const newUser = new User({
            name: req?.body?.name,
            phone: req?.body?.phone,
            email: req?.body?.email,
            password: bcrypt.hashSync(req?.body?.password),
            isAdmin: false,
        });
        const user = await newUser.save();

        const token = signToken(user);
        res.send({
            token,
            _id: user?._id,
            name: user?.name,
            phone: user?.phone,
            email: user?.email,
            isAdmin: user?.isAdmin,
        });
    }else {
        res.status(409).send({ message: 'A user with this phone number already exists' });
    }
});

export default handler;
