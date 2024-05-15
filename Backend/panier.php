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
// addToCart.php
session_start();



$productId = $_POST['product_id'];
$quantity = $_POST['quantity'];

// Stokları kontrol et ve rezerve et
$sql = "SELECT stock FROM products WHERE id = :productId";
$stmt = $pdo->prepare($sql);
$stmt->execute(['productId' => $productId]);
$product = $stmt->fetch();

if ($product && $product['stock'] >= $quantity) {
    // Stok yeterli ise rezerve et
    $newStock = $product['stock'] - $quantity;
    $updateSql = "UPDATE products SET reserved_stock = :newStock WHERE id = :productId";
    $updateStmt = $pdo->prepare($updateSql);
    $updateStmt->execute(['newStock' => $newStock, 'productId' => $productId]);

    // Sepete ekle
    $_SESSION['cart'][$productId] = ['quantity' => $quantity, 'timeout' => time() + 300]; // 5 dakika sonunda zaman aşımı
    echo json_encode(['success' => 'Product reserved and added to cart']);
} else {
    echo json_encode(['error' => 'Not enough stock']);
}


// restoreStocks

echo json_encode(['debug' => 'Received request to restore stocks']); // Debug message
if (!empty($_SESSION['cart'])) {

    foreach ($_SESSION['cart'] as $productId => $details) {
        $sql = "UPDATE products SET stock = stock + :quantity WHERE id = :productId";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['quantity' => $details['quantity'], 'productId' => $productId]);
    }
    $_SESSION['cart'] = []; // Sepeti temizle
    echo json_encode(['success' => 'Stocks restored']);
} else{
    echo json_encode(['info' => 'Cart is already empty or session expired']);

}

/*
if (isset($_POST['action']) && $_POST['action'] == 'fetchDetails') {
    // Sepet session'dan alınır
    if (!isset($_SESSION['cart'])) {
        echo json_encode(['error' => 'Cart is empty']);
        exit;
    }

    $productDetails = [];
    foreach ($_SESSION['cart'] as $productId => $quantity) {
        $sql = "SELECT * FROM products WHERE id = :productId";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['productId' => $productId]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($product) {
            $product['quantity'] = $quantity;
            $productDetails[] = $product;
        }
    }

    echo json_encode($productDetails);
}



/*
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['action']) && $_POST['action'] == 'add') {
        $productId = intval($_POST['product_id']);
        $quantity = intval($_POST['quantity']);*/
/*
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