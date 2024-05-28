 document.getElementById('filter-btn').addEventListener('click', function() {
    document.getElementById('filter-popup').style.display = 'block'; // Popup'ı göster
});

document.getElementById('filter-form').addEventListener('submit', async function(e) {

    e.preventDefault();
    // Obtenir des critères de filtrage
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
    // Récupérer des annonces en fonction de critères de filtrage
    //await fetchAdsFiltered(title);
});


document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('search-input').value;
    fetchAdsFiltered({ title: searchTerm })
});

let markers = []; // Cela devrait être une variable globale contenant tous mes marqueurs
function clearAdsAndMarkers() {
    const adsContainer = document.getElementById('ads-container');
    adsContainer.innerHTML = '';

    console.log("Starting to clear markers. Total markers before clearing:", markers.length);
    markers.forEach(marker => marker.remove());
    markers = [];
    console.log("All markers removed, markers array reset.");
    map.jumpTo({center: map.getCenter()});  // Recentrer la carte
}

async function fetchAdsFiltered(params) {
    await clearAdsAndMarkers();   // Effacez les publicités et les marqueurs existants avant d'en récupérer de nouveaux
    const queryParams = new URLSearchParams(params).toString();
    try {
        const response = await fetch(`/Backend/accueil.php?${queryParams}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        console.log("Ads fetched successfully:", result.ads);
        displayAds(result.ads); // Afficher de nouvelles annonces
        markers.forEach(marker => marker.remove()); // Supprimer les marqueurs existants
        markers = []; // Réinitialiser le tableau de marqueurs
        result.ads.forEach(ad => {
            addMarker(ad); // Ajouter de nouveaux marqueurs pour chaque nom
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
            <a href="ad.html?id=${ad.id}" class="ad-link">
                <div class="ad-content">
                    <img src="${ad.photo_url}" alt="image d'annonce">
                    <div class="ad-info">
                        <h3>${ad.title}</h3>
                        <p>${ad.situation}</p>
                        <p>Stock: ${ad.stock}</p>
                        <p>price: ${ad.price}</p>
                    </div>
                </div>
            </a>
        `;
        adsContainer.appendChild(adElement);
        //addMarker(ad);  // Ajouter de nouveaux marqueurs pour chaque nom
    });
}
/*
function addMarker(ad) {
    const fullAddress = `${ad.street} ${ad.building_number}, ${ad.postal_code} ${ad.city}, ${ad.canton}`;
    const query = encodeURIComponent(fullAddress);
    console.log("Adding marker for ad:", ad.title, "with query:", query);
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}&limit=1`)
     .then(response => response.json())
     .then(data => {
         if (data.features.length > 0) {
             const coordinates = data.features[0].center;
             const descriptionHTML = `
                <a href="ad.html?id=${ad.id}">
                    <h3>${ad.title}</h3>
                    <p>${ad.situation}</p>
                    <img src="${ad.photo_url}" alt="Product image">
                </a>
               `;

             const marker = new mapboxgl.Marker()
                 .setLngLat(coordinates)
                 .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(descriptionHTML))
                 .addTo(map);
             markers.push(marker);  // Cette étape est très importante, on ajoute les marqueurs à mon tableau global
             console.log("Marker added, total markers now:", markers.length);
         } else {
             console.log("No coordinates found for address:", fullAddress);
         }
     }).catch(error => {
     console.error("Error adding marker:", error);
    });
}*/

 function addMarker(ad, index, totalAdsAtLocation) {
     const OFFSET = 0.0001; // Küçük ofset değeri
     const angle = (index / totalAdsAtLocation) * 360; // Her marker için açı hesaplama
     const radians = angle * (Math.PI / 180); // Dereceyi radyana çevirme

     const fullAddress = `${ad.street} ${ad.building_number}, ${ad.postal_code} ${ad.city}, ${ad.canton}`;
     const query = encodeURIComponent(fullAddress);

     fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${mapboxgl.accessToken}&limit=1`)
         .then(response => response.json())
         .then(data => {
             if (data.features.length > 0) {
                 const baseCoordinates = data.features[0].center;

                 // Ofset uygulayarak yeni koordinatları hesaplama
                 const newLongitude = baseCoordinates[0] + OFFSET * Math.cos(radians);
                 const newLatitude = baseCoordinates[1] + OFFSET * Math.sin(radians);

                 const coordinates = [newLongitude, newLatitude];
                 const descriptionHTML = `
                <a href="ad.html?id=${ad.id}">
                    <h3>${ad.title}</h3>
                    <p>${ad.situation}</p>
                    <img src="${ad.photo_url}" alt="Product image">
                </a>
             `;

                 const marker = new mapboxgl.Marker()
                     .setLngLat(coordinates)
                     .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(descriptionHTML))
                     .addTo(map);
                 markers.push(marker);
             }
         }).catch(error => {
         console.error("Error adding marker:", error);
     });
 }

function scrollAds(direction) {
    const adsContainer = document.getElementById('ads-container');
    const scrollAmount = 300; // Her tıklamada ne kadar kaydırılacağını belirleyin

    if (direction === 'left') {
     adsContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else if (direction === 'right') {
     adsContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}
