<?php
// Load environment variables from .env file without external package
// Check if .env file exists
function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        return false;
    }

    // Read the environment variables from .env file
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        if (!array_key_exists($name, $_ENV)) {
            $_ENV[$name] = $value;
        }
    }
    return true;
}

// Load the .env file
loadEnv(__DIR__ . '/../.env');

// Access the environment variable
$myEnvVar = $_ENV['DB_HOST'] ?? 'default_value';
?>
