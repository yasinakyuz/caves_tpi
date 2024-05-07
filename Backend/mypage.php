<?php
/**
 * @file         mypage.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      03.05.2024
 */
//ob_start();


session_start();
require 'dbConnector.php'; // dbconnector.php dosyasını dahil et
$pdo = openDBConnection();
$userId = $_SESSION['user_id'];
$current_date = date('Y-m-d');



// Kullanıcı bilgilerini güncelle
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = openDBConnection(); // Veritabanı bağlantısını aç
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    if (!$id) {
        // Kullanıcı ID'si yoksa hata mesajı ver veya kullanıcıyı bir sayfaya yönlendir
        exit('User is not logged in.');
    }


    if (isset($_POST['action']) && $_POST['action'] === 'updateUserInfo') {
        // Mevcut kullanıcı bilgilerini al
        $currentQuery = "SELECT * FROM users WHERE id = ?";
        $currentStmt = $pdo->prepare($currentQuery);
        $currentStmt->execute([$id]);
        $currentData = $currentStmt->fetch(PDO::FETCH_ASSOC);

        // Formdan gelen verileri al, eğer veri yoksa mevcut verileri kullan
        $name = $_POST['name'] ?: $currentData['name'];
        $firstname = $_POST['firstname'] ?: $currentData['firstname'];
        $company_name = $_POST['company_name'] ?: $currentData['company_name'];
        $e_mail = $_POST['email'] ?: $currentData['e_mail'];
        $phone = $_POST['phone'] ?: $currentData['phone'];
        $street = $_POST['street'] ?: $currentData['street'];
        $building_number = $_POST['building_number'] ?: $currentData['building_number'];
        $postal_code = $_POST['postal_code'] !== '' ? $_POST['postal_code'] : $currentData['postal_code'];
        $city = $_POST['city'] ?: $currentData['city'];
        $canton = $_POST['canton'] ?: $currentData['canton'];
        $passwordHash = isset($_POST['password']) && $_POST['password'] !== '' ? password_hash($_POST['password'], PASSWORD_DEFAULT) : $currentData['password'];
        //$password = $_POST['password'] ?: $currentData['password'];
        //$passwordHash = password_hash($_POST['password'], PASSWORD_DEFAULT);

        $updated_date = $current_date; // Güncelleme tarihi olarak şu anki tarihi kullan


        $query = "UPDATE users SET name = ?, firstname = ?, company_name = ?, e_mail = ?, phone = ?, street = ?, building_number = ?, postal_code = ?, city = ?, canton = ?, password = ?, updated_date = ? WHERE id = ?";
        $stmt = $pdo->prepare($query);

        try {
            if ($stmt->execute([$name, $firstname, $company_name, $e_mail, $phone, $street, $building_number, $postal_code, $city, $canton, $passwordHash, $updated_date, $id])) {
                echo "User info updated successfully.";
            } else {
                echo "Error updating user info.";
            }
        } catch (PDOException $e) {
            echo "Error updating user info: " . $e->getMessage();
        }


        /*else {
          echo "User not logged in or invalid request.";
          } */


    } elseif (isset($_POST['action']) && $_POST['action'] === 'postAd') {
        $userId = $_SESSION['user_id'];
        $title = $_POST['title'] ?: '';
        $situation = $_POST['situation'] ?: '';
        $categoryName = $_POST['name_category'] ?? '';
        $product_name = $_POST['prdct_name'] ?: '';
        $price = $_POST['price'] ?: '';
        $stock = $_POST['stock'] ?: '';
        //$photoUrl = $_POST['url'] ?: '';


        $userStreet = $_POST['userStreet'] ?: '';
        $userBuildingNumber = $_POST['userBuildingNumber'] ?: '';
        $userPostalCode = $_POST['userPostalCode'] ?: '';
        $userCity = $_POST['userCity'] ?: '';
        $userCanton = $_POST['userCanton'] ?: '';



        $productStmt = $pdo->prepare("INSERT INTO products (prdct_name, price, stock) VALUES (?, ?, ?)");
        $productStmt->execute([$product_name, $price, $stock]);
        $productId = $pdo->lastInsertId();

        // Assign category to the product
        $categoryStmt = $pdo->prepare("INSERT INTO categories (name_category, products_id_products) VALUES (?, ?)");
        $categoryStmt->execute([$categoryName, $productId]);

        $adStmt = $pdo->prepare("INSERT INTO announcements (title, situation, users_idusers, products_id) VALUES (?, ?, ?, ?)");
        $adStmt->execute([$title, $situation, $userId, $productId]);




        // İlan ID'sini al
        $announcementId = $pdo->lastInsertId();

        // Ürün ID'sini al
        //$productId = $pdo->lastInsertId();

        // Ürün ile ilanı ilişkilendir
        $pdo->prepare("UPDATE announcements SET products_id=? WHERE id=?")->execute([$productId, $announcementId]);

        echo 'Ad posted successfully with category name: ' . $categoryName;

        if (!empty($_FILES['url']['name'][0])) {
            $uploadDir = '/Frontend/images/'; // Görsellerin yükleneceği dizin
            $totalFiles = count($_FILES['url']['name']);
            for ($i = 0; $i < $totalFiles; $i++) {
                // Dosya yükleme işlemleri
                $fileName = basename($_FILES['url']['name'][$i]);
                $filePath = $uploadDir . $fileName;
                $fileType = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                $tempName = $_FILES['url']['tmp_name'][$i];

                // Maksimum dosya sayısını kontrol et.

                if ($totalFiles > 5) {
                    echo 'You can only upload a maximum of 5 images.';
                } else {
                    for ($i = 0; $i < $totalFiles; $i++) {
                        // Yükleme hatalarını kontrol et.
                        if ($_FILES['url']['error'][$i] !== UPLOAD_ERR_OK) {
                            echo "Upload error with file: " . $_FILES['url']['name'][$i];
                            continue;
                        }

                        // Yüklenen dosyanın bir resim olduğunu doğrula.
                        $finfo = new finfo(FILEINFO_MIME_TYPE);
                        $fileMimeType = $finfo->file($_FILES['url']['tmp_name'][$i]);
                        if (strpos($fileMimeType, 'image') !== 0) {
                            echo "The file is not an image.";
                            continue;
                        }

                        // Dosya boyutu kontrolü (5MB maksimum).
                        if ($_FILES['url']['size'][$i] > (5 * 1024 * 1024)) {
                            echo "The image must be smaller than 5MB.";
                            continue;
                        }

                        // Dosyanın yüklenmesini ve veritabanına kaydedilmesini dene.
                        $tempName = $_FILES['url']['tmp_name'][$i];
                        $fileName = $_FILES['url']['name'][$i];
                        $filePath = $uploadDir . basename($fileName);
                        if (move_uploaded_file($_FILES['url']['tmp_name'][$i], $_SERVER['DOCUMENT_ROOT'] . '/' . $filePath)){
                            $description = ''; // Açıklamayı formdan al./ aktif edilmedi null olabilir
                            $photoStmt = $pdo->prepare("INSERT INTO photos (img_name, url, description, products_id_products) VALUES (?, ?, ?, ?)");
                            $photoStmt->execute([$fileName, $filePath, $description, $productId]);
                        } else {
                            echo "Failed to move uploaded file.";
                            /*
                            // SQL to insert image information into the database
                            $description = 'Description here'; // Use actual description
                            $productId = $pdo->lastInsertId(); // Ensure you get the last inserted product ID correctly

                            $query = "INSERT INTO photos (img_name, url, description, products_id_products) VALUES (?, ?, ?, ?)";
                            $stmt = $pdo->prepare($query);
                            $stmt->execute([$fileName, $filePath, $description, $productId]); */

                        }
                    }

                    echo "All images saved.";
                }
            }

        } else {
            echo "No images uploaded.";
        }
        echo 'success';
        exit;
    }
    if ($userId) {
        // Veritabanından kullanıcının resimlerini çek
        $stmt = $pdo->prepare("SELECT * FROM photos WHERE products_id_products IN (SELECT id FROM products WHERE user_id = ?)");
        $stmt->execute([$userId]);
        $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // HTML olarak resimleri göster
        foreach ($photos as $photo) {
            echo '<img src="'.htmlspecialchars($photo['url']).'" alt="'.htmlspecialchars($photo['description']).'">';
        }
    }


    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'updateUserInfo':
                // Kullanıcı bilgilerini güncelle
                break;
            case 'postAd':
                // İlan gönder
                break;
            // Diğer POST işlemleri
        }
    }



