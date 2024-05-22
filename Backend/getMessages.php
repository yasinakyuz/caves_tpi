<?php
/**
 * @file         getMessages.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      22.05.2024
 */

// get messages


ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
require 'dbConnector.php';
$pdo = openDBConnection();
session_start();

//$data = json_decode(file_get_contents("php://input"), true);
$currentUserId = $_SESSION['user_id'] ?? null;

if ($currentUserId) {
    $query = "SELECT m.message_text, m.sent_time, u.name, u.firstname, a.title, a.id as ad_id
              FROM messages m
              JOIN users u ON u.id = m.buyer_id
              JOIN announcements a ON a.id = m.announcement_id
              WHERE a.users_idusers = ?
              ORDER BY m.sent_time DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute([$currentUserId]);
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'messages' => $messages]);
} else {
    echo json_encode(['success' => false, 'error' => 'User not authenticated']);
}


