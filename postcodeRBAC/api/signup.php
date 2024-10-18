<?php
include '../helpers/db_connect.php';
include '../helpers/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = sanitizeInput($_POST['username']);
    $password = sanitizeInput($_POST['password']);

    // Validate user input
    validateUserInput($username, $password);

    // Check if username already exists
    if (userExistsInDB($conn, $username)) {
        // Bad Request
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Username already taken. Please choose a different one."]);
        exit;
    }

    // Hash the password
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user into the database
    if (addUserToDB($conn, $username, $passwordHash)) {
        // OK
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "User registered successfully! Proceed to login."]);
    } else {
        // Internal Server Error
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
    }

    $conn->close();
} else {
    // Method Not Allowed
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method!"]);
}
?>