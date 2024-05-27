<?php
/**
 * @file         sendMessages.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      22.05.2024
 */

//send messages

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require 'dbConnector.php';
$pdo = openDBConnection();
session_start();

$currentUserId = $_SESSION['user_id'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $message_text = $data['message'] ?? null;
    $announcement_id = $data['announcement_id'] ?? null;
    //$buyer_id = $currentUserId;
    $buyer_id = $data['original_buyer_id'] ?? $currentUserId;  //Si original_buyer_id est défini, utilisez-le, sinon utilisez l'ID de session

    if (!$message_text || !$announcement_id || !$buyer_id) {
        echo json_encode(['success' => false, 'error' => 'Invalid input data']);
        exit;
    }
    // Récupérez le seller_id dans la table des annonces en fonction de l'annonce_id
    $seller_id_query = "SELECT users_idusers FROM announcements WHERE id = ?";
    $stmt = $pdo->prepare($seller_id_query);
    $stmt->execute([$announcement_id]);
    $seller_id = $stmt->fetchColumn();

    if ($seller_id) {
        // Insérez le message dans le tableau des messages
        $insert_query = "INSERT INTO messages (buyer_id, seller_id, announcement_id, message_text, sent_time) VALUES (?, ?, ?, ?, NOW())";
        $stmt = $pdo->prepare($insert_query);
        $stmt->bindParam(1, $buyer_id, PDO::PARAM_INT);
        $stmt->bindParam(2, $seller_id, PDO::PARAM_INT);
        $stmt->bindParam(3, $announcement_id, PDO::PARAM_INT);
        $stmt->bindParam(4, $message_text, PDO::PARAM_STR);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => $message_text]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to execute insert query', 'details' => $stmt->errorInfo()]);
        }
        /*
        if ($stmt->execute([$buyer_id, $seller_id, $announcement_id, $message_text])) {
            echo json_encode(['success' => true, 'message' => $message_text]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to execute insert query']);
        }*/
    } else {
        echo json_encode(['success' => false, 'error' => 'Seller not found for the given announcement']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}


