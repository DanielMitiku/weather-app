import './style.css';

const APPID = 'f7b60f6f82b5a121d3e5692ae0173a3d';
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';

const loader = () => {
  const resultDiv = document.querySelector('.result');
  const resultP = document.createElement('h2');
  resultP.classList.add('text-center');
  resultDiv.innerText = '...loading...';
  resultDiv.appendChild(resultP);
};

const imageLoader = () => {
  const descriptionImage = document.querySelector('.description-image');
  const imageP = document.createElement('h2');
  imageP.classList.add('text-center');
  descriptionImage.innerText = '...loading...';
  descriptionImage.appendChild(imageP);
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
  document.querySelector('.descriptionImage').innerHTML = '';
};

const weather = (weatherJson, u) => {
  const { description } = weatherJson.weather[0];
  const tempKelvin = weatherJson.main.temp;
  const tempCelsius = parseFloat((tempKelvin - 273.15).toFixed(2));
  const tempFahrenheit = parseFloat(((tempCelsius) * (9 / 5) + 32).toFixed(2));
  if (u === 'celsius') {
    return { celsius: tempCelsius, description };
  }
  if (u === 'kelvin') {
    return { kelvin: tempKelvin, description };
  }
  if (u === 'fahrenheit') {
    return { fahrenheit: tempFahrenheit, description };
  }
  return null;
};

const showWeather = (tempObj, u) => {
  const resultDiv = document.querySelector('.result');
  resultDiv.innerHTML = '';
  const resultP = document.createElement('h2');
  resultP.classList.add('text-center');
  if (u === 'celsius') {
    resultP.innerHTML = `Temperature: ${tempObj.celsius}&#8451;, Description:  ${tempObj.description}`;
  } else if (u === 'kelvin') {
    resultP.innerHTML = `Temperature: ${tempObj.kelvin}K, Description: ${tempObj.description}`;
  } else if (u === 'fahrenheit') {
    resultP.innerHTML = `Temperature: ${tempObj.fahrenheit}&#8457, Description: ${tempObj.description}`;
  }

  resultDiv.appendChild(resultP);
};

const imagePromise = url => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => {
    const message = `Could not load image at ${url}`;
    reject(new Error(message));
  };
  img.src = url;
});

const fetchImage = (weatherObj) => {
  const search = `weather${weatherObj.description}`;
  const descriptionImage = document.querySelector('.description-image');
  descriptionImage.innerHTML = '';
  const imageUrl = `https://api.giphy.com/v1/gifs/translate?api_key=91nozcLeYMCqxY6j7xsh3jqbgnd6zWiV&s=${search}`;
  imageLoader();
  imagePromise(imageUrl)
    .then((img) => {
      descriptionImage.innerHTML = '';
      descriptionImage.appendChild(img);
      img.classList.add('rounded');
      img.setAttribute('width', '400');
      img.setAttribute('height', '200');
    })
    .catch((error) => {
      showMessage(`Image could not be loaded${error}`, 'danger');
    });
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
      fetchImage(weatherObj);
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
