<?php
include '../helpers/db_connect.php';
include '../helpers/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get the postcodeID from the query string
    $postcodeID = isset($_GET['postcodeID']) ? $_GET['postcodeID'] : null;

    // Check if the postcodeID is present in the query string
    if (!$postcodeID) {
        echo json_encode(['success' => false, 'message' => 'Postcode ID is missing']);
        exit;
    }

    // Fetch the details for the given postcodeID
    $postcode = fetchPostcodeDetail($conn, $postcodeID);
    $conn->close();

    echo json_encode(["success" => true, "message" => "Postcode detail fetched successfully!", "postcode" => $postcode['postcode']]);
} else {
    // Method Not Allowed
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>