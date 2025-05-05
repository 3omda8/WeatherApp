const apiKey = "c0d0c5a3de854ef2905150335250105";
const date = new Date();
const content = document.querySelector("#content");
const cityName = document.querySelector("#cityName");
const searchBtn = document.querySelector("#searchBtn");
const searchInput = document.querySelector("#searchInput");

async function fetchWeatherData(searchCity) {
  if (searchCity) {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${searchCity}&days=3`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    console.log(data);
    // console.log(data.location.name);
    city(data);
    displayWeather(data);
  } else {
    console.log("Location Error");
  }
}
function city(data) {
  cityName.innerHTML = `${data.location.name}`;
}

function displayWeather(data) {
  const condition = data.current.condition;
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  content.innerHTML = `<div class="col-md-6 col-lg-4 text-center mt-5 mt-lg-3">
          <div class="card bg-dark text-white rounded-5">
            <img
              src="./images/weather.webp"
              class="card-img opacity-75 rounded-5"
              alt="..."
            />
            <div class="card-img-overlay">
              <div
                class="card-title d-flex justify-content-between align-items-center"
              >
                <p class="ms-4">${days[date.getDay()]}</p>
                <p class="me-4">${date.getDate()} ${months[date.getMonth()]}</p>
              </div>
              <div
                class="d-flex flex-column justify-content-center align-items-center h-75"
              >
                <p class="card-text mb-0">
                  <img
                    src="https:${condition.icon}"
                    alt="weather icon"
                    class="w-50p"
                  />
                </p>
                <p class="card-text fs-1">${data.current.temp_c}°C</p>
                
              </div>
              <div class="d-flex justify-content-center">
              <p class="card-text pe-3">${condition.text}</p>
              <p class="card-text"><span class="pe-1"><i class="fa-solid fa-wind"></i></span>${
                data.current.wind_kph
              } km/h</p>
              </div>
            </div>
          </div>
        </div>
        `;
  anotherdisplayWeather(data);
}

function anotherdisplayWeather(data) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date();

  for (let i = 1; i <= 2; i++) {
    const forecast = data.forecast.forecastday[i];

    const nextDay = new Date();
    nextDay.setDate(today.getDate() + i);
    const dayName = days[nextDay.getDay()];

    content.innerHTML += `
      <div class="col-md-6 col-lg-4 text-center mt-5 mt-lg-3">
        <div class="card bg-dark text-white rounded-5">
          <img src="./images/weather.webp" class="card-img opacity-75 rounded-5" alt="weather" />
          <div class="card-img-overlay">
            <div class="card-title fw-bold fs-5">
              <p class=" text-center">${dayName}</p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center h-75">
              <p class="card-text mb-0">
                <img src="https:${forecast.day.condition.icon}" alt="weather icon" class="w-50p" />
              </p>
              <p class="card-text fs-1">${forecast.day.maxtemp_c}°C</p>
              <p class="card-text fw-bold">${forecast.day.mintemp_c}°C</p>
            </div>
            <p class="card-text">${forecast.day.condition.text}</p>
          </div>
        </div>
      </div>
    `;
  }
}

searchBtn.addEventListener("click", function () {
  const searchCity = searchInput.value;
  fetchWeatherData(searchCity);
  searchInput.value = "";
});

function change() {
  const searchCity = searchInput.value;
  fetchWeatherData(searchCity);
  searchInput.value = "";
}
// get City using geolocation
function success(pos) {
  const crd = pos.coords;
  const lat = crd.latitude;
  const lon = crd.longitude;
  getCityName(lat, lon);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  content.innerHTML = `<h1 class="mt-5 pt-5 text-danger text-center text-capitalize">Please Allow Location</h1>`;
}

navigator.geolocation.getCurrentPosition(success, error);

async function getCityName(lat, lon) {
  const geoApiKey = "94874dc3fa3750a0859e05650034c5e4";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${geoApiKey}`
    );
    const data = await response.json();
    const city = data[0].name;
    fetchWeatherData(city);
  } catch (error) {
    console.error("Error:", error);
  }
}