// İlanları veritabanından çek
}    elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if(isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];

        try {   // İlanları ve ilişkili adres bilgilerini çekme işlemleri burada olacak
            $adsStmt = $pdo->prepare("
                SELECT a.id, 
                       a.title, 
                       a.situation, 
                       a.creation_date, 
                       u.street, 
                       u.building_number, 
                       u.postal_code, 
                       u.city, 
                       u.canton,
                        prod.prdct_name AS product_name,
                        prod.price AS product_price,
                        prod.stock AS product_stock,
                        photo.url AS photo_url
                FROM announcements a
                JOIN users u ON a.users_idusers = u.id
                JOIN products prod ON a.products_id = prod.id
                JOIN photos photo ON prod.id = photo.products_id_products
                WHERE a.users_idusers = ? AND a.delete_date IS NULL
                ORDER BY a.creation_date DESC
                
            ");
            $adsStmt->execute([$userId]);
            $ads = $adsStmt->fetchAll(PDO::FETCH_ASSOC);
            header('Content-Type: application/json'); // JSON içerik tipini belirtin
            echo json_encode(['success' => true, 'ads' => $ads]);
        } catch (PDOException $e) {
            // Hata durumunda JSON ile hata mesajını döndür
            header('Content-Type: application/json'); // JSON içerik tipini belirtin
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit;
        }
    }
}


?>
