<?php
include '../helpers/db_connect.php';
include '../helpers/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $searchTerm = sanitizeInput($_POST['search']);

    if (!empty($searchTerm)) {
        // Search for postcodes
        $postcodes = searchPostcodes($conn, $searchTerm);

        if(count($postcodes) > 0) {
            echo json_encode(["success" => true, "message" => "Postcode found!", "postcodes" => $postcodes]);
        } else {
            echo json_encode(["success" => false, "message" => "No postcode found matching the search term."]);
        }
        exit;
    } else {
        // Fetch all postcodes if search term is empty
        $postcodes = fetchPostcodes($conn);
        echo json_encode(["success" => true, "message" => "Postcodes fetched successfully!", "postcodes" => $postcodes]);
    }

    $conn->close();

    
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
