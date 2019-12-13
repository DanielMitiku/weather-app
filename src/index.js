import './style.css';

const APPID = 'f7b60f6f82b5a121d3e5692ae0173a3d';
const baseURL = 'http://api.openweathermap.org/data/2.5/weather';

const fetchWeather = (location) => {
    let loc = location;
    let urlVar = baseURL + '?q=' + loc + '&APPID=' + APPID; 
    fetch(urlVar, { mode: 'cors'})
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            let data = response;
            console.log(data);
            console.log(weather(response));
        })
        .catch((err) => {

        });
};

const weather = (weatherJson) => {
    const tempKelvin = weatherJson.main.temp;
    const tempCelsius = parseFloat((tempKelvin - 273.15).toFixed(2));
    const tempFahrenheit = parseFloat(((tempCelsius) * 9/5 + 32).toFixed(2));
    return { "kelvin" : tempKelvin, "celsius": tempCelsius, "fahrenheit": tempFahrenheit };
};

fetchWeather('London,uk');