<?php
include '../helpers/db_connect.php';
include '../helpers/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch postcodes
    $postcodes = fetchPostcodes($conn);
    $conn->close();

    echo json_encode(["success" => true, "message" => "Postcodes fetched successfully!", "postcodes" => $postcodes]);
} else {
    // Method Not Allowed
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>