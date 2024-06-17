// Inicializa o mapa com as coordenadas iniciais de Av. da Saudade, Campinas - SP
var initialLat = -22.914822689607544; // Latitude inicial
var initialLon = -47.05588272446561; // Longitude inicial

document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([initialLat, initialLon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    var marker;

    var geocoder = L.Control.geocoder({
        defaultMarkGeocode: false
    })
    .on('markgeocode', function(e) {
        var center = e.geocode.center;
        if (marker) map.removeLayer(marker);
        marker = L.marker(center).addTo(map);
        marker.bindPopup(e.geocode.name).openPopup();
        map.setView(center, 16);

        // Aqui definimos o valor do input para o endereço encontrado
        document.getElementById('nomeConsulta').value = e.geocode.name;
    })
    .addTo(map);

    // Função para buscar endereços e centralizar no mapa
    geocoder.on('markgeocode', function(event) {
        var center = event.geocode.center;
        L.marker(center, {icon: L.icon({
            iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
            iconSize: [38, 95], // Tamanho do ícone
            iconAnchor: [22, 94], // Ponto do ícone que corresponderá à localização do marcador
            popupAnchor: [-3, -76] // Ponto onde a popup deve abrir em relação ao ícone
        })}).addTo(map)
          .bindPopup(event.geocode.name)
          .openPopup();
        map.setView(center, 16); // Ajusta o zoom para uma visualização mais detalhada
    });
});

var map;        // Variável global para armazenar o objeto do mapa
var marker;     // Variável global para armazenar o marcador do mapa

function initMap() {
    // Coordenadas aproximadas para Av. da Saudade, Campinas - SP
    var initialLat = -22.914822689607544;   // Latitude inicial 
    var initialLon = -47.05588272446561;   // Longitude inicial

    map = L.map('map').setView([initialLat, initialLon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Adicionar um marcador no local inicial
    marker = L.marker([initialLat, initialLon]).addTo(map)
        .bindPopup('Av. da Saudade, 125 - Pte. Preta, Campinas - SP')
        .openPopup();
}

function searchAddress() {
    var address = document.getElementById('searchBar').value;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var firstResult = data[0];
                if (marker) {
                    map.removeLayer(marker);
                }
                marker = L.marker([firstResult.lat, firstResult.lon]).addTo(map)
                    .bindPopup(firstResult.display_name)
                    .openPopup();
                map.setView([firstResult.lat, firstResult.lon], 15);
            } else {
                alert('Endereço não encontrado.');
            }
        })
        .catch(error => {
            alert('Erro ao buscar o endereço: ' + error);
        });
}

window.onload = initMap;