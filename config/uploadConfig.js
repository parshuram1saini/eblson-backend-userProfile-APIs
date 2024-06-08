import path from "path";
import multer from "multer"

let UploadPath = "public/upload";
const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage: fileStorageEngine,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            console.error('File type not supported. Only images are allowed.');
            cb(new Error('File type not supported. Only images are allowed.'));
        }
    }
});

let FileSizeLimit = 10; // IN Mb
export const fileSizeValidator = (req, res, next) => {
    let fileSize = req.headers['content-length'] / 1024 / 1024;
    fileSize = Math.round(fileSize);
    if (fileSize >= FileSizeLimit) {
        clog.error('File Size Exceed !!');
        return res.json({ status: 0, message: req.__('File Size Exceed 10 mb') });
    } else {
        next();
    }
}