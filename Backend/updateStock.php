<?php
/**
 * @file         updateStock.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      17.05.2024
 */
header('Content-Type: application/json');
require 'dbConnector.php';
$pdo = openDBConnection();


$productId = isset($_GET['productId']) ? $_GET['productId'] : die(json_encode(['error' => 'Product ID is required']));
$decreaseAmount = isset($_GET['decreaseAmount']) ? $_GET['decreaseAmount'] : die(json_encode(['error' => 'Decrease amount is required']));
// Stok miktarını azalt
$query = "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?";
$stmt = $pdo->prepare($query);
if ($stmt) {
    $success = $stmt->execute([$decreaseAmount, $productId, $decreaseAmount]);
    if ($success && $stmt->rowCount() > 0) {
        echo json_encode(['success' => 'Stock updated successfully']);
    } else {
        echo json_encode(['error' => 'Failed to update stock or insufficient stock']);
    }
} else {
    echo json_encode(['error' => 'SQL query preparation failed']);
}
