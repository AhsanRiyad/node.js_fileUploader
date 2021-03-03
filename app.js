const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const uuid = require('uuid');
let fs = require('fs-extra');

// Set The Storage Engine
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
    limits: { fileSize: 10000000000000000000000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(req, file, cb);
    }
}).single('file');

// Check File Type
function checkFileType(req, file, cb) {
    // Allowed ext
    let filetypes = 
    req.url == '/image_upload' ? /jpeg|jpg|png|gif/ :
    req.url == '/zip_upload' ? /zip/ :
    req.url == '/video_upload' ? /mp4|mkv|mov|wmv|flv|avi|webm|mkv/ : 
    ''  ;

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

// Init app
const app = express();

// Allow cross origin resource sharing (CORS) within our application
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// EJS
app.set('view engine', 'ejs');

// Public Folder
// app.use(express.static('./public'));
app.use('/p', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.render('index'));

app.post(['/image_upload' , '/zip_upload' , '/video_upload'], (req, res) => {
    console.log(req.url);

    upload(req, res, (err) => {
        if (err) {
            // console.log('if err' ,  err);
            res.send(err.code);
        } else {
            if (req.file == undefined) {
                res.send('error');
            } else {
                // res.send(req.file.path);
                res.send(req.file.filename);
            }
        }
    });
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));