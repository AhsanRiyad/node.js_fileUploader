const express = require('express');
const fileUpload = express.Router();

const multer = require('multer');
const path = require('path');
const uuid = require('uuid');
let fs = require('fs-extra');
let file = require('fs');

module.exports  = fileUpload;

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        let path =
            req.url == '/image_upload' ? `./public/uploads/image` :
                req.url == '/zip_upload' ? `./public/uploads/zip` :
                    req.url == '/video_upload' ? `./public/uploads/video` :
                        '';
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename: function (req, file, cb) {
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        cb(null, file.fieldname + '-' + uuid.v4() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000 },
    fileFilter: function (req, file, cb) {
        checkFileType(req, file, cb);
    }
}).single('file');

// Check File Type
function checkFileType(req, file, cb) {
    // Allowed ext
    let filetypes =
        req.url == '/image_upload' ? /jpg|png|gif/ :
            req.url == '/zip_upload' ? /zip/ :
                req.url == '/video_upload' ? /mp4|mkv|mov|wmv|flv|avi|mkv/ :
                    '';
    /* switch (req.url) {
        case '/image_upload':
            filetypes == /jpeg|jpg|png|gif/
            break;
        case '/zip_upload':
            filetypes == /zip/
            break;
        case '/video_upload':
            filetypes == /mkv/
            break;
        default:
            filetypes == /jpeg|jpg|png|gif/
            break;
    } */
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}


fileUpload.route(['/image_upload', '/zip_upload', '/video_upload']).post(  (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            // console.log('if err' , err);
            res.send(err.code);
        } else {
            if (req.file == undefined) {
                res.send('error');
            } else {
                // res.send();
                res.send(req.file.filename);
            }
        }
    });
});

fileUpload.route('/file/:name').delete((req, res) => {
    // console.log(req.params.name);
    let extention1 = req.params.name.slice(-3);
    // let extention2 = req.params.name.slice(-4);
    let folderPath = './public/uploads/zip/';
    if (extention1 == 'zip') {
        folderPath = './public/uploads/zip/';
    } else if (extention1 == 'jpg' || extention1 == 'png' || extention1 == 'gif') {
        folderPath = './public/uploads/image/';
    } else if (extention1 == 'mkv' || extention1 == 'mp4' || extention1 == 'mov' || extention1 == 'wmv' || extention1 == 'flv'  || extention1 == 'mkv') {
        folderPath = './public/uploads/video/';
    };

    file.unlink(`${folderPath}${req.params.name}`, function (err) {
        // console.log('deleted');
        res.sendStatus(204);
    });
});

fileUpload.route('/file/:name').get( (req, res) => {

    // res.send(req.params.name.slice(-3));

    let extention1 = req.params.name.slice(-3);
    // let extention2 = req.params.name.slice(-4);
    let ContentType = '';
    let folderPath = '../public/uploads/zip/';
    if (extention1 == 'zip') {
        folderPath = '../public/uploads/zip/';
        ContentType = `/application/${extention1}`;
    } else if (extention1 == 'jpg' || extention1 == 'png' || extention1 == 'gif') {
        folderPath = '../public/uploads/image/';
        ContentType = `image/${extention1}`;
    } else if (extention1 == 'mkv' || extention1 == 'mp4' || extention1 == 'mov' || extention1 == 'wmv' || extention1 == 'flv') {
        folderPath = '../public/uploads/video/';
        ContentType = `video/${extention1}`;
    };

    let filePath = path.join(__dirname, `${folderPath}${req.params.name}`);
    // res.send(filePath);
    let stat = file.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': ContentType,
        'Content-Length': stat.size
    });

    let readStream = file.createReadStream(filePath);
    // We replaced all the event handlers with a simple call to readStream.pipe()
    readStream.pipe(res);
});

fileUpload.route('/test').get((req, res) => {
    res.send('ok');
});




