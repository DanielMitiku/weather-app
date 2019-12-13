import './style.css';

const APPID = 'f7b60f6f82b5a121d3e5692ae0173a3d';
const baseURL = 'http://api.openweathermap.org/data/2.5/weather';

const loader = () => {
  const resultDiv = document.querySelector('.result');
  const resultP = document.createElement('h2');
  resultP.classList.add('text-center');
  resultDiv.innerText = '...loading...';
  resultDiv.appendChild(resultP);
};

const showMessage = (message, className) => {
  const div = document.createElement('div');
  div.className = `mt-5 col-6 offset-3 alert alert-${className}`;
  div.appendChild(document.createTextNode(message));
  const messageContainer = document.querySelector('.container');
  const form = document.querySelector('.weather-form');
  messageContainer.insertBefore(div, form);
  setTimeout(() => document.querySelector('.alert').remove(), 3000);
  document.querySelector('.result').innerHTML = '';
};

const weather = (weatherJson, u) => {
  const tempKelvin = weatherJson.main.temp;
  const tempCelsius = parseFloat((tempKelvin - 273.15).toFixed(2));
  const tempFahrenheit = parseFloat(((tempCelsius) * (9 / 5) + 32).toFixed(2));
  if (u === 'celsius') {
    return { celsius: tempCelsius };
  }
  if (u === 'kelvin') {
    return { kelvin: tempKelvin };
  }
  if (u === 'fahrenheit') {
    return { fahrenheit: tempFahrenheit };
  }
  return null;
};

const showWeather = (tempObj, u) => {
  const resultDiv = document.querySelector('.result');
  resultDiv.innerHTML = '';
  const resultP = document.createElement('h2');
  resultP.classList.add('text-center');
  if (u === 'celsius') {
    resultP.innerHTML = `The Temperature of the place you entered is ${tempObj.celsius}&#8451;`;
  } else if (u === 'kelvin') {
    resultP.innerHTML = `The Temperature of the place you entered is ${tempObj.kelvin}K`;
  } else if (u === 'fahrenheit') {
    resultP.innerHTML = `The Temperature of the place you entered is ${tempObj.fahrenheit}&#8457`;
  }

  resultDiv.appendChild(resultP);
};

const fetchWeather = (location, unit) => {
  const loc = location;
  const u = unit;
  const urlVar = `${baseURL}?q=${loc}&APPID=${APPID}`;
  loader();
  fetch(urlVar, { mode: 'cors' })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      } else {
        return response.json();
      }
    })
    .then((response) => {
      const data = response;
      const weatherObj = weather(data, u);
      showWeather(weatherObj, u);
    })
    .catch((err) => {
      showMessage(`Location could not be found. Please try again later!${err}`, 'danger');
    });
};

const acceptLocation = () => {
  const form = document.querySelector('.weather-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const city = form.querySelector('#city').value;
    const unit = document.querySelector('#unit').value;
    if (city !== '' && unit !== '') {
      document.querySelector('.result').innerHTML = '';
      fetchWeather(city, unit);
      document.querySelector('#city').value = '';
    } else {
      showMessage('Please fill all fields', 'danger');
    }
  });
};

acceptLocation();
