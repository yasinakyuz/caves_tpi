<?php
/**
 * @file         panier.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      08.05.2024
 */

header('Access-Control-Allow-Origin: *');
session_start();
require 'dbConnector.php';
$pdo = openDBConnection();

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'addToCart':
        addToCart();
        break;
    case 'removeFromCart':
        removeFromCart();
        break;
    case 'restoreStocks':
        restoreStocks();
        break;
    case 'clearCart':
        clearCart();
        break;
    default:
        echo json_encode(['error' => 'No action specified']);
}

function addToCart() {
    global $pdo;
    $productId = $_POST['product_id'];
    $quantity = $_POST['quantity'];

        // Check stock and reserve
    $stmt = $pdo->prepare("SELECT stock FROM products WHERE id = :productId");
    $stmt->execute(['productId' => $productId]);
    $product = $stmt->fetch();

    if ($product && $product['stock'] >= $quantity) {
        // Update stock
        $newStock = $product['stock'] - $quantity;
        $updateStmt = $pdo->prepare("UPDATE products SET stock = :newStock WHERE id = :productId");
        $updateStmt->execute(['newStock' => $newStock, 'productId' => $productId]);

        // Add to session cart
        echo json_encode(['success' => 'Product reserved and added to cart']);
    } else {
        echo json_encode(['error' => 'Not enough stock']);
    }

}

function removeFromCart() {
    global $pdo;

    $productId = $_POST['product_id'];
    $quantity = $_POST['quantity'];

    $updateStmt = $pdo->prepare("UPDATE products SET stock = stock + :quantity WHERE id = :productId");
    $updateStmt->execute(['quantity' => $quantity, 'productId' => $productId]);
    echo json_encode(['success' => 'Product removed from cart and stock restored']);

}

function restoreStocks() {
    global $pdo;
    if (!empty($_SESSION['cart'])) {
        foreach ($_SESSION['cart'] as $productId => $details) {
            $stmt = $pdo->prepare("UPDATE products SET stock = stock + :quantity WHERE id = :productId");
            $stmt->execute(['quantity' => $details['quantity'], 'productId' => $productId]);
        }
        $_SESSION['cart'] = [];
        echo json_encode(['success' => 'Cart cleared and all stocks restored']);
    } else {
        echo json_encode(['info' => 'Cart is already empty or session expired']);
    }
}
function clearCart() {

    $_SESSION['cart'] = [];
    echo json_encode(['success' => 'Cart cleared']);
}





