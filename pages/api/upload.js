/*
import nextConnect from 'next-connect';
import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';
import {onError} from '../../utils/error';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler = nextConnect({onError});
const upload = multer();

handler.use(upload.single('file')).post(async (req, res) => {
    const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            let stream;
            if (req.body.from === 'studentInfo') {
                stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'Students',
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    });
            } else {
                stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                });
            }

            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
    };
    const result = await streamUpload(req);
    res.send(result);
});

export default handler;
*/


const nc = require("next-connect");
const handleSingleUploadFile = require("../../utils/uploadSingleFile");

const handler = nc();

handler.post(async (req, res) => {
    let uploadResult;
    try {
        uploadResult = await handleSingleUploadFile(req, res);
        console.log('uploaded result: ', uploadResult);
    } catch (e) {
        return res.status(422).json({errors: [e.message]});
    }
    res.send({message: 'Hero Banner Created'});
});