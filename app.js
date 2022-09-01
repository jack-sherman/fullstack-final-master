const express = require('express');
const app = express();
app.use(express.static(__dirname));

//const port = process.env.port || 8080;
app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/train', (req,res) => {
    res.sendFile(__dirname + '/train.html');
});
app.get('/stream', (req,res) => {
    res.sendFile(__dirname + '/stream.html');
});
app.get('/locate', (req,res) => {
    res.sendFile(__dirname + '/locate.html');
});

app.listen(process.env.port || 8080, () => {

});