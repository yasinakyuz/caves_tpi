
document.addEventListener('DOMContentLoaded', (event) => {
    checkLoginState();
});

function checkLoginState() {
    // Bu örnekte, giriş durumu bir oturum değişkeninin varlığına göre kontrol edilmektedir.
    // Gerçek projenizde, bu kontrolü sunucu tarafından sağlanan oturum yönetimiyle yapmalısınız.
    var isLoggedIn = sessionStorage.getItem('userLoggedIn'); // Örnek için sessionStorage kullanılmıştır.

    if (isLoggedIn) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';


    } else {
        document.getElementById('login-btn').style.display = 'block';
        document.getElementById('logout-btn').style.display = 'none';


    }
}


// Popup penceresini göster
function showPopup() {
    var popup = document.getElementById('subscribe-popup');
    popup.style.display = 'block';
}

// Popup penceresini kapat
function closePopup() {
    var popup = document.getElementById('subscribe-popup');
    popup.style.display = 'none';
}

// Butona tıklandığında popup'ı göster
document.getElementById('subscribe').addEventListener('click', showPopup);

// Kapat butonuna tıklandığında popup'ı kapat
document.querySelector('.close').addEventListener('click', closePopup);

// Pencere dışına tıklandığında popup'ı kapat
window.onclick = function(event) {
    var popup = document.getElementById('subscribe-popup');
    if (event.target == popup) {
        popup.style.display = 'none';
    }
}



// Login popup penceresini göster
function showLoginPopup() {
    var popup = document.getElementById('login-popup');
    popup.style.display = 'block';
}

// Login popup penceresini kapat
function closeLoginPopup() {
    var popup = document.getElementById('login-popup');
    popup.style.display = 'none';
}

// 'login' butonu için event listener
document.getElementById('login-btn').addEventListener('click', showLoginPopup);

// Close işlemleri için mevcut fonksiyonlarına benzer şekilde login popup için
var closeButtons = document.getElementsByClassName("close");
for(var i = 0; i < closeButtons.length; i++) {
    closeButtons[i].addEventListener('click', function() {
        closeLoginPopup();
        closePopup(); // Eğer her iki popup için aynı kapatma butonunu
    });
}

// Pencere dışına tıklandığında tüm popup'ları kapat
window.onclick = function(event) {
    if (event.target == document.getElementById('login-popup')) {
        closeLoginPopup();
    }
    if (event.target == document.getElementById('subscribe-popup')) {
        closePopup();
    }
}


// Add event listener for subscription form submission
document.getElementById('subscribe-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    fetch('/Backend/subscribe.php', {
        method: 'POST',
        body: data
    })
        .then(response => response.text())
        .then(text => {
            if (text === 'success') {
                alert('Subscription successful.');
                closePopup();
            } else {
                alert('Subscription failed: ' + text);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// Inside your submit event listener for the subscribe form
const password = document.getElementById('password').value;
const confirmPassword = document.getElementById('confirm-password').value;
if (password !== confirmPassword) {
    alert('Passwords do not match.');

}


fetch('/Backend/subscribe.php', {
    method: 'POST',
    body: new FormData(document.getElementById('subscribe-form'))
})
//let userMarker = null; // Initialize to null to manage its state globally
//login
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Formun varsayılan gönderme işlemini engelleyin.
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;
    loginuser(email, password); // loginuser fonksiyonunu çağırın.
});

function loginuser(email, password) {
    fetch('/Backend/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.text())
    .then(text => {
        if (text === 'success') {
            document.getElementById('subscribe').style.display= 'none';
            document.getElementById('login-btn').style.display = 'none';
            document.getElementById('logout-btn').style.display = 'block';
            document.getElementById('messages-btn').style.display = 'block';
            document.getElementById('filter-btn').style.display = 'block';
            document.getElementById('mypage-btn').style.display = 'block';

            sessionStorage.setItem('isLoggedIn', true);

            //localStorage.setItem('isLoggedIn', 'true');
            console.log('Login successful');

            showUserAddressOnMap();

        } else { //login failed
            alert('Login information is incorrect.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//logout
document.getElementById('logout-btn').addEventListener('click', logoutuser);

function logoutuser(){
    sessionStorage.setItem('isLoggedIn', false);
    fetch('/Backend/logout.php',{
        method:'POST'
    })
    .then(response => response.text())
    .then(text => {
        if (userMarker) {
            userMarker.remove();
        }
        //reload the exit succesful page
        window.location.reload()
    })
    .catch(error => {
        console.error('Error:', error);
    })
}

// ana sayfada ki ilanlari gosterir.
document.addEventListener('DOMContentLoaded', () => {
    fetchAds();
    setInterval(fetchAds, 300000);
});
function fetchAds(){

    fetch('/Backend/accueil.php')
        .then(response => response.json())
        .then( data => {
            console.log('publicité : ', data)
            if (data.ads && data.ads.length) {

                const adsContainer = document.getElementById('ads-container');
                adsContainer.innerHTML = '';

                data.ads.forEach(ad => {
                    const adDiv = document.createElement('div');
                    adDiv.className = 'ad';
                    adDiv.innerHTML = `
                        <h3>${ad.title}</h3>
                        <p>${ad.situation}</p>
                        <img src="${ad.photo_url}" alt="ads Image">
                        <p>Ürün Adı: ${ad.product_name}</p>
                        <p>Fiyat: ${ad.product_price}</p>
                        <p>Stok: ${ad.product_stock}</p>
                        <p>Adres: ${ad.street} ${ad.building_number}, ${ad.postal_code} ${ad.city}, ${ad.canton}</p>
                        <p>Oluşturulma Tarihi: ${new Date(ad.creation_date).toLocaleDateString()}</p>
                    `;
                    adsContainer.appendChild(adDiv);

                    adDiv.addEventListener('click', function() {
                        window.location.href = `ad.html?id=${ad.id}`; // Detay sayfasına yönlendir
                    });
                    //console.log(document.querySelectorAll('.ad'));
                    //document.querySelectorAll('.ad').style.backgroundImage = `url('${ad.photo_url}')`;
                });
                const ads = document.querySelectorAll('.ad');
                ads.forEach(adElement => {
                    const img = adElement.querySelector('img'); // Prendre l'URL depuis l'élément <img>.
                    if (img && img.src) {
                        adElement.style.backgroundImage = `url('${img.src}')`;
                    }
                });
            } else {

                console.error('No ads to display');
            }
        })
        .catch(error =>{
            console.error('fetch error' , error);
    });

}









