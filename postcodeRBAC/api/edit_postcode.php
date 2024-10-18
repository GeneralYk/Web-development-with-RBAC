<?php
include '../helpers/db_connect.php';
include '../helpers/functions.php';

header('Content-Type: application/json');

// Allow only authenticated users to edit postcode
// Check if user is logged in and is a super user
session_start();
if (!isset($_SESSION['userID'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postcodeID = sanitizeInput($_POST['postcodeID']);
    $newPostcode = sanitizeInput($_POST['newPostcode']);
    $userID = $_SESSION['userID'];
    $isSuperUser = isSuperUser($conn, $_SESSION['userID']);

    // If the new postcode is valid
    if (validatePostcode($newPostcode)) {
        if ($isSuperUser) {
            // Superuser can edit any postcode, no userID check
            // Prepare an SQL statement for updating a postcode in 'tbl_postcodes' table where the postcodeID is in 'tbl_postcodes'
            $stmt = $conn->prepare("UPDATE tbl_postcodes SET postcode = ? WHERE postcodeID = ?");
            // Bind the parameter to the prepared statement as a string and an integer
            // 's' specifies the type string of the $newPostcode parameter
            // 'i' specifies the type integer of the $postcodeID parameter
            $stmt->bind_param('si', $newPostcode, $postcodeID);
        } else {
            // Regular user can only edit their own postcodes
            // Prepare an SQL statement for updating a postcode in 'tbl_postcodes' table where the postcodeID is in 'tbl_postcodes'
            $stmt = $conn->prepare("UPDATE tbl_postcodes SET postcode = ? WHERE postcodeID = ? AND userID = ?");
            
            // Bind the parameter to the prepared statement as a string and an integer
            // 's' specifies the type string of the $newPostcode parameter
            // 'i' specifies the type integer of the $postcodeID parameter
            $stmt->bind_param('sii', $newPostcode, $postcodeID, $userID);
        }

        // Execute the prepared statement
        if ($stmt->execute()) {
            http_response_code(200); // OK
            echo json_encode(['success' => true, 'message' => 'Postcode updated successfully']);
        } else {
            http_response_code(500); // Internal Server Error
            echo json_encode(['success' => false, 'message' => 'Internal server error']);
        }

        // Close the prepared statement to free up resources
        $stmt->close();
    } else {
        // New postcode is invalid
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Invalid postcode']);
    }
} else {
    // Method Not Allowed
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
