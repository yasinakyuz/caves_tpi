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
                ${item.name} - Quantity: ${item.quantity} - Price: ${item.price * item.quantity} TL
                </li>`;

    });

    html += '</ul>';
    cartContainer.innerHTML = html;

}

function emptyCart() {
    sessionStorage.removeItem('cart');
    displayCartItems(); // Sepeti tekrar güncelle
}
/*
function startCartTimeout() {
    console.log("Cart timeout started. Cart will be cleared in 30 seconds.");
    setTimeout(() => {
        clearCart();
    }, 30000); // 30000 ms = 30 saniye
}*/

function clearCart() {
    console.log("Clearing cart due to inactivity.");
    // Sepeti temizle
    sessionStorage.removeItem('cart');

    displayCartItems(); // Sepeti tekrar güncelle
    restoreStocks();
}

function updateCartCount() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('panier-button').textContent = `Panier(${totalCount})`;
}
/*
function restoreStocks() {
    fetch('/Backend/panier.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({action: 'restoreStocks'})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => console.log("Stocks restored", data))
        .catch(error => console.error('Error:', error));
}
*/
document.getElementById('empty-cart-btn').addEventListener('click', function() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Sepet zaten boş.");
        return;
    }

    cart.forEach(item => {
        restoreStock(item.id, item.quantity);
    });

    // Sepeti temizle
    sessionStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    alert("Sepet boşaltıldı.");
    // Sepetin UI'da boş olduğunu gösterecek güncellemeleri yapın
    document.getElementById('cart-items').innerHTML = '<p>Your cart is empty.</p>'; // Bu satır, sepetin HTML yapısına göre düzenlenmelidir.
});

function restoreStock(productId, quantity) {
    fetch(`/Backend/restoreStock.php?productId=${productId}&restoreAmount=${quantity}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Failed to restore stock:', data.error);
            }
        })
        .catch(error => {
            console.error('Error restoring stock:', error);
        });
}
