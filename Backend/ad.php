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
session_start();

$currentUserId = $_SESSION['user_id'] ?? null; // ID utilisateur de connexion

// Afficher les publicités de la page d'accueil en détail sur la page ad.html

$adId = isset($_GET['id']) ? $_GET['id'] : die(json_encode(['error' => 'Ad ID is required']));

$query = "SELECT a.id as ad_id, a.title, a.situation, a.creation_date, u.street, u.building_number,
    u.postal_code, u.city, u.canton, p.prdct_name as product_name, p.price as product_price,
    p.stock as product_stock,p.id as product_id, ph.url as photo_url, a.users_idusers as buyer_id
    FROM announcements a 
    JOIN users u ON a.users_idusers = u.id 
    JOIN products p ON a.products_id = p.id 
    LEFT JOIN photos ph ON p.id = ph.products_id_products 
    WHERE a.id = ? AND a.delete_date IS NULL";

$stmt = $pdo->prepare($query);
$stmt->execute([$adId]);
$ad = $stmt->fetch(PDO::FETCH_ASSOC);

if ($ad) {
    //$ad['is_owner'] = ($currentUserId === $ad['buyer_id']) ? true : false; // İlan sahibi kontrolü
    //header('Content-Type: application/json');
    echo json_encode($ad);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Annonce non trouvée.']);
}


