<?php
include '../helpers/db_connect.php';
include '../helpers/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = sanitizeInput($_POST['username']);
    $password = sanitizeInput($_POST['password']);
    
    validateUserInput($username, $password);

    // Handle login
    $response = handleLogin($conn, $username, $password);


    if ($response['success']) {
        http_response_code(200); // OK
    } else {
        http_response_code(400); // Bad Request
    }

    echo json_encode($response);
    $conn->close();
} else {
    // Method Not Allowed
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
