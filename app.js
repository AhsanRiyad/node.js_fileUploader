const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
 

const app = express();
const port = 3000;


//setting file uploader
app.use(fileUpload());


//setting body parser
app.use(bodyParser.urlencoded({ extended: true }));

//static resource
app.use('/lib/img', express.static(__dirname + '/lib/img/'));


app.get('/', (req, res)=>{
    res.status(200).json({
        status: 'ok'
    }) 
});


app.post('/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv('/somewhere/on/your/server/filename.jpg', function (err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});




//SERVER STARTUP
app.listen(port, () => console.log('server started at port ' + port));
