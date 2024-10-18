<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (!isset($_GET['postcode'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Postcode is required']);
        exit;
    }

    $postcode = rawurlencode($_GET['postcode']);
    $url = "https://api.postcodes.io/postcodes/{$postcode}";

    $response = file_get_contents($url);

    if (!$response) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['success' => false, 'message' => 'Failed to fetch postcode details']);
        exit;
    }

    $data = json_decode($response, true);

    if (isset($data['status']) && $data['status'] == 200) {
        echo json_encode(['success' => true, 'data' => $data['result']]);
    } else {
        http_response_code(404); // Not found
        echo json_encode(['success' => false, 'message' => 'Postcode not found']);
    }
} else {
    // Method Not Allowed
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>
