document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    startCartTimeout();
});
function displayCartItems() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = ''; // Effacer le contenu précédent
    if (cart.length === 0) {
        cartContainer.innerHTML = 'Votre panier est vide.';
        return;
    }
    let html = '<ul>';
    cart.forEach(item => {
        html += `<li>
                <img src="${item.photoUrl}" alt="${item.name}" style="width:100px; height:auto;">
                ${item.name} - Quantity: ${item.quantity} - Price: ${item.price * item.quantity} CHF
                </li>`;
    });
    html += '</ul>';
    cartContainer.innerHTML = html;
}
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    startCartTimeout();
});
/*
function emptyCart() {
    sessionStorage.removeItem('cart');
    displayCartItems(); //
}*/


function startCartTimeout() {
    console.log("Le délai d'attente du panier a commencé. Le panier sera effacé dans 30 secondes.");
    setTimeout(() => {
        clearCart();
    }, 30000); // 30000 ms = 30 secondes
}

function clearCart() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length > 0) {
        cart.forEach(item => {
            restoreStock(item.id, item.quantity);
        });
    }
    console.log("Vider le panier pour cause d'inactivité.");
    // Vider le panier
    sessionStorage.removeItem('cart');
    updateCartCount();
    displayCartItems(); // Mettre à nouveau le panier à jour
    //restoreStock();
}

function updateCartCount() {
    console.log("Updating cart count...");

    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    let totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    //document.getElementById('panier-button').textContent = `Panier(${totalCount})`;
    let panierButton = document.getElementById('panier-button');
    if (panierButton) {
        panierButton.textContent = `Panier(${totalCount})`;
    } else {
        //console.log('Bouton Panier introuvable sur la page.');
    }
}
document.getElementById('empty-cart-btn').addEventListener('click', function() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert("Le panier est déjà vide.");
        return;
    }

    cart.forEach(item => {
        restoreStock(item.id, item.quantity);
    });
    // Vider le panier
    sessionStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    //alert("vide panier.");

    document.getElementById('cart-items').innerHTML = '<p>Votre panier est vide.</p>';
});

function emptyCart() {
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        //alert("Le panier est vide");
        return;
    }
    cart.forEach(item => {
        restoreStock(item.id, item.quantity);
    });
    // Vider le panier
    sessionStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    alert("Le panier a été vidé.");
    displayCartItems();  // Mettre à nouveau le panier à jour
}

function restoreStock(productId, quantity) {
    fetch(`/Backend/restoreStock.php?productId=${productId}&restoreAmount=${quantity}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error('Échec de la restauration du stock :', data.error);
            }
        })
        .catch(error => {
            console.error('Erreur lors de la restauration du stock:', error);
        });
}


