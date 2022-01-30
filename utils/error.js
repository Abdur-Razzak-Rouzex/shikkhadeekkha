const getError = (err) => err?.response?.data?.message ?? err.message;

const onError = async (err, req, res, next) => {
    res.status(500).send({message: err.toString()});
};
export {getError, onError};
