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


$productId = isset($_GET['productId']) ? $_GET['productId'] : die(json_encode(['error' => 'L ID du produit est requis']));
$decreaseAmount = isset($_GET['decreaseAmount']) ? $_GET['decreaseAmount'] : die(json_encode(['error' => 'Une diminution du montant est requise']));
// Stok miktarını azalt
$query = "UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?";
$stmt = $pdo->prepare($query);
if ($stmt) {
    $success = $stmt->execute([$decreaseAmount, $productId, $decreaseAmount]);
    if ($success && $stmt->rowCount() > 0) {
        echo json_encode(['success' => 'Stock mis à jour avec succès']);
    } else {
        echo json_encode(['error' => 'Échec de la mise à jour du stock ou stock insuffisant']);
    }
} else {
    echo json_encode(['error' => 'Échec de la préparation de la requête SQL']);
}
