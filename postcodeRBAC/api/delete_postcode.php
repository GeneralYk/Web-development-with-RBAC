<?php
include '../helpers/db_connect.php';
include '../helpers/functions.php';

header('Content-Type: application/json');

// Allow only authenticated users to delete postcode
session_start();
if (!isset($_SESSION['userID'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $postcodeID = sanitizeInput($_POST['postcodeID']);
    $userID = $_SESSION['userID'];
    $isSuperUser = isSuperUser($conn, $_SESSION['userID']);

    if ($isSuperUser) {
        // Superuser can delete any postcode, no userID check
        $stmt = $conn->prepare("DELETE FROM tbl_postcodes WHERE postcodeID = ?");
        // Bind the parameter to the prepared statement
        // 'i' specifies the types of the parameters (integer)
        $stmt->bind_param('i', $postcodeID);
    } else {
        // Regular user can only delete their own postcodes
        // Prepare an SQL statement for deleting a postcode in 'tbl_postcodes' table where the postcodeID is in 'tbl_postcodes'
        $stmt = $conn->prepare("DELETE FROM tbl_postcodes WHERE postcodeID = ? AND userID = ?");
        // Bind the parameter to the prepared statement
        // 'ii' specifies the types of the parameters (integer, integer)
        $stmt->bind_param('ii', $postcodeID, $userID);
    }

    // Execute the prepared statement
    if ($stmt->execute()) {
        http_response_code(200); // OK
        echo json_encode(['success' => true, 'message' => 'Postcode deleted successfully']);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => 'Internal server error']);
    }

    // Close the prepared statement to free up resources
    $stmt->close();
} else {
    // Method Not Allowed
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
