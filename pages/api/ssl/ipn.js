import nc from 'next-connect';

const handler = nc();

handler.post(async (req, res) => {
    console.log('the ipn request body: ', req?.body);
    return res.status(200).json({
        data: req?.body
    })
});

export default handler;
