import nextConnect from 'next-connect';
import multer from 'multer';
import {v2 as cloudinary} from 'cloudinary';
import streamifier from 'streamifier';
import {onError} from '../../utils/error';

cloudinary.config({
    cloud_name: "arouzex",
    api_key: "445858769932296",
    api_secret: "Z4giZ4SKCOLX2H2hObAVhiwyCx4",
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
