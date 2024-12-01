<?php
namespace Controllers;

require '../vendor/autoload.php';  // Ensure this line is included to load Composer's autoloader
require '../Config/Database.php';
require '../Models/Visitor.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

use Models\Visitor;
use Config\Database;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;


class VisitedUsersController {

    private $model;
    
    public function __construct() {
        $dbConnection = (new Database())->conn; // Get database connection
        
        $this->model = new Visitor($dbConnection);
       
    }

function getClientIP( ) {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}


function getTrack(){
    $ip_address = $this->getClientIP();
    $visited_page = $_POST['page']; // Assuming the page is sent from Angular
    $timestamp = date("Y-m-d H:i:s");
    $ip_info = $this->geolocationIP($ip_address);


    $result = $this->model->logVisitor($ip_address, $visited_page, $timestamp, $ip_info['country_name'], $ip_info['country_code'],$ip_info['city']);
    //$this->renderResponse($result);
}

// Render the JSON response
private function renderResponse($data) {
    header('Content-Type: application/json');
    echo json_encode($data);
}

function geolocationIP($ip){
    
    // Corrected API URL for JSON response
    $apiUrl = 'https://api.hostip.info/get_json.php?ip='.$ip.'&position=true';

    // Create a new Guzzle client instance
    $client = new Client([
        'verify' => false, // Disable SSL verification
    ]);

    ob_start();
    try {
        // Make a GET request to the API endpoint
        $response = $client->request('GET', $apiUrl);
        $body = $response->getBody()->getContents(); // Get the response body as a string

        // Decode JSON response
        $geoData = json_decode($body, true);

        header('Content-Type: application/json');
        echo json_encode($geoData, JSON_PRETTY_PRINT); // Pretty print for better readability

        return $geoData;

    }catch(RequestException $e){
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
    ob_end_flush();
}

function getVisitors(){
    $result = $this->model->getVisitors();
    echo json_encode($result);
}


}
//===================================================================== Routing logic===========================================================================================
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];
$path = str_replace(dirname($scriptName), '', $requestUri);
$path = trim($path, '/');
$pathParts = explode('/', $path);
if (count($pathParts) > 1) {
    $functionName = $pathParts[1];
    $functionName = explode('?', $functionName)[0];
    if ($functionName === 'getTrack') {
        $controller = new VisitedUsersController();
        $controller->getTrack();

    } elseif ($functionName === 'getVisitors') {
        $controller = new VisitedUsersController();
        $controller->getVisitors();
    }else {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Invalid function or missing parameters.']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Function not specified.']);
}


