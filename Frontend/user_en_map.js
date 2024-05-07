/*map.on('load', function() {
    checkUserSessionAndShowMarker();
});
function checkUserSessionAndShowMarker() {
    fetch('/Backend/login.php') // Bu dosya oturumun varlığını kontrol eder
        .then(response => console.log(response.json()))
        .then(data => {
            console.log("data : ", data)
            if (data.isLoggedIn) {
                showUserAddressOnMap();
            } else {
                if (userMarker) {
                    userMarker.remove(); // Eğer marker varsa ve kullanıcı oturumu kapalıysa, marker'ı kaldır
                    userMarker = null; // Marker referansını temizle
                }
            }
        })
        //.catch(error => console.error('Session check failed:', error));
}*/

let userMarker = null; // Global variable to store user marker
function showUserAddressOnMap() {
    console.log('Fetching user address');
    fetch('/Backend/user_en_map.php')
        .then(response => { //response.json())
            console.log('Response received'); // Yanıt alındığını kontrol etmek için bir log
            return response.json();
        })
        .then(data => {
            console.log('Data:', data); // Alınan veriyi logla
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
                            console.log('Marker added');
                        } else {
                            console.log('Address not found in Mapbox.');
                        }
                    });
            } else {
                console.log(data.error);
            }
        })
        .catch(error => {
            console.error('Error fetching user address:', error);
            console.log('Fetch error:', error);
        });
    if (userMarker) {
        userMarker.remove(); // Remove the existing marker
    }
    // Create a new marker and assign it to userMarker
    //userMarker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
}