<?php
/**
 * @file         ad.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      01.05.2024
 */


header('Content-Type: application/json');

require 'dbConnector.php';
$pdo = openDBConnection();


// ana sayfada ki ilanlarin ad.html sayfasinda detaylica gosterilmesi

$adId = isset($_GET['id']) ? $_GET['id'] : die(json_encode(['error' => 'Ad ID is required']));

$query = "SELECT a.title, a.situation, a.creation_date, u.street, u.building_number,
    u.postal_code, u.city, u.canton, p.prdct_name as product_name, p.price as product_price,
    p.stock as product_stock, ph.url as photo_url
    FROM announcements a 
    JOIN users u ON a.users_idusers = u.id 
    JOIN products p ON a.products_id = p.id 
    LEFT JOIN photos ph ON p.id = ph.products_id_products 
    WHERE a.id = ? AND a.delete_date IS NULL";

$stmt = $pdo->prepare($query);
$stmt->execute([$adId]);
$ad = $stmt->fetch(PDO::FETCH_ASSOC);

if ($ad) {
    //header('Content-Type: application/json');
    echo json_encode($ad);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Annonce non trouvée.']);
}

// ana sayfada harita uzerinde ki ilanlarin ad.html sayfasinda detaylica gosterilmesi.