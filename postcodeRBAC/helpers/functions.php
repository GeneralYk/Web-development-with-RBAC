<?php
/**
 * Sanitize user input
 */
function sanitizeInput($input) {
    // Strip whitespace (or other characters) from the beginning and end of a string
    return trim($input);
}

/**
 * Check and validate username and password fields
 */
function validateUserInput($username, $password) {
    if (empty($username) || empty($password)) {
         // Bad Request
        http_response_code(400);

        // Return response as JSON
        return json_encode(["success" => false, "message" => "Please fill all required fields."]);
    }
}

/**
 * Check if a user exists in the database
 */
function userExistsInDB($conn, $username) {
    // Prepare an SQL statement for selecting a user with username from the 'tbl_users' table
    $stmt = $conn->prepare("SELECT * FROM tbl_users WHERE username = ?");

    // Bind the parameter to the prepared statement as a string
    // 's' specifies the type of the parameter
    $stmt->bind_param("s", $username);

    // Execute the prepared statement
    $stmt->execute();

    // Store the result of the query
    $stmt->store_result();

    // Check if any rows were returned by the query (indicating that a user with the given username exists)
    $result = $stmt->num_rows > 0;

    // Close the prepared statement to free up resources
    $stmt->close();

    // Return the result of the user existence check
    return $result;
}


/**
 * Retrieve a user record from the database based on the provided username
 */
function getUserRecordInDB($conn, $username) {
    // Prepare an SQL statement for selecting a user with the given username from the 'tbl_users' table
    $stmt = $conn->prepare("SELECT * FROM tbl_users WHERE username = ?");

    // Bind the parameter to the prepared statement as a string
    // 's' specifies the type of the parameter
    $stmt->bind_param("s", $username);

    // Execute the prepared statement
    $stmt->execute();

    // Retrieve the result set of the executed statement
    $result = $stmt->get_result();

    // Fetch the associated array (representing the user record) from the result set
    $user = $result->fetch_assoc();

    // Close the prepared statement to free up resources
    $stmt->close();

    // Return the user record
    return $user;
}

/**
 * Add a new user to the database
 */
function addUserToDB($conn, $username, $passwordHash) {
    // Prepare an SQL statement for inserting a new user(username & password) into the 'tbl_users' table
    $stmt = $conn->prepare("INSERT INTO tbl_users (Username, Password) VALUES (?, ?)");

    // Bind parameters to the prepared statement as string
    // 'ss' specifies the types of the parameters
    $stmt->bind_param("ss", $username, $passwordHash);
    $result = $stmt->execute();

    // Close the prepared statement to free up resources
    $stmt->close();

    // Return the result of the execution (true if successful, false otherwise)
    return $result;
}

/**
 * Verify the password
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Handle login
 */
function handleLogin($conn, $username, $password) {
    // Fetch user record from database
    $user = getUserRecordInDB($conn, $username);

    // If the user does not exist
    if (!$user) {
        return ["success" => false, "message" => "Invalid username or password."];
    }

    // Verify user password
    if (verifyPassword($password, $user['Password'])) {
        session_start();
        $_SESSION['userID'] = $user['userID'];
        $_SESSION['username'] = $user['Username'];
        return ["success" => true, "message" => "Login successful."];
    } else {
        return ["success" => false, "message" => "Invalid username or password."];
    }
}

function isSuperUser($conn, $userID) {
    // Prepare an SQL statement for selecting a user with the given username from the 'tbl_users' table
    $stmt = $conn->prepare("SELECT role FROM tbl_users WHERE userID = ?");

    // Bind the parameter to the prepared statement as a string
    // 's' specifies the type of the parameter
    $stmt->bind_param("i", $userID);

    // Execute the prepared statement
    $stmt->execute();

    // Retrieve the result set of the executed statement
    $result = $stmt->get_result();

    // Fetch the associated array (representing the user record) from the result set
    $user = $result->fetch_assoc();

    // Close the prepared statement to free up resources
    $stmt->close();

    // Return boolean if user is superuser
    return $user && $user['role'] === 'superuser';
}

/**
 * Validate postcode
 */
function validatePostcode($postcode) {
    // URL to validate postcode
    $url = "https://api.postcodes.io/postcodes/{$postcode}/validate";

    // Get the response from the requested URL
    $response = file_get_contents($url);

    // Decode the response
    $validation = json_decode($response, true);

    // Return the validation result
    return $validation['result'];
}

/**
 * Check if the postcode is already in the database
 */
function isPostCodeDuplicate($conn, $postcode) {
    // Prepare an SQL statement for counting the occurrence of a postcode in 'tbl_postcodes' table
    $stmt = $conn->prepare("SELECT COUNT(*) FROM tbl_postcodes WHERE postcode = ?");
    
    // Bind the parameter to the prepared statement as a string
    // 's' specifies the type of the parameter
    $stmt->bind_param('s', $postcode);

    // Execute the prepared statement
    $stmt->execute();

    // Retrieve the result set of the executed statement
    $stmt->bind_result($count);
    $stmt->fetch();

    // Close the prepared statement to free up resources
    $stmt->close();

    // Return a true if the postcode count > zero, otherwise return false
    return $count > 0;
}

/**
 * Fetches the postcodes from the database
 */
function fetchPostcodes($conn) {
    // Prepare an SQL statement for selecting all postcodes from 'tbl_postcodes' table
    $stmt = $conn->prepare("SELECT * FROM tbl_postcodes");

    // Execute the prepared statement
    $stmt->execute();

    // Retrieve the result set of the executed statement
    $result = $stmt->get_result();

    // Store the result
    $postcodes = [];

    // Push items onto the result
    while ($row = $result->fetch_assoc()) {
        array_push($postcodes, $row);
    }

    // Close the prepared statement to free up resources
    $stmt->close();

    // Return the postcodes result
    return $postcodes;
}

/**
 * Search for postcodes in the database
 */
function searchPostcodes($conn, $searchTerm) {
    // Prepare an SQL statement for selecting a postcode from 'tbl_postcodes' table
    $stmt = $conn->prepare("SELECT * FROM tbl_postcodes WHERE postcode LIKE ?");

    // Allow partial matching of strings in a database search
    $searchTerm = '%' . $searchTerm . '%';

    // Bind the parameter to the prepared statement as a string
    // 's' specifies the type of the parameter
    $stmt->bind_param("s", $searchTerm);

    // Execute the prepared statement
    $stmt->execute();

    // Retrieve the result set of the executed statement
    $result = $stmt->get_result();

    // Store the result
    $postcodes = [];

    // Push items onto the result
    while ($row = $result->fetch_assoc()) {
        array_push($postcodes, $row);
    }

    // Close the prepared statement to free up resources
    $stmt->close();

    // Return the postcodes result
    return $postcodes;
}

/**
 * Fetch the details for the given postcodeID
 */
function fetchPostcodeDetail($conn, $postcodeID) {
    // Prepare an SQL statement for selecting a postcode from 'tbl_postcodes' table
    $stmt = $conn->prepare("SELECT postcode FROM tbl_postcodes WHERE postcodeID = ?");

    // Bind the parameter to the prepared statement as an integer
    // 'i' specifies the type of the parameter
    $stmt->bind_param('i', $postcodeID);

    // Execute the prepared statement
    $stmt->execute();

    // Retrieve the result set of the executed statement
    $result = $stmt->get_result();

    // Check if any rows were returned by the query (indicating that a postcode with the given ID exists)
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Postcode not found']);
        exit;
    }

    // Close the prepared statement to free up resources
    $stmt->close();

    // Return the postcode result
    return $result->fetch_assoc();
}
?>