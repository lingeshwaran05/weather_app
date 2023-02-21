let lat;
let lon;
let locationName = document.getElementById("locationName");
let icon = document.getElementById("icon");
let description_ = document.getElementById("description");
let temperature = document.getElementById("temp");
let mintemp = document.getElementById("mintemp");
let maxtemp = document.getElementById("maxtemp");
let windspeed = document.getElementById("windspeed");
const apikey = process.env.API_KEY;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;

        console.log(lat, lon);
        let data = await getWeatherData(lat, lon);
        var map = L.map('map').setView([lat, lon], 5);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        var marker = L.marker([lat, lon]).addTo(map);
        marker.bindPopup(`<b>${data.name}</b><br>`).openPopup();




        map.on('click', async function(e) {
            const data = await getWeatherData(e.latlng.lat, e.latlng.lng)
            marker.setLatLng([e.latlng.lat, e.latlng.lng]);
            marker.bindPopup(`<b>${data.name}</b><br>`).openPopup();
        });
        return data;

    })
};
async function getWeatherData(lat, lon) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`;
    let response = await fetch(api);
    let data = await response.json();
    console.log(data);
    dataHandler(data);


    return data;
}

function dataHandler(data) {
    const { temp, temp_max, temp_min } = data.main;
    const { speed } = data.wind;
    const { description } = data.weather[0];
    locationName.innerHTML = data.name;
    temperature.innerHTML = "temperature " + temp;
    description_.innerHTML = description;
    mintemp.innerHTML = "Min Temp " + temp_min;
    maxtemp.innerHTML = "Max Temp" + temp_max;
    windspeed.innerHTML = "wind speed " + speed;
}