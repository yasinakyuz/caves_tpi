document.addEventListener('DOMContentLoaded', (event) => {
    // Kullanıcı ID'sini session storage veya başka bir yöntem ile alın
    const userId = sessionStorage.getItem('user_id'); // Örnek için sessionStorage kullanılmıştır.

    // Kullanıcı ID'sini formdaki gizli alana yerleştirin
    if (userId) {
        document.getElementById('id').value = userId;
    }

    document.getElementById('edit-info-form').addEventListener('submit', function (e) {
        e.preventDefault(); // Formun normal gönderimini engelle
        var formData = new FormData(this);
        formData.append('action', 'updateUserInfo'); // Form verilerine 'action' parametresi ekle

        fetch('/Backend/mypage.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text()) // JSON yerine doğrudan metin olarak yanıt al
            .then(data => alert(data))
            .catch(error => console.error('Error:', error));
    });
});
document.getElementById('post-ad-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Formun normal gönderimini engelle
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
        .then(response => response.text()) // JSON yerine doğrudan metin olarak yanıt al
        .then(data => alert(data))
        .catch(error => console.error('Error:', error));

});

function updatePageWithNewAd(adData) {
    // Code to update the page dynamically, possibly using adData to insert new elements
}
document.addEventListener('DOMContentLoaded', (event) => {
    // Kullanıcı ID'sini session storage veya başka bir yöntem ile alın
    // ...


    function fetchAds() {
        fetch('/backend/mypage.php?action=fetchAds')
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
                        // Birden fazla fotoğraf olduğunu varsayıyoruz, bu yüzden her birini ekleyelim
                        //console.log("ad lenght : ", ad.photo_url.length);
                        console.log("ad lenght : ", ad.photo_url);
                        /*
                        if (ad.photo_url){// && ad.photos.length > 0) {
                            ad.photos.forEach(photo => {
                                imagesHtml += `<img src="${window.location.origin}${ad.photo_url}" alt="Product Image">`;
                                //imagesHtml = `<img src="${window.location.origin}/Frontend/images/pomme.png">`;
                            });
                        }
                        else {
                            // Varsayılan bir "resim yok" görseli
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
                    alert('An error occurred while loading the ads. ' + data.error);
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);

            });

    }    fetchAds();

});