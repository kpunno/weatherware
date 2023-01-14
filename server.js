


//
// drop down list of locations
// 

const kelvin_to_celcius = -273.15;
const express = require('express');
const cors = require('cors'); // remove?
const bodyparser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.port || 8080;

const initialize = function () {
    return new Promise((resolve, reject) => {
        const apikey = '8b0c251a466caaefbf85da31bb32aeb4';
        const location = 'Toronto,CA';
        const api = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=' + apikey;

        fetch(api)
        .then((response) => {return response.json()})
        .catch((err) => {
            console.log('api response error: ' + err); 
            reject();
        })
        .then((data) => {
            console.log(data);

            // contains relevant weather information
            relevantObject = {
                temperature : data.main.temp + kelvin_to_celcius,
                feels_like : data.main.feels_like + kelvin_to_celcius,
                wind_speed : data.wind.speed,
                wind_gust : data.wind.gust,
                overall : data.weather[0].main,
                description : data.weather[0].description
            }

            // test log -> object extraction
            console.log(relevantObject.temperature.valueOf());
            
            
        })
        .catch((err) => {
            console.log('data was not fetched correctly' + err);
            reject();
        })
        .then(resolve());
    });
}

// execute bodyparser.json() function everytime app is accessed
app.use(bodyparser.json());

// get default route and send json data (simple message)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/whatwear', (req,res) => {
    res.send('./whatwear route is working!');
});

app.use((req, res) => {
    res.status(404).send('<h2>404</h2>');
});



// initialize server (listening)
initialize().then(() => {
    app.listen(port, () => {
        console.log('HTTP server is listening...')
    });
}).catch(() => {
    console.log('failed to initialize the server');
})