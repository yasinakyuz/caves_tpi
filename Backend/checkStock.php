<?php
/**
 * @file         checkStock.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      17.05.2024
 */

header('Content-Type: application/json');

require 'dbConnector.php';
$pdo = openDBConnection();

$productId = isset($_GET['productId']) ? $_GET['productId'] : die(json_encode(['error' => 'Product ID is required']));
$quantity = isset($_GET['quantity']) ? $_GET['quantity'] : die(json_encode(['error' => 'Quantity is required']));

$query = "SELECT stock FROM products WHERE id = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$productId]);
$product = $stmt->fetch(PDO::FETCH_ASSOC);

if ($product) {
    if ($product['stock'] >= $quantity) {
        echo json_encode(['success' => 'Stock is available']);
    } else {
        echo json_encode(['error' => 'Insufficient stock']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Product not found']);
}
