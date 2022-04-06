import * as path from 'path';
import multer from 'multer';

const uploadFilePath = path.resolve(__dirname, '../../../../..', 'public/uploads');

const storageFile = multer.diskStorage({
    destination: uploadFilePath,
    filename: function (req, file, fn) {
        fn(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
    },
});

const uploadFile = multer({
    storage: storageFile,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter(req, file, callback) {
        const extension = ['.png', '.jpg', '.jpeg'].indexOf(path.extname(file.originalname).toLowerCase()) >= 0;
        const mimeType = ['image/png', 'image/jpg', 'image/jpeg'].indexOf(file.mimetype) >= 0;
        if (extension && mimeType) {
            return callback(null, true);
        }
        callback(new Error('Invalid file type. Only picture file on type PNG and JPG are allowed!'));
    },
}).single('file');

export const handleSingleUploadFile = async (req, res) => {
    return new Promise((resolve, reject) => {
        uploadFile(req, res, (error) => {
            if (error) {
                reject(error);
            }

            resolve({file: req.file, body: req.body});
        });
    });
};
