let userMarker = null; // Variable globale pour stocker le marqueur utilisateur
function showUserAddressOnMap() {
    console.log('Fetching user address');
    fetch('/Backend/user_en_map.php')
        .then(response => { //response.json())
            console.log('Response received'); // Pour vérifier qu'une réponse a été reçue
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
            if (!data.error) {
                const query = encodeURIComponent(`${data.street} ${data.building_number}, ${data.postal_code} ${data.city}, ${data.canton}`);
                fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}&limit=1`)
                    .then(response => response.json())
                    .then(data => {
                        console.log('Geocoding data:', data);
                        if (!data.error && data.features && data.features.length > 0) {
                            const coordinates = data.features[0].center;
                            if(userMarker){
                                userMarker.setLngLat(coordinates);
                            }else {
                                const el = document.createElement('div');
                                el.className = 'user-marker';
                                el.style.backgroundColor = 'red';
                                el.style.width = '15px';
                                el.style.height = '15px';
                                el.style.borderRadius = '30%';
                                userMarker = new mapboxgl.Marker(el)
                                    .setLngLat(coordinates)
                                    .addTo(map);
                            }
                            console.log('Marqueur ajouté');
                        } else {
                            console.log('Adresse introuvable dans Mapbox.');
                        }
                    });
            } else {
                console.log(data.error);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de l\'adresse de l\'utilisateur:', error);
            console.log('Fetch error:', error);
        });
    if (userMarker) {
        userMarker.remove(); // Remove the existing marker
    }
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                console.log('User geolocation:', position);
                const userCoords = [position.coords.longitude, position.coords.latitude];

                const userLocationMarker = new mapboxgl.Marker({ color: 'purple' }) // Mor marker
                    .setLngLat(userCoords)
                    .addTo(map);

                map.flyTo({ center: userCoords, zoom: 9 }); // Haritayı kullanıcı konumuna odakla
            },
            function(error) {
                console.error('Geolocation error:', error);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}