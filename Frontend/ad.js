
document.addEventListener('DOMContentLoaded', function() {

    const urlParams = new URLSearchParams(window.location.search);
    const adId = urlParams.get('id');

    //initializeCartCount();

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

            updateButtonVisibility(); // Giriş kontrolü ve butonları güncelle

            // Mesaj Gönder Butonu
            document.getElementById('message-seller').addEventListener('click', function() {
                alert("Mesajınız satıcıya gönderildi!");
            });

            // Sepete Ekle Butonu
            document.getElementById('add-to-cart').addEventListener('click', function() {
                addToCart(adId);
                alert("Ürün sepete eklendi!");
            });

            // Sepetim Butonu
            document.getElementById('panier-button').addEventListener('click', function() {
                window.location.href = 'panier.html';
            });


        })
        .catch(error => {
            console.error('Error fetching ad details:', error);
        });
});

function updateButtonVisibility() {
    console.log('Updating button visibility...');
    let isLoggedIn = sessionStorage.getItem('isLoggedIn');
    console.log('Logged in:', typeof(isLoggedIn));
    const buttonsToShow = ['message-seller', 'add-to-cart', 'panier-button'];

    buttonsToShow.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if(isLoggedIn === 'true') {
            console.log("LOGé")
                console.log(buttonId + ' found');
                button.style.display = 'block';
                //button.style.display = isLoggedIn ? 'block' : 'none';
        }else if(isLoggedIn === 'false'){
            console.log("NON LOGé")
            button.style.display = 'none';
        }
    })
}
/*
function initializeCartCount() {
    if (!localStorage.getItem('cartCount')) {
        localStorage.setItem('cartCount', 0);
    }
    updateCartCount();
}

function addToCart(productId) {
    let count = parseInt(localStorage.getItem('cartCount'), 10);
    count++;
    localStorage.setItem('cartCount', count);
    updateCartCount();
    alert("Product added to cart!");
}

function updateCartCount() {
    const count = localStorage.getItem('cartCount');
    document.getElementById('panier-button').textContent = `Panier (${count})`;
}
/*
function initializeCart() {
    if (!localStorage.getItem('cartCount')) {
        localStorage.setItem('cartCount', '0');
    }
}

function updateCartCount() {
    const count = localStorage.getItem('cartCount');
    document.getElementById('panier-button').textContent = `Panier (${count})`;
}
function addToCart() {
    let currentCount = parseInt(localStorage.getItem('cartCount'), 10);
    currentCount += 1; // Increment the count
    localStorage.setItem('cartCount', currentCount.toString()); // Store the new count
    updateCartCount(); // Update the display
    alert("Product added to cart!");
}


/*

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
*/



