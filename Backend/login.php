<?php
/**
 * @file         login.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      02.05.2024
 */

header('Access-Control-Allow-Origin: *');
ob_start();


session_start();
require_once 'dbConnector.php'; //name bdd
$conn = openDBConnection();


$email =$_POST['email'];
$password =$_POST['password'];

if ($conn){
    $stmt = $conn->prepare("SELECT * FROM users WHERE e_mail = ?");
    $stmt -> bindParam(1, $email);
    $stmt -> execute();
    //$result = $stmt -> get_result();

}


if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
    //$user = $result ->fetch_assoc();
    $raw_password =$_POST['password'];
    $hashed_password_from_database = $user['password'];

    if (password_verify($raw_password,$hashed_password_from_database)){
        //user verified, get login credentials
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_logged_in'] = true;
        echo 'success';
    }  else{
        echo 'failed';
    }


}

$stmt= null;
$conn= null;
?>