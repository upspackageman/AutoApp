<?php
require_once '../vendor/autoload.php';
require '../Config/Database.php';
require '../Models/User.php';
header("Access-Control-Allow-Origin: *"); // Allow all origins, or specify your Angular app's URL
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

use Models\User;
use Config\Database;

class AuthController {
    private $secretKey = 'your_secret_key_here';
    private $user;

    public function __construct() {
        $dbConnection = (new Database())->conn;
        $this->user = new User($dbConnection);
       
    }

    // Login and generate JWT
    public function login($data) {

        $login = $data['login'] ?? '';
        $password = $data['password'] ?? '';

        // Verify user credentials
        $user = $this->user->verifyCredentials($login, $password);

        if ($user) {
            $issuedAt = time();
            $expirationTime = $issuedAt + 3600; // Token valid for 1 hour

            $payload = [
                'iat' => $issuedAt,
                'exp' => $expirationTime,
                'username' => $user['username'],
                'email' => $user['email']
            ];

            // Encode the payload to create a JWT
            $jwt = JWT::encode($payload, $this->secretKey, 'HS256');

            return [
                'status' => 'success',
                'token' => $jwt
            ];
        } else {
            http_response_code(401);
            return [
                'status' => 'error',
                'message' => 'Invalid login or password'
            ];
        }
    }

    // Verify JWT
    public function verifyToken($token) {
        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            return [
                'status' => 'success',
                'data' => (array)$decoded
            ];
        } catch (Exception $e) {
            http_response_code(401);
            return [
                'status' => 'error',
                'message' => 'Invalid token'
            ];
        }
    }
}

//===================================================================== Routing logic===========================================================================================
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];
$data = json_decode(file_get_contents('php://input'), true); // Get POST data
$path = str_replace(dirname($scriptName), '', $requestUri);
$path = trim($path, '/');
$pathParts = explode('/', $path);
$authcontroller = new AuthController();
if (count($pathParts) > 1) {
    $functionName = $pathParts[1];
    $functionName = explode('?', $functionName)[0];
   
    if ($functionName === 'login' && $data) {
       
        $response = $authcontroller->login($data);
        echo json_encode($response);

    }else {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Invalid function or missing parameters.']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Function not specified.']);
}
?>
