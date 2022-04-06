import {onError} from '../../utils/error';
import {handleSingleUploadFile} from "../../utils/uploadSingleFile";

const nc = require("next-connect");

const handler = nc({onError});

export const config = {
    api: {
        bodyParser: false,
    },
};

handler.post(async (req, res) => {
    let uploadResult;
    try {
        uploadResult = await handleSingleUploadFile(req, res);
        console.log('uploaded result: ', uploadResult);
    } catch (e) {
        return res.status(422).json({errors: [e.message]});
    }
    res.send({
        secure_url: uploadResult?.file?.filename,
        message: 'Hero Banner Created'
    });
});

export default handler;