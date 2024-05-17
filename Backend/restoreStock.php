<?php
/**
 * @file         restoreStock.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      17.05.2024
 */


header('Content-Type: application/json');
require 'dbConnector.php';
$pdo = openDBConnection();

$productId = isset($_GET['productId']) ? $_GET['productId'] : die(json_encode(['error' => 'Product ID is required']));
$restoreAmount = isset($_GET['restoreAmount']) ? $_GET['restoreAmount'] : die(json_encode(['error' => 'Restore amount is required']));

// Stok miktarını geri yükle
$query = "UPDATE products SET stock = stock + ? WHERE id = ?";
$stmt = $pdo->prepare($query);
$success = $stmt->execute([$restoreAmount, $productId]);

if ($success) {
    echo json_encode(['success' => 'Stock restored successfully']);
} else {
    echo json_encode(['error' => 'Failed to restore stock']);
}

