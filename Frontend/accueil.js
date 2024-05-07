 document.getElementById('filter-btn').addEventListener('click', function() {
    document.getElementById('filter-popup').style.display = 'block'; // Popup'ı göster
});

document.getElementById('filter-form').addEventListener('submit', async function(e) {

    e.preventDefault();
    // Filtreleme kriterlerini al
    const title = document.getElementById('title').value;
    const categoryName = document.getElementById('name_category').value;
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;
    await fetchAdsFiltered({
        title: title,
        name_category: categoryName,
        min_price : minPrice,
        max_price : maxPrice
    });
    //const city = document.getElementById('city').value;
    // Filtreleme kriterlerine göre ilanları getir
    //await fetchAdsFiltered({
    // title);
});


document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('search-input').value;
    //fetchAdsFiltered(searchTerm);
    fetchAdsFiltered({ title: searchTerm })
});


let markers = []; // This should be a global variable that holds all your markers

function clearAdsAndMarkers() {


    const adsContainer = document.getElementById('ads-container');
    adsContainer.innerHTML = '';

    console.log("Starting to clear markers. Total markers before clearing:", markers.length);
    markers.forEach(marker => marker.remove());
    markers = [];
    console.log("All markers removed, markers array reset.");
    map.jumpTo({center: map.getCenter()});  // Haritayı yeniden odakla */

}


async function fetchAdsFiltered(params) {
    await clearAdsAndMarkers();   // Clear existing ads and markers before fetching new ones

    const queryParams = new URLSearchParams(params).toString();
    try {
        const response = await fetch(`/Backend/accueil.php?${queryParams}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        console.log("Ads fetched successfully:", result.ads);

        displayAds(result.ads); // Display new ads
        markers.forEach(marker => marker.remove()); // Mevcut marker'ları kaldır
        markers = []; // Marker dizisini sıfırla
        result.ads.forEach(ad => {
            addMarker(ad); // Add new markers for each ad
        });
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function displayAds(ads) {
    const adsContainer = document.getElementById('ads-container');
    ads.forEach(ad => {
        console.log("Ad Data:", ad);

        const adElement = document.createElement('div');
        adElement.innerHTML = `
            <h3>${ad.title}</h3>
            <p>${ad.situation}</p>
            <img src="${ad.photo_url}" alt="Product image">
        `;
        adsContainer.appendChild(adElement);

        //addMarker(ad);  // Add new markers for each ad
    });
}

 function addMarker(ad) {
     const fullAddress = `${ad.street} ${ad.building_number}, ${ad.postal_code} ${ad.city}, ${ad.canton}`;
     const query = encodeURIComponent(fullAddress);
     console.log("Adding marker for ad:", ad.title, "with query:", query);

     fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}&limit=1`)
         .then(response => response.json())
         .then(data => {
             if (data.features.length > 0) {
                 const coordinates = data.features[0].center;
                 const descriptionHTML = `<div><strong>${ad.title}</strong><p>${ad.description}</p></div>`;

                 const marker = new mapboxgl.Marker()
                     .setLngLat(coordinates)
                     .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(descriptionHTML))
                     .addTo(map);

                 markers.push(marker);  // Bu adım çok önemli, marker'ları global dizimize ekliyoruz
                 console.log("Marker added, total markers now:", markers.length);
             } else {
                 console.log("No coordinates found for address:", fullAddress);
             }
         }).catch(error => {
         console.error("Error adding marker:", error);
     });
 }



