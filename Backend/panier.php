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
/*
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action']) && $_POST['action'] == 'add') {
        $productId = intval($_POST['product_id']);
        $quantity = intval($_POST['quantity']);*/
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'add') {
    $productId = isset($_POST['product_id']) ? intval($_POST['product_id']) : null;
    $quantity = isset($_POST['quantity']) ? intval($_POST['quantity']) : 1;

    // Ensure productId is not null
    if (!$productId) {
        echo json_encode(['error' => 'Product ID is required']);
        exit;
    }
        // Check stock
    $sql = "SELECT stock FROM products WHERE id = :productId";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['productId' => $productId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result) {
        $currentStock = $result['stock'];

        if ($currentStock >= $quantity) {
            // Deduct from stock
            $newStock = $currentStock - $quantity;
            $sql = "UPDATE products SET stock = :newStock WHERE id = :productId";
            $stmt = $pdo->prepare($sql);
            if ($stmt->execute(['newStock' => $newStock, 'productId' => $productId])) {
                // Add to cart
                if (!isset($_SESSION['cart'])) {
                    $_SESSION['cart'] = [];
                }
                if (isset($_SESSION['cart'][$productId])) {
                    $_SESSION['cart'][$productId] += $quantity;
                } else {
                    $_SESSION['cart'][$productId] = $quantity;
                }
                echo json_encode(["success" => "Product added to cart"]);
            } else {
                echo json_encode(["error" => "Error updating stock"]);
            }
        } else {
            echo json_encode(["error" => "Not enough stock"]);
        }
    } else {
        echo json_encode(["error" => "Product not found"]);
    }
} elseif (isset($_POST['action']) && $_POST['action'] == 'list') {
    // List cart items
    if (isset($_SESSION['cart']) && !empty($_SESSION['cart'])) {
        $cartItems = [];
        foreach ($_SESSION['cart'] as $productId => $quantity) {
            $sql = "SELECT title, price FROM products WHERE id = :productId";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['productId' => $productId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                $cartItems[] = [
                    "product_id" => $productId,
                    "title" => $result['title'],
                    "quantity" => $quantity,
                    "price" => $result['price']
                ];
            }
        }
        echo json_encode($cartItems);
    } else {
        echo json_encode([]);
    }

}
?>