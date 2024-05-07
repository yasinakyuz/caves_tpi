/**
* @file         dbConnector.php
* @brief        this file is designed to
* @author       Created by YSA
* @version      01.05.2024
*/

<?php
header('Access-Control-Allow-Origin: *');
function openDBConnection(){
    $servername = "localhost";
    $username = "user_caves";
    $password = "password";
    $dbname = "caves";
    $port = '3306';


    // Create connection
    try {
        $conn = new PDO("mysql:host=$servername; port = $port; dbname=$dbname", $username, $password );

        $conn ->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


    } catch(PDOException $exception){
        echo 'Connection error: ' . $exception->getMessage();

    }
    return $conn;
}


?>