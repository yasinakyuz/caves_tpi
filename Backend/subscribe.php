<?php
/**
 * @file         subscribe.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      01.05.2024
 */

header('Access-Control-Allow-Origin: *');
ob_start();

require_once 'dbConnector.php';
$conn = openDBConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and sanitize input
    $name = filter_input(INPUT_POST, 'lastname', FILTER_SANITIZE_STRING);
    $firstname = filter_input(INPUT_POST, 'firstname', FILTER_SANITIZE_STRING);
    $company_name= filter_input(INPUT_POST, 'company', FILTER_SANITIZE_STRING);
    $e_mail = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $street = filter_input(INPUT_POST, 'address', FILTER_SANITIZE_STRING);
    $building_number= filter_input(INPUT_POST, 'no', FILTER_SANITIZE_STRING);
    $postal_code = filter_input(INPUT_POST, 'zip', FILTER_SANITIZE_NUMBER_INT);
    $city = filter_input(INPUT_POST, 'city', FILTER_SANITIZE_STRING);
    $canton = filter_input(INPUT_POST, 'canton', FILTER_SANITIZE_STRING);
    $password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING );
    $confirmPassword = filter_input(INPUT_POST, 'confirm-password', FILTER_SANITIZE_STRING);

    //Check if passwords match
    if ($password !== $confirmPassword) {
        echo 'Passwords do not match.';
        exit;
    }
    
    // Valider la saisie
    if (!filter_var($e_mail, FILTER_VALIDATE_EMAIL)) {
        echo 'Invalid email format';
        exit;
        // ...validate other fields
    }

    // Vérifier si l'utilisateur existe déjà
    $stmt = $conn->prepare("SELECT COUNT(*) FROM users WHERE e_mail = ?");
    $stmt->execute([$e_mail]);
    if ($stmt->fetchColumn() > 0) {
        echo 'User already exists';
        exit;
    }

    // Hash password
    $passwordHash = password_hash($_POST['password'], PASSWORD_DEFAULT);

    // Définir la date
    $current_date = date('Y-m-d');

    // Insérer un utilisateur dans la base de données
    $stmt = $conn->prepare("INSERT INTO users (name, firstname, company_name, e_mail, phone, street, building_number, postal_code, city, canton, register_date, updated_date , password) VALUES (:name, :firstname, :company_name, :e_mail, :phone, :street, :building_number, :postal_code , :city, :canton, :register_date, :updated_date, :password)");
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':firstname', $firstname);
    $stmt->bindParam(':company_name', $company_name);
    $stmt->bindParam(':e_mail', $e_mail);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':street', $street);
    $stmt->bindParam(':building_number', $building_number);
    $stmt->bindParam(':postal_code', $postal_code);
    $stmt->bindParam(':city', $city);
    $stmt->bindParam(':canton', $canton);
    $stmt->bindParam(':register_date', $current_date);
    $stmt->bindParam(':updated_date', $current_date);
    $stmt->bindParam(':password', $passwordHash);

    try {
        $stmt->execute();
        echo 'success';
    } catch(PDOException $exception) {
        echo 'Subscribe error:' . $exception->getMessage();
    }
} else{
    echo 'méthode de requête invalide';
}

