<?php
include '../helpers/functions.php';
include '../helpers/db_connect.php';
header('Content-Type: application/json');
session_start();

$response = array('loggedIn' => false);

if (isset($_SESSION['userID'])) {
    $response['loggedIn'] = true;
    $response['loggedInUserID'] = $_SESSION['userID'];
    $response['isAdmin'] = isSuperUser($conn, $_SESSION['userID']);
}

echo json_encode($response);
?>