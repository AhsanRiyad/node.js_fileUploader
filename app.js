const express = require('express');
// const { ok } = require('assert');

// Init app
const app = express();

// Allow cross origin resource sharing (CORS) within our application
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// EJS
// app.set('view engine', 'ejs');

// Public Folder
// app.use(express.static('./public'));
app.use('/p', express.static(__dirname + '/public'));

app.get('/', (req, res) => res.stutus(200).json({
    status: 'ok'
}));

app.use('/v1', require('./route/upload'));

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));