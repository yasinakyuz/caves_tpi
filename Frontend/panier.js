document.addEventListener('DOMContentLoaded', function() {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        // Sepete ürün ekle
        addToCartBtn.addEventListener('click', function() {
            const productId = addToCartBtn.dataset.productId;
            const quantityInput = document.getElementById('product-quantity');
            const quantity = quantityInput ? quantityInput.value : 1; // product-quantity öğesi bulunamazsa varsayılan olarak 1 ekle

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
                        loadCart();
                    } else {
                        alert(result.error);
                    }
                })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }

    // Sepeti yükle
    function loadCart() {
        fetch('/Backend/panier.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'action=list'
        })
            .then(response => response.json())
            .then(cartItems => {
                const cartItemsDiv = document.getElementById('cart-items');
                cartItemsDiv.innerHTML = '';
                if (cartItems && cartItems.length > 0) {
                    cartItems.forEach(item => {
                        const cartItem = document.createElement('div');
                        cartItem.className = 'cart-item';
                        cartItem.innerHTML = `<h3>${item.title}</h3><p>Miktar: ${item.quantity}</p><p>Fiyat: ${item.price}</p>`;
                        cartItemsDiv.appendChild(cartItem);
                    });
                } else {
                    cartItemsDiv.innerHTML = '<p>Sepetiniz boş</p>';
                }
            })
            .catch(error => {
                console.error('Error loading cart:', error);
            });
    }

    // Sayfa yüklendiğinde sepeti yükle
    loadCart();
});
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();

    const addToCartButton = document.getElementById('add-to-cart');
    addToCartButton.addEventListener('click', function() {
        addToCart();
    });

    function addToCart() {
        const button = document.getElementById('add-to-cart-btn'); // Ensure this ID matches your button's ID
        const productId = button.dataset.productId; // Fetching product ID from data attribute
        const quantity = document.getElementById('product-quantity') ? document.getElementById('product-quantity').value : 1;

        if (!productId) {
            alert('Product ID is missing');
            return; // Exit if no product ID is found
        }

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
                    console.log('Product added:', result.success);
                    updateCartCount(); // Optional: Update cart count display if you have it
                } else {
                    alert('Error: ' + result.error);
                }
            })
            .catch(error => {
                console.error('Add to cart error:', error);
            });
    }

    function updateCartCount() {
        const cartCount = sessionStorage.getItem('cartCount') || '0';
        const panierButton = document.getElementById('panier-button');
        if (panierButton) {
            panierButton.textContent = `Panier (${cartCount})`;
        } else {
            console.error('Panier button not found');
        }
    }
});

