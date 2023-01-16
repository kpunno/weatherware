//
// drop down list of locations
// 

require('dotenv').config();

const express = require('express');
const cors = require('cors'); // remove?
const bodyparser = require('body-parser');
const path = require('path');
const handlebars = require('express-handlebars');

// conversion (temporarily unmodifiable)
const kelvin_to_celcius = -273.15;

// express / handlebars config
const app = express();
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));
app.use(express.static('public'));

const port = process.env.port || 8080;

const getData = function () {
    return new Promise((resolve, reject) => {
        let apikey = '8b0c251a466caaefbf85da31bb32aeb4';
        let location = 'Toronto,CA';
        let api = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=' + apikey;

        fetch(api)
        .then((response) => {return response.json()})
        .catch((err) => {
            console.log('api response error: ' + err); 
            reject();
        })
        .then((data) => {
            // contains relevant weather information
            displayData = {
                temperature : Math.round(data.main.temp + kelvin_to_celcius),
                feels_like : Math.round(data.main.feels_like + kelvin_to_celcius),
                wind_speed : data.wind.speed,
                wind_gust : data.wind.gust,
                overall : data.weather[0].main,
                description : data.weather[0].description
            }

            resolve(displayData);
        })
        .catch((err) => {
            console.log('data was not fetched correctly' + err);
            reject();
        })
    });
}

// execute bodyparser.json() function everytime app is accessed
app.use(bodyparser.json());

// get default route and send json data (simple message)
app.get('/', (req, res) => {
    getData().then((data)=>{
        res.render('index', {data: data});
    })
    
});

app.get('/whatwear', (req,res) => {
    res.send('./whatwear route is working!');
});

app.use((req, res) => {
    res.status(404).send('<h2>404</h2>');
});



// initialize server (listening)
getData().then(() => {
    app.listen(port, () => {
        console.log('HTTP server is listening...')
    });
}).catch(() => {
    console.log('failed to initialize the server');
})