import jwt from 'jsonwebtoken';

const signToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        },
        "45678iokjhgfd456yuhgdertgbvc",
        {
            expiresIn: '30d',
        }
    );
};
const isAuth = async (req, res, next) => {
    const {authorization} = req.headers;
    if (authorization) {
        // Bearer xxx => xxx
        const token = authorization.slice(7, authorization.length);
        jwt.verify(token, "45678iokjhgfd456yuhgdertgbvc", (err, decode) => {
            if (err) {
                res.status(401).send({message: 'Token is not valid'});
            } else {
                req.user = decode;
                next();
            }
        });
    } else {
        /*res.status(401).send({ message: 'Token is not supplied' });*/
        res.status(401).send({message: 'You are not a valid user or refresh the page'});
    }
};
const isAdmin = async (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(401).send({message: 'User is not admin'});
    }
};

export {signToken, isAuth, isAdmin};
