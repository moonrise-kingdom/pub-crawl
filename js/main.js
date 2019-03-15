var map, service;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 14
    });
    function createInfoWindow(pos) {
    }
    function createMarker(place) {
        var pos = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        }
        var marker = new google.maps.Marker({
            position: pos,
            map: map
        });
        var infoWindow = new google.maps.InfoWindow; // the little popup that we build later
        infoWindow.setPosition(pos);
        infoWindow.setContent(`${place.name}<br/>${place.formatted_address}<br><img src="${place.icon}">`);
        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        })
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            createInfoWindow(pos);
            map.setCenter(pos);
            console.log(map.getCenter());
            var request = {
                location: pos,
                radius: 500,
                type: ['bar']
            };
            service = new google.maps.places.PlacesService(map);
            service.textSearch(request, callback);
            function callback(results, status) {
                console.log(results);
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        var place = results[i];
                        createMarker(place);
                    }
                }
            }
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
    // console.log(infoWindow.getPosition());
} // end of initialize map function
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}