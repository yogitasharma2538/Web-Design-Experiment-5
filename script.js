async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    const message = document.getElementById("message");
    const weatherInfo = document.getElementById("weatherInfo");

    if (city === "") {
        message.textContent = "Please enter a city name.";
        weatherInfo.style.display = "none";
        return;
    }

    message.textContent = "Loading weather...";
    weatherInfo.style.display = "none";

    try {
        // Find the city's latitude and longitude
        const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

        const geoResponse = await fetch(geoURL);

        if (!geoResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please check the spelling.");
        }

        const place = geoData.results[0];

        // Fetch current weather using coordinates
        const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current) {
            throw new Error("Weather information is unavailable.");
        }

        const current = weatherData.current;

        // Display weather information
        document.getElementById("cityName").textContent =
            place.name + (place.country ? ", " + place.country : "");

        document.getElementById("weatherCondition").textContent =
            "Current Weather";

        document.getElementById("temperature").textContent =
            Math.round(current.temperature_2m) + "°C";

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m + "%";

        document.getElementById("wind").textContent =
            current.wind_speed_10m + " km/h";

        message.textContent = "";
        weatherInfo.style.display = "block";

    } catch (error) {
        message.textContent = error.message;
    }
}