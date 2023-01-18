require('dotenv').config();

const SKIP_FETCH = true; // when designing 
const kelvin_to_celcius = -273.15;

module.exports.getData = function () {
    if (SKIP_FETCH) {
        console.log('skipping data fetching...');
        return Promise.resolve();
    }
    else {
        return new Promise((resolve, reject) => {
            let apikey = process.env.API_KEY;
            let location = 'Toronto,CA';
            let api = 'https://api.openweathermap.org/data/2.5/weather?q=' + location + '&APPID=' + apikey;

            fetch(api)
                .then((response) => { return response.json() })
                .catch((err) => {
                    console.log('api response error: ' + err);
                    reject();
                })
                .then((data) => {
                    // contains relevant weather information
                    let date = new Date().toDateString();
                    let time = new Date().toTimeString();
                    displayData = {
                        date: date,
                        time: time,
                        temperature: Math.round(data.main.temp + kelvin_to_celcius),
                        feels_like: Math.round(data.main.feels_like + kelvin_to_celcius),
                        wind_speed: data.wind.speed,
                        wind_gust: data.wind.gust,
                        overall: data.weather[0].main,
                        description: data.weather[0].description
                    }
                    console.log(displayData.time);
                    resolve(displayData);
                })
                .catch((err) => {
                    console.log('data was not fetched correctly' + err);
                    reject();
                })

        });
    }
}
//
// clothing objects properties
// 1 -> name
// 2 -> temperature
// 3 -> size ?
// 4 -> 