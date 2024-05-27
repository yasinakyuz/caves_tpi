document.addEventListener('DOMContentLoaded', (event) => {
    // L'ID utilisateur a été obtenu avec le stockage de session
    const userId = sessionStorage.getItem('user_id'); // sessionStorage .

    // Placer l'ID utilisateur dans le champ masqué du formulaire
    if (userId) {
        document.getElementById('id').value = userId;
    }

    document.getElementById('edit-info-form').addEventListener('submit', function (e) {
        e.preventDefault(); // Empêcher la soumission normale du formulaire
        var formData = new FormData(this);
        formData.append('action', 'updateUserInfo'); // Ajout du paramètre 'action' aux données du formulaire

        fetch('/Backend/mypage.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text()) // obtenir la réponse directement sous forme de texte au lieu de JSON
            .then(data => alert(data))
            .catch(error => console.error('Error:', error));
    });
});
document.getElementById('post-ad-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var formData = new FormData(this);
    formData.append('action', 'postAd');

    formData.append('userStreet', document.getElementById('userStreet').value);
    formData.append('userBuildingNumber', document.getElementById('userBuildingNumber').value);
    formData.append('userPostalCode', document.getElementById('userPostalCode').value);
    formData.append('userCity', document.getElementById('userCity').value);
    formData.append('userCanton', document.getElementById('userCanton').value);


    fetch('/Backend/mypage.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error('Error:', error));

});

function updatePageWithNewAd(adData) {
    // Code to update the page dynamically, possibly using adData to insert new elements
}
document.addEventListener('DOMContentLoaded', (event) => {
    // ID => session storage
    // ...
    function fetchAds() {
        fetch('/Backend/mypage.php?action=fetchAds')
            .then(response =>{
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })

            .then(data => {
                /*console.log(data);*/
                if (data.success && data.ads) {
                    const adsList = document.getElementById('adsList');
                    adsList.innerHTML = ''; // Clear any existing ads
                    console.log("ads : ", data.ads)
                    data.ads.forEach(ad => {
                        const adDiv = document.createElement('div');
                        adDiv.className ='ad';

                        //let imagesHtml = '';
                        const imagesHtml = `<img src="${window.location.origin}${ad.photo_url}" alt="Product Image">`;
                        // Je suppose qu'il y a plusieurs photos, alors ajoutons chacune d'elles
                        //console.log("ad lenght : ", ad.photo_url.length);
                        console.log("ad lenght : ", ad.photo_url.length);
                        /*
                        if (ad.photo_url){// && ad.photos.length > 0) {
                            ad.photos.forEach(photo => {
                                imagesHtml += `<img src="${window.location.origin}${ad.photo_url}" alt="Product Image">`;
                                //imagesHtml = `<img src="${window.location.origin}/Frontend/images/pomme.png">`;
                            });
                        }
                        else {
                            // Une image par défaut « sans image »
                            imagesHtml = `<img src="${window.location.origin}/Frontend/images/no-image-available.png" alt="No Image Available">`;
                        }
*/
                        adDiv.innerHTML = `
                        <h3>${ad.title}</h3>
                        <p>${ad.situation}</p>
                        ${imagesHtml}
                        <p>Product Name: ${ad.product_name}</p>
                        <p>Price: ${ad.product_price}</p>
                        <p>Stock: ${ad.product_stock}</p>
                        <p>Address: ${ad.street} ${ad.building_number}, ${ad.postal_code} ${ad.city}, ${ad.canton}</p>
                        <p>Creation Date: ${new Date(ad.creation_date).toLocaleDateString()}</p>
                    `;
                        adsList.appendChild(adDiv);
                    });
                } else {
                    alert('Une erreur s est produite lors du chargement des annonces. ' + data.error);
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);

            });

    }    fetchAds();

});