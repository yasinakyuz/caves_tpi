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



//$productId = isset($_POST['productId']) ? $_POST['productId'] : die(json_encode(['error' => 'Product ID is required']));
//$restoreAmount = isset($_POST['restoreAmount']) ? $_POST['restoreAmount'] : die(json_encode(['error' => 'Restore amount is required']));

$productId = isset($_GET['productId']) ? $_GET['productId'] : die(json_encode(['error' => 'Product ID is required']));
$restoreAmount = isset($_GET['restoreAmount']) ? $_GET['restoreAmount'] : die(json_encode(['error' => 'Restore amount is required']));

if (null === $productId || null === $restoreAmount) {
    echo json_encode(['error' => 'L ID du produit et le montant de la restauration sont obligatoires et doivent être numériques.']);
    exit;
}
// Restaurer la quantité de stock
$query = "UPDATE products SET stock = stock + ? WHERE id = ?";
$stmt = $pdo->prepare($query);
$success = $stmt->execute([$restoreAmount, $productId]);

if ($success) {
    echo json_encode(['success'=>'Stock restauré avec succès']);
} else {
    echo json_encode(['error'=>'Échec de la restauration du stock']);
}

