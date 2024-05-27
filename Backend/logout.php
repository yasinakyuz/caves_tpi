<?php
/**
 * @file         logout.php
 * @brief        this file is designed to
 * @author       Created by YSA
 * @version      02.05.2024
 */
header('Access-Control-Allow-Origin: *');
session_start();
session_unset();  // Effacer toutes les variables de session
session_destroy(); //destroy session

include 'dbConnector.php';

$_SESSION = array();
if (ini_get("session.use_cookies")){
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["secure"], $params["domain"], $params["httponly"]);
}
echo 'success';
echo "You have been logged out.";

