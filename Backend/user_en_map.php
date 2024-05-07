<?php
/**
 * @file         user_en_map.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      02.05.2024
 */


header('Content-Type: application/json');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

session_start();

require_once 'dbConnector.php';
$conn = openDBConnection();

if(isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
    $stmt = $conn->prepare("SELECT street, building_number, postal_code, city, canton FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $userAddress = $stmt->fetch(PDO::FETCH_ASSOC);

    if($userAddress) {
        echo json_encode($userAddress);
    } else {
        echo json_encode(['error' => 'No address found for this user.']);
    }
} else {
    echo json_encode(['error' => 'User not logged in.']);
}