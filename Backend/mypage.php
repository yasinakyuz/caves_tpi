<?php
/**
 * @file         mypage.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      03.05.2024
 */
//ob_start();


session_start();

require 'dbConnector.php';
$pdo = openDBConnection();
$userId = $_SESSION['user_id'];
$current_date = date('Y-m-d');

// Mettre à jour les informations utilisateur
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pdo = openDBConnection(); // Connexion à la base de données
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : null;
    if (!$id) { // S'il n'y a pas d'identifiant utilisateur
        exit('User is not logged in.');
    }


    if (isset($_POST['action']) && $_POST['action'] === 'updateUserInfo') {
        // Récupération des informations utilisateur existantes
        $currentQuery = "SELECT * FROM users WHERE id = ?";
        $currentStmt = $pdo->prepare($currentQuery);
        $currentStmt->execute([$id]);
        $currentData = $currentStmt->fetch(PDO::FETCH_ASSOC);

        // Je récupère les données du formulaire, s'il n'y a pas de données j'utiliserai les données existantes
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

        $updated_date = $current_date; // Date actuelle comme date de mise à jour

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
        $productId = $pdo->lastInsertId();// Identifiant du produit

        // Assign category to the product
        $categoryStmt = $pdo->prepare("INSERT INTO categories (name_category, products_id_products) VALUES (?, ?)");
        $categoryStmt->execute([$categoryName, $productId]);

        $adStmt = $pdo->prepare("INSERT INTO announcements (title, situation, users_idusers, products_id) VALUES (?, ?, ?, ?)");
        $adStmt->execute([$title, $situation, $userId, $productId]);

        // Numéro d'annonce
        $announcementId = $pdo->lastInsertId();

        // Dans cette section, j'associe le produit à l'annonce.
        $pdo->prepare("UPDATE announcements SET products_id=? WHERE id=?")->execute([$productId, $announcementId]);

        echo 'Ad posted successfully with category name: ' . $categoryName;

        if (!empty($_FILES['url']['name'][0])) {
            $uploadDir = '/Frontend/images/'; // Répertoire où les images seront téléchargées
            $totalFiles = count($_FILES['url']['name']);
            for ($i = 0; $i < $totalFiles; $i++) {
                // Opérations de téléchargement de fichiers
                $fileName = basename($_FILES['url']['name'][$i]);
                $filePath = $uploadDir . $fileName;
                $fileType = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                $tempName = $_FILES['url']['tmp_name'][$i];

                // Je vérifie le nombre maximum de fichiers pour éviter que la base de données ne gonfle
                if ($totalFiles > 5) {
                    echo 'Vous ne pouvez télécharger qu un maximum de 5 images.';
                } else {
                    for ($i = 0; $i < $totalFiles; $i++) {
                        // Erreurs d'installation
                        if ($_FILES['url']['error'][$i] !== UPLOAD_ERR_OK) {
                            echo "Erreur de téléchargement avec le fichier: " . $_FILES['url']['name'][$i];
                            continue;
                        }
                        // Vérifiez que le fichier téléchargé est une image.
                        $finfo = new finfo(FILEINFO_MIME_TYPE);
                        $fileMimeType = $finfo->file($_FILES['url']['tmp_name'][$i]);
                        if (strpos($fileMimeType, 'image') !== 0) {
                            echo "Le fichier n'est pas une image.";
                            continue;
                        }
                        // Contrôle de la taille du fichier (5 Mo maximum).
                        if ($_FILES['url']['size'][$i] > (5 * 1024 * 1024)) {
                            echo "L'image doit être inférieure à 5 Mo.";
                            continue;
                        }

                        // Téléchargez le fichier et enregistrez-le dans la base de données.
                        $tempName = $_FILES['url']['tmp_name'][$i];
                        $fileName = $_FILES['url']['name'][$i];
                        $filePath = $uploadDir . basename($fileName);
                        if (move_uploaded_file($_FILES['url']['tmp_name'][$i], $_SERVER['DOCUMENT_ROOT'] . '/' . $filePath)){
                            $description = ''; // J'obtiens l'explication du formulaire. Il peut paraître nul car il n'est pas activé.
                            $photoStmt = $pdo->prepare("INSERT INTO photos (img_name, url, description, products_id_products) VALUES (?, ?, ?, ?)");
                            $photoStmt->execute([$fileName, $filePath, $description, $productId]);
                        } else {
                            echo "Échec du déplacement du fichier téléchargé.";
                            /*
                            // SQL to insert image information into the database
                            $description = 'Description here'; // Use actual description
                            $productId = $pdo->lastInsertId(); // Ensure you get the last inserted product ID correctly

                            $query = "INSERT INTO photos (img_name, url, description, products_id_products) VALUES (?, ?, ?, ?)";
                            $stmt = $pdo->prepare($query);
                            $stmt->execute([$fileName, $filePath, $description, $productId]); */
                        }
                    }
                    echo "Toutes les images enregistrées.";
                }
            }
        } else {
            echo "Aucune image téléchargée.";
        }
        echo 'success';
        exit;
    }
    if ($userId) {
        // Récupérer les images de l'utilisateur à partir de la base de données
        $stmt = $pdo->prepare("SELECT * FROM photos WHERE products_id_products IN (SELECT id FROM products WHERE user_id = ?)");
        $stmt->execute([$userId]);
        $photos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Afficher des images en HTML
        foreach ($photos as $photo) {
            echo '<img src="'.htmlspecialchars($photo['url']).'" alt="'.htmlspecialchars($photo['description']).'">';
        }
    }
    if (isset($_POST['action'])) {
        switch ($_POST['action']) {
            case 'updateUserInfo':
                // Mettre à jour les informations utilisateur
                break;
            case 'postAd':
                // publier une annonce
                break;
            // J'ajouterai d'autres opérations POST ici au fur et à mesure que la page se développera.
        }
    }

// Je retire les annonces de la base de données
}    elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if(isset($_SESSION['user_id'])) {
        $userId = $_SESSION['user_id'];

        try {   // Extraction de publicités et d'informations d'adresse associées
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
            header('Content-Type: application/json'); // Je précise le type de contenu JSON
            echo json_encode(['success' => true, 'ads' => $ads]);
        } catch (PDOException $e) {
            // En cas d'erreur, le message d'erreur sera renvoyé en JSON
            header('Content-Type: application/json'); // JSON
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit;
        }
    }
}



