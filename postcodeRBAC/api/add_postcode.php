<?php
include '../helpers/db_connect.php';
include '../helpers/functions.php';

header('Content-Type: application/json');

// Allow only authenticated users to add postcode
session_start();
if (!isset($_SESSION['userID'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(["success" => false, "message" => "You must be logged in to add a postcode."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postcode = sanitizeInput($_POST['postcode']);
    $userID = $_SESSION['userID'];

    // If the postcode is valid, add it to the database
    if (validatePostcode($postcode)) {
        // Check if the postcode already exists
        if (isPostCodeDuplicate($conn, $postcode)) {
            // Postcode already exists
            http_response_code(400); // Bad Request
            echo json_encode(['success' => false, 'message' => 'Duplicate postcode']);
        } else {
            // Prepare an SQL statement for inserting a postcode into 'tbl_postcodes' table
            $stmt = $conn->prepare("INSERT INTO tbl_postcodes (postcode, userID) VALUES (?, ?)");
            
            // Bind the parameter to the prepared statement
            // 'si' specifies the types of the parameters (string, integer)
            $stmt->bind_param('si', $postcode, $userID);

            // Execute the prepared statement
            if ($stmt->execute()) {
                http_response_code(200); // OK
                echo json_encode(['success' => true, 'message' => 'Postcode added successfully']);
            } else {
                http_response_code(500); // Internal Server Error
                echo json_encode(['success' => false, 'message' => 'Internal server error']);
            }

            // Close the prepared statement to free up resources
            $stmt->close();
        }
    } else {
        // Postcode is invalid
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Invalid postcode']);
    }
} else {
    // Method Not Allowed
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>