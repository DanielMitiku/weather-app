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

const showMessage = (message, className) => {
    const div = document.createElement('div');
    div.className = `mt-5 col-6 offset-3 alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const messageContainer = document.querySelector('.container');
    const form = document.querySelector('.weather-form');
    messageContainer.insertBefore(div, form);
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
};

const acceptLocation = () => {
    const form = document.querySelector('.weather-form');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const city = form.querySelector('#city').value;
        if (city !== '') {
            
            document.querySelector('#city').value = '';
        }
        else {
            showMessage('Please fill all fields', 'danger');
        }
    });
};

acceptLocation();

fetchWeather('London,uk');