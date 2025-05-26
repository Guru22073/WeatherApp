const API_KEY = '895284fb2d2c50a520ea537456963d9c'; 
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function createParticles() {
    const bgAnimation = document.querySelector('.bg-animation');
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 10 + 5 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        bgAnimation.appendChild(particle);
    }
}

createParticles();

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByCoords(lat, lon);
            },
            error => {
                searchWeatherByCity('Bhubaneswar'); 
            }
        );
    } else {
        searchWeatherByCity('Bhubaneswar');
    }
}

function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        searchWeatherByCity(city);
    }
}

document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

async function searchWeatherByCity(city) {
    showLoading();
    try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError('City not found. Please try another city.');
    }
}

async function getWeatherByCoords(lat, lon) {
    showLoading();
    try {
        const response = await fetch(`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        displayWeather(data);
    } catch (error) {
        showError('Unable to fetch weather data.');
    }
}

function showLoading() {
    document.getElementById('weatherContent').innerHTML = '<div class="loading">Loading weather data...</div>';
}

function showError(message) {
    document.getElementById('weatherContent').innerHTML = `<div class="error">${message}</div>`;
}

function displayWeather(data) {
    const weatherContent = document.getElementById('weatherContent');
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    const currentTime = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

     weatherContent.innerHTML = `
        <div class="weather-card">
            <div class="location">${data.name}, ${data.sys.country}</div>
            <div class="date-time">${currentTime}</div>
            
            <div class="weather-main">
                <div class="temperature">${Math.round(data.main.temp)}°C</div>
                <img src="${iconUrl}" alt="${data.weather[0].description}" class="weather-icon">
            </div>
            
            <div class="weather-description">${data.weather[0].description}</div>
            
            <div class="weather-details">
                <div class="detail-item">
                    <div class="detail-label">Feels Like</div>
                    <div class="detail-value">${Math.round(data.main.feels_like)}°C</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Humidity</div>
                    <div class="detail-value">${data.main.humidity}%</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Wind Speed</div>
                    <div class="detail-value">${data.wind.speed} m/s</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Pressure</div>
                    <div class="detail-value">${data.main.pressure} hPa</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Visibility</div>
                    <div class="detail-value">${data.visibility / 1000} km</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">UV Index</div>
                    <div class="detail-value">${data.uvi || 'N/A'}</div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        document.querySelector('.weather-card').classList.add('show');
    }, 100);
}

getUserLocation();
