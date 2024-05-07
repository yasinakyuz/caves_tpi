document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const adId = urlParams.get('id');

    fetch(`/Backend/ad.php?id=${adId}`)
        .then(response => response.json())
        .then(ad => {
            document.getElementById('ad_title').textContent = ad.title;
            document.getElementById('ad_image').src = ad.photo_url;
            document.getElementById('ad_image').alt = `Image of ${ad.title}`;
            document.getElementById('ad_description').textContent = ad.situation;
            document.getElementById('ad_product_name').textContent = ad.product_name;
            document.getElementById('ad_price').textContent = `Price: ${ad.product_price}`;
            document.getElementById('ad_stock').textContent = `Stock: ${ad.product_stock}`;
            document.getElementById('ad_address').textContent = `Address: ${ad.street} ${ad.building_number}, ${ad.postal_code} ${ad.city}, ${ad.canton}`;
            document.getElementById('ad_creation_date').textContent = `Creation Date: ${new Date(ad.creation_date).toLocaleDateString()}`;

            // Mesaj Gönder Butonu
            document.getElementById('message-seller').addEventListener('click', function() {
                alert("Mesajınız satıcıya gönderildi!");
            });

            // Sepete Ekle Butonu
            document.getElementById('add-to-cart').addEventListener('click', function() {
                alert("Ürün sepete eklendi!");
            });

        })
        .catch(error => {
            console.error('Error fetching ad details:', error);
        });
});

//messages
function toggleMessages() {
    var panel = document.getElementById('messaging-panel');
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
    } else {
        panel.classList.add('hidden');
    }
}

function sendMessage() {
    var input = document.getElementById('message-input');
    var msgContainer = document.getElementById('messages-container');
    var newMsg = document.createElement('div');
    newMsg.textContent = input.value;
    newMsg.className = 'user-message'; // Add this class to style user messages differently
    msgContainer.appendChild(newMsg);
    input.value = ''; // Clear input after sending
}


