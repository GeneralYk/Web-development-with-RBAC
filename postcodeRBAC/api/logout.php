<?php
session_start();
session_unset();
session_destroy();

header('Content-Type: application/json');

http_response_code(200); // OK
echo json_encode(["success" => true, "message" => "Logout successful."]);
?>
