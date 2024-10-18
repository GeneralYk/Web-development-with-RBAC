<?php
// Load environment variables from .env file
include 'load_env.php';

$servername = $_ENV['HOST'];
$username = $_ENV['USERNAME'];
$dbname = $_ENV['DB_NAME'];
$password = $_ENV['PASSWORD'];

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}
?>
