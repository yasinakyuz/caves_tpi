document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    startCartTimeout();
});
function displayCartItems() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Önceki içeriği temizle

    if (cart.length === 0) {
        cartContainer.innerHTML = 'Sepetiniz boş.';
        return;
    }
    let html = '<ul>';
    cart.forEach(item => {
        html += `<li>
                <img src="${item.photoUrl}" alt="${item.name}" style="width:100px; height:auto;">
                ${item.name} - Miktar: ${item.quantity} - Fiyat: ${item.price * item.quantity} TL
                </li>`;

    });

    html += '</ul>';
    cartContainer.innerHTML = html;

}

function emptyCart() {
    sessionStorage.removeItem('cart');
    displayCartItems(); // Sepeti tekrar güncelle
}

function startCartTimeout() {
    console.log("Cart timeout started. Cart will be cleared in 30 seconds.");
    setTimeout(() => {
        clearCart();
    }, 30000); // 30000 ms = 30 saniye
}

function clearCart() {
    console.log("Clearing cart due to inactivity.");
    // Sepeti temizle
    sessionStorage.removeItem('cart');
    displayCartItems(); // Sepeti tekrar güncelle
    restoreStocks();
}




function restoreStocks() {
    fetch('/Backend/panier.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({action: 'restoreStocks'})  // Daha önce yoktu, bu işlem için backend'te bir handler yazılmalı
    })
        .then(response => response.json())
        .then(data => console.log("Stocks restored", data))
        .catch(error => console.error('Error:', error));
}

