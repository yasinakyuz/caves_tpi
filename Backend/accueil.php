<?php
/**
 * @file         accueil.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      01.05.2024
 */
header('Access-Control-Allow-Origin: *');
require 'dbConnector.php';
$pdo = openDBConnection();
error_reporting(E_ALL);
ini_set('display_errors', 1);


$title = $_GET['title'] ?? ''; // Use GET to allow for parameterization from URL
//$situation =$_GET['situation'] ?? '';
$nameCategory = $_GET['name_category'] ?? '';
$minPrice = $_GET['min_price'] ?? '';
$maxPrice = $_GET['max_price'] ?? '';

$query = "SELECT a.id, a.title, a.situation, a.creation_date, u.street, u.building_number,
    u.postal_code, u.city, u.canton, p.prdct_name as product_name, p.price as product_price,
    p.stock as product_stock, ph.url as photo_url, c.name_category
    FROM announcements a 
    JOIN users u ON a.users_idusers = u.id 
    JOIN products p ON a.products_id = p.id 
    JOIN categories c ON p.id = c.products_id_products   
    LEFT JOIN photos ph ON p.id = ph.products_id_products 
    WHERE a.delete_date IS NULL";

// Modify the query if a title parameter is passed
if (!empty($title)) {
    $query .= " AND a.title LIKE :title";
}
if (!empty($nameCategory)) {
    $query .= " AND c.name_category LIKE :nameCategory";
}
if (!empty($minPrice)) {
    $query .= " AND p.price >= :minPrice";
}
if (!empty($maxPrice)) {
    $query .= " AND p.price <= :maxPrice";
}

$query .= " ORDER BY RAND() LIMIT 10";

try {
    $stmt = $pdo->prepare($query);
    if (!empty($title)) {
        $stmt->bindValue(':title', "%{$title}%");
    }
    if (!empty($nameCategory)) {
        $stmt->bindValue(':nameCategory', "%{$nameCategory}%");
    }
    if (!empty($minPrice)) {
        $stmt->bindValue(':minPrice', $minPrice);
    }
    if (!empty($maxPrice)) {
        $stmt->bindValue(':maxPrice', $maxPrice);
    }
    $stmt->execute();
    $ads = $stmt->fetchAll(PDO::FETCH_ASSOC);
    header('Content-Type: application/json');
    echo json_encode(['ads' => $ads]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}