/*

document.addEventListener('DOMContentLoaded', function() {
    // Sepete ürün ekle
    document.getElementById('add-to-cart-btn').addEventListener('click', function() {
        const productId = document.getElementById('add-to-cart-btn').dataset.productId;// Örnek ürün ID
        const quantity = document.getElementById('product-quantity').value;

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
                    loadCart();
                } else {
                    alert(result.error);
                }
            });
    });

    // Sepeti yükle
    function loadCart() {
        fetch('/Backend/panier.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'action=list'
        })
            .then(response => response.json())
            .then(cartItems => {
                const cartItemsDiv = document.getElementById('cart-items');
                cartItemsDiv.innerHTML = '';
                if (cartItems && cartItems.length > 0) {
                    cartItems.forEach(item => {
                        const cartItem = document.createElement('div');
                        cartItem.className = 'cart-item';
                        cartItem.innerHTML = `<h3>${item.title}</h3><p>Miktar: ${item.quantity}</p><p>Fiyat: ${item.price}</p>`;
                        cartItemsDiv.appendChild(cartItem);
                    });
                } else {
                    cartItemsDiv.innerHTML = '<p>Sepetiniz boş</p>';
                }
            })
            .catch(error => {
                console.error('Error loading cart:', error);
            });
    }

    // Sayfa yüklendiğinde sepeti yükle
    loadCart();
});


/*document.addEventListener('DOMContentLoaded', function() {
    const addToCartButton = document.getElementById('add-to-cart');
    const productId = new URLSearchParams(window.location.search).get('id');

    // Check login status
    const isLoggedIn = sessionStorage.getItem('isLoggedIn'); // Example, set this on login
    updateButtonVisibility(isLoggedIn);

    addToCartButton.addEventListener('click', function() {
        if (!isLoggedIn) {
            alert('Please log in to add items to your cart');
            return;
        }
        const product = {
            id: productId,
            name: document.getElementById('ad_product_name').textContent,
            price: parseFloat(document.getElementById('ad_price').textContent.replace('Price: $', '')),
            quantity: 1 // Default quantity
        };
        addToCart(product);
    });
});

function addToCart(item) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let found = cart.find(product => product.id === item.id);
    if (found) {
        found.quantity += 1; // Increment quantity if product already exists
    } else {
        cart.push(item); // Push new item to cart
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart');
    updateCartCount();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let count = cart.reduce((acc, item) => acc + item.quantity, 0);
    document.getElementById('cart-count').textContent = count; // Ensure you have a span with id="cart-count"
}

function updateButtonVisibility(loggedIn) {
    const buttons = document.querySelectorAll('#message-seller, #add-to-cart');
    buttons.forEach(button => button.style.display = loggedIn ? 'block' : 'none');
}

document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
});

function loadCartItems() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tbody = document.querySelector('table.table tbody');
    tbody.innerHTML = ''; // Clear existing items
    cart.forEach(item => {
        let row = `<tr>
            <th scope="row">
                <div class="d-flex align-items-center">
                    <img src="${item.image}" class="img-fluid rounded-3" style="width: 120px;" alt="${item.name}">
                    <div class="flex-column ms-4">
                        <p class="mb-2">${item.name}</p>
                    </div>
                </div>
            </th>
            <td class="align-middle"><p class="mb-0" style="font-weight: 500;">Digital</p></td>
            <td class="align-middle">
                <div class="d-flex flex-row">
                    <button onclick="updateQuantity(false, '${item.id}')"><i class="fas fa-minus"></i></button>
                    <input value="${item.quantity}" type="number" class="form-control form-control-sm" style="width: 50px;" />
                    <button onclick="updateQuantity(true, '${item.id}')"><i class="fas fa-plus"></i></button>
                </div>
            </td>
            <td class="align-middle"><p class="mb-0" style="font-weight: 500;">$${item.price.toFixed(2)}</p></td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function updateQuantity(isIncrement, productId) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    let item = cart.find(product => product.id === productId);
    if (isIncrement) {
        item.quantity += 1;
    } else {
        if (item.quantity > 1) item.quantity -= 1;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems(); // Refresh the cart display
}


/*function loadCartItems() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartItemsContainer = document.getElementById
*/
/*
document.addEventListener('DOMContentLoaded', function () {
    const cartDetails = document.getElementById('cart-details');
    const checkoutButton = document.getElementById('checkout-button');

    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    async function fetchProductDetails(productId) {
        const response = await fetch(`get_product.php?id=${productId}`);
        return await response.json();
    }

    async function loadCart() {
        cartDetails.innerHTML = '';
        const productEntries = Object.entries(cart);
        if (productEntries.length === 0) {
            cartDetails.innerHTML = 'Sepetiniz boş!';
            return;
        }

        for (const [productId, quantity] of productEntries) {
            const product = await fetchProductDetails(productId);
            if (product) {
                const productDiv = document.createElement('div');
                productDiv.className = 'cart-item';
                productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Fiyat: ${product.price} TL</p>
                    <p>Miktar: ${quantity}</p>
                `;
                cartDetails.appendChild(productDiv);
            }
        }
    }

    loadCart();

    checkoutButton.addEventListener('click', function () {
        window.location.href = 'checkout.php';
    });
});
*/
/*
//panier

document.addEventListener('DOMContentLoaded', function () {
    const cartButton = document.getElementById('cart-button');
    const cartCount = document.getElementById('cart-count');

    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    function updateCartCount() {
        const count = Object.values(cart).reduce((sum, amount) => sum + amount, 0);
        cartCount.textContent = count;
    }

    // Load initial cart count
    updateCartCount();

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            if (!cart[productId]) {
                cart[productId] = 0;
            }
            cart[productId]++;

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();

            // Start reservation timer for this product
            startReservationTimer(productId);
        });
    });

    cartButton.addEventListener('click', function () {
        window.location.href = 'panier.html';
    });

    function startReservationTimer(productId) {
        const timerKey = `timer_${productId}`;
        const existingTimer = localStorage.getItem(timerKey);

        if (!existingTimer) {
            localStorage.setItem(timerKey, Date.now());
            setTimeout(() => {
                const timerStart = parseInt(localStorage.getItem(timerKey), 10);
                if (Date.now() - timerStart >= 180000) { // 3 minutes
                    cart[productId]--;
                    if (cart[productId] <= 0) {
                        delete cart[productId];
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartCount();
                    localStorage.removeItem(timerKey);
                }
            }, 180000); // 3 minutes in milliseconds
        }
    }
});
*/