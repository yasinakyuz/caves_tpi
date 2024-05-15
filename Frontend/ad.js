document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const adId = urlParams.get('id');
    if (!adId) {
        console.error('Ad ID is missing');
        // ID yoksa kullanıcıya bilgi verin veya başka bir sayfaya yönlendirin.
        document.getElementById('ad-container').innerHTML = '<p>Ürün bilgisi bulunamadı. Lütfen geçerli bir ürün seçin.</p>';
        return;
    }

    fetch(`/Backend/ad.php?id=${adId}`)
        .then(response => response.json())
        .then(ad => {
            if(!ad.error) {
                updatePageContent(ad);
                setupEventListeners();
                updateCartCount(); // Sayfa yüklendiğinde sepet sayısını güncelle
            } else{
                document.getElementById('ad-container').innerHTML = '<p>Ürün bilgisi bulunamadı. Lütfen geçerli bir ürün seçin.</p>';

            }

        })
        .catch(error => {
            console.error('Error fetching ad details:', error);
        });
});

function updatePageContent(ad) {
    document.getElementById('ad_title').textContent = ad.title;
    document.getElementById('ad_image').src = ad.photo_url;
    document.getElementById('ad_image').alt = `Image of ${ad.title}`;
    document.getElementById('ad_description').textContent = ad.situation;
    document.getElementById('ad_product_name').textContent = ad.product_name;
    document.getElementById('ad_price').textContent = `Price: ${ad.product_price}`;
    document.getElementById('ad_stock').textContent = `Stock: ${ad.product_stock}`;
    document.getElementById('ad_address').textContent = `Address: ${ad.street} ${ad.building_number}, ${ad.postal_code} ${ad.city}, ${ad.canton}`;
    document.getElementById('ad_creation_date').textContent = `Creation Date: ${new Date(ad.creation_date).toLocaleDateString()}`;
    document.getElementById('add-to-cart-btn').dataset.productId = ad.id;
    updateButtonVisibility();
}

function setupEventListeners() {
    document.getElementById('add-to-cart-btn').onclick = function() {
        addToCart(this.dataset.productId);
    };
    document.getElementById('panier-button').onclick = function() {
        window.location.href = 'panier.html';
    };
}

function addToCart(productId) {

    const quantity = parseInt(document.getElementById('product-quantity').value, 10);
    if (quantity < 1) {
        alert("En az bir ürün eklemelisiniz!");  // Miktar yeterli değilse uyarı ver
        return;  // Fonksiyonu burada sonlandır
    }
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    //const product = { id: productId, quantity: quantity };
    const product = {
        id: productId,
        name: document.getElementById('ad_product_name').textContent,
        price: parseFloat(document.getElementById('ad_price').textContent.replace('Price: ', '')),
        photoUrl: document.getElementById('ad_image').src,// Ürünün fotoğraf URL'sini al
        quantity: quantity
    };

    const existingProductIndex = cart.findIndex(item => item.id === productId);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += quantity;
        alert("mevcut urun miktari artirildi");
    } else {

        cart.push(productId);
        alert("ürün sepete eklendi")
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    //alert("Ürün sepete eklendi!");
    startCartTimeout();
}

function updateCartCount() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('panier-button').textContent = `Panier(${totalCount})`;
}

function updateButtonVisibility() {
    let isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const buttonsToShow = ['message-seller', 'add-to-cart-btn', 'panier-button'];
    buttonsToShow.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        button.style.display = isLoggedIn === 'true' ? 'block' : 'none';
    });
}

//script.js uzerinde logoutUser fonksiyonnunda ki session destroy ile sepete eklenen ilanlar logout islemi sonrasi silinir.

/*
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

            document.getElementById('add-to-cart-btn').dataset.productId = adId;

            updateButtonVisibility(); // Giriş kontrolü ve butonları güncelle
            setupEventListeners();
            // Mesaj Gönder Butonu
            document.getElementById('message-seller').addEventListener('click', function() {
                alert("Mesajınız satıcıya gönderildi!");
            });
*/
/*
            // Sepete Ekle Butonu
            document.getElementById('add-to-cart-btn').addEventListener('click', function() {
                addToCart(adId);
                //alert("Ürün sepete eklendi!");
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
    const buttonsToShow = ['message-seller', 'add-to-cart-btn', 'panier-button'];

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

function addToCart(productId) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const quantity = parseInt(document.getElementById('product-quantity').value, 10);
    const product = {
        id: productId,
        quantity: quantity
    };
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push(product);
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert("Ürün sepete eklendi!");
}

function updateCartCount() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('panier-button').textContent = `Panier(${totalCount})`;
}

function setupEventListeners() {
    const addToCartButton = document.getElementById('add-to-cart-btn');
    addToCartButton.removeEventListener('click', addToCartHandler);
    addToCartButton.addEventListener('click', addToCartHandler);

    const panierButton = document.getElementById('panier-button');
    panierButton.removeEventListener('click', panierHandler);
    panierButton.addEventListener('click', panierHandler);
}

function addToCartHandler() {
    const productId = this.dataset.productId;
    addToCart(productId);
}





function panierHandler() {
    window.location.href = 'panier.html';
}

    /*
    const quantity = document.getElementById('product-quantity') ? document.getElementById('product-quantity').value : 1; // product-quantity öğesi bulunamazsa varsayılan olarak 1 ekle // Örnek olarak 1 adet ekleniyor
    fetch('/Backend/panier.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `action=add&product_id=${productId}&quantity=${quantity}`
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert(result.success);
            } else {
                alert(result.error);
            }
        });
}

/*
function addToCart(productId) {
    const quantity = 1; // Örnek olarak 1 adet ekleniyor
    fetch('/Backend/panier.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `action=add&product_id=${productId}&quantity=${quantity}`
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                alert(result.success);
            } else {
                alert(result.error);
            }
        });
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



