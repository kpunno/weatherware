//
// drop down list of locations
// 

const api = require('./weather-api');
const express = require('express');
const cors = require('cors'); // remove?
const bodyparser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars');

// express / handlebars config
const app = express();
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));

app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.port || 8080;

// execute bodyparser.json() function everytime app is accessed
app.use(bodyparser.json());

// get default route and send json data (simple message)
app.get('/', (req, res) => {
    api.getData().then((data)=>{
        res.render('index', {data: data});
    })
});

app.get('/whatwear', (req,res) => {
    res.send('./whatwear route is working!');
});

app.get('/credits', (req, res) => {
    res.render('credits');
});

app.use((req, res) => {
    res.status(404).send('<h2>404</h2>');
});

// initialize server (listening)
api.getData().then(() => {
    app.listen(port, () => {
        console.log('HTTP server is listening...')
    });
}).catch(() => {
    console.log('failed to initialize the server');
})