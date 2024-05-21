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
    document.getElementById('add-to-cart-btn').dataset.productId = ad.product_id; // Burada product_id set ediliyor
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


function checkStock(productId, quantity) {
    fetch(`/Backend/checkStock.php?productId=${productId}&quantity=${quantity}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                updateStock(productId, quantity);
            }
        })
        .catch(error => {
            console.error('Error checking stock:', error);
        });
}

function updateStock(productId, quantity) {
    fetch(`/Backend/updateStock.php?productId=${productId}&decreaseAmount=${quantity}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
            } else {
                addProductToCart(productId, quantity);
                alert("Ürün sepete eklendi ve stok güncellendi.");
            }
        })
        .catch(error => {
            console.error('Error updating stock:', error);
        });
}

function addProductToCart(productId, quantity) {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === productId);
    const newQuantity = existingProductIndex !== -1 ? cart[existingProductIndex].quantity + quantity : quantity;

    const product = {
        id: productId,
        name: document.getElementById('ad_product_name').textContent,
        price: parseFloat(document.getElementById('ad_price').textContent.replace('Price: ', '')),
        photoUrl: document.getElementById('ad_image').src,
        quantity: newQuantity
    };

    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity = newQuantity;
    } else {
        cart.push(product);
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}
function addToCart(productId) {
    const quantity = parseInt(document.getElementById('product-quantity').value, 10);
    if (quantity < 1) {
        alert("En az bir ürün eklemelisiniz!");
        return;
    }

    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === productId);
    const existingQuantity = existingProductIndex !== -1 ? cart[existingProductIndex].quantity : 0;
    const totalQuantity = existingQuantity + quantity;

    checkStock(productId, totalQuantity);
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
