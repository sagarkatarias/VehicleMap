const mymap = L.map('map').setView([53.5511, 9.9937], 13);
let jsonData = [];
let tableData = [];
const myIcon = L.icon({
    iconUrl: 'assets/car.svg',
    iconSize: [27, 30],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
});
let previousRow = '<tr/>'

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2FnYXJrYXRhcmlhNDUiLCJhIjoiY2tjZ3UwdDZkMDY4ajJxczVyNGQ2OTZyeCJ9.UKaYw7YIc04eH_rayycqfA'
}).addTo(mymap);

const loadItems = async () => {
    try {
        const response = await fetch('https://api.jsonbin.io/b/5f0b38a8343d624b07845d94', {
            method: "GET",
            withCredentials: true,
            headers: {
                "secret-key": "$2b$10$m3NM6HwbnBPtM.bWvkhU1OSfrbW.fIgQdv8hrcksjIPovntAewKNO",
                "Content-Type": "application/json"
            }
        });
        jsonData = await response.json();
        createMarkers(jsonData);
    } catch (err) {
        console.error(err);
    }
};

loadItems();

const createMarkers = (jsonData) => {
    jsonData.forEach((vehicle) => {
        const marker = L.marker([vehicle.geoCoordinate.latitude, vehicle.geoCoordinate.longitude], { icon: myIcon }).addTo(mymap);
        marker.on('click', (e) => {
            zoom(e.latlng.lat, e.latlng.lng);
        });
        marker.bindTooltip(`<p>Plate: ${vehicle.plate}<br />
        FuelLevel: ${vehicle.fuelLevel}<br />
        Address: ${vehicle.address}<br />
        Build Series: ${vehicle.buildSeries}<br />
        Fuel Type: ${vehicle.fuelType}<br />
        Primary Color: ${vehicle.primaryColor}<br /></p>`);
    });
    appendRows(jsonData);
};

const appendRows = () => {
    const table = $('#table-body');
    jsonData.forEach((vehicleData, index) => {
        const row = document.createElement("tr");
        row.id = vehicleData.vin;
        row.innerHTML = `
                  <td>${index + 1}</td>
                  <td>${vehicleData.plate}</td>
                  <td>${vehicleData.fuelLevel}</td>
                  <td>${vehicleData.primaryColor}</td>
                  <td>${vehicleData.address}</td>
                  `
        row.onclick = () => {
            zoom(vehicleData.geoCoordinate.latitude, vehicleData.geoCoordinate.longitude);
        };
        table.append(row);
    });
};

const zoom = (lat, long) => {
    mymap.setView([lat, long], 18);
    highlightRow(lat, long);
};

const highlightRow = (lat, long) => {
    const index = jsonData.findIndex((vehicle) => (vehicle.geoCoordinate.latitude === lat && vehicle.geoCoordinate.longitude === long));
    const id = jsonData[index].vin;
    const row = document.getElementById(id);
    row.className = 'check';
    previousRow.className = '';
    previousRow = row;
};