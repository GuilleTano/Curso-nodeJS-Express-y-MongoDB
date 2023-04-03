// Funcion que le pasamos el ID del div que contiene al mapa y que lo ubique en las cordenadas que le pasamos
var map = L.map('main_map').setView([-34.907752909303355, -56.18473955541292], 13);

//Agrega la capa de tile o mapa para mostrarlo
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

//Agrega la marca a las coordenadas del mapa que se le suministra
//var marker = L.marker([-34.90596111517076, -56.191294232865125]).addTo(map);

$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function(result){
        console.log(result);
        result.bicicletas.forEach(function(bici){
            L.marker(bici.ubicacion, {title: bici.id}).addTo(map);
        });
    }
})
