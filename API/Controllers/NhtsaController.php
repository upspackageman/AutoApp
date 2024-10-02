<?php


require '../vendor/autoload.php'; // Ensure this line is included to load Composer's autoloader
header("Access-Control-Allow-Origin: *"); // Allow all origins, or specify your Angular app's URL
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow specific HTTP methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow specific headers

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

use FFMpeg\FFMpeg;
use FFMpeg\Format\Video\X264;
// use FFMpeg\Coordinate\TimeCode;
// use FFMpeg\Filters\Video\VideoFiltersFacade;

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}


function getVehicleModel($year, $model)
{
    $apiUrl = 'https://api.nhtsa.gov/SafetyRatings/modelyear/' . $year . '/make/' . $model;

    $client = new Client([
        'verify' => false, // Disable SSL verification
    ]);
    $url = $apiUrl;

    try {
        $response = $client->request('GET', $url);
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);

        header('Content-Type: application/json');
        echo json_encode($data);
       
    } catch (RequestException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getVehicleByYear($modelYear)
{
    $apiUrl = 'https://api.nhtsa.gov/SafetyRatings/modelyear/';
    $client = new Client([
        'verify' => false, // Disable SSL verification
    ]);
    $url = $apiUrl . $modelYear;

    try {
        $response = $client->request('GET', $url);
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);

        header('Content-Type: application/json');
        echo json_encode($data);
       
    } catch (RequestException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getComplaints($year, $make, $model)
{
    $apiUrl = "https://api.nhtsa.gov/complaints/complaintsByVehicle?make=$make&model=$model&modelYear=$year";
    $client = new Client([
        'verify' => false, // Disable SSL verification
    ]);

    $url = $apiUrl;

    try {
        $response = $client->request('GET', $url);
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);


        header('Content-Type: application/json');
        echo json_encode($data);
       
    } catch (RequestException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getRecalls($year, $make, $model, $catch = 0)
{

    $apiUrl = "https://api.nhtsa.gov/recalls/recallsByVehicle?make=$make&model=$model&modelYear=$year";
    $client = new Client([
        'verify' => false, // Disable SSL verification
    ]);

    $url = $apiUrl;

    try {
        $response = $client->request('GET', $url);
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);


        header('Content-Type: application/json');
        echo json_encode($data);
    
    } catch (RequestException $e) {

        if ($e->getCode() === 400 && $catch <= 1) {
            $model = preg_replace('/^(\w+\s*\w*)\b.*/i', '$1', $model);
            $catch = $catch + 1;

            getRecalls($year, $make, $model, $catch);
        }
        if ($e->getCode() === 400 && $catch > 1) {
            header('Content-Type: application/json');
            echo json_encode('{"Count":0,"Message":"Results returned successfully","results":[]}');
        }
        if ($e->getCode() !== 400) {
            header('Content-Type: application/json');
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}

function getVehicleCrashRating($id)
{
    $apiUrl = 'https://api.nhtsa.gov/SafetyRatings/VehicleId/';
    $client = new Client([
        'verify' => false, // Disable SSL verification
    ]);
    $url = $apiUrl . $id;

    try {
        $response = $client->request('GET', $url);
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);
        header('Content-Type: application/json');
        echo json_encode($data);
       
    } catch (RequestException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function carSeatInspectionLocatorByState($state)
{
    $apiUrl = 'https://api.nhtsa.gov/CSSIStation/state/';
    $client = new Client([
        'verify' => false, // Disable SSL verification
    ]);
    $url = $apiUrl . $state;

    try {
        $response = $client->request('GET', $url);
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);

        foreach ($data['Results'] as $key => $vehicle) {
            if ($vehicle['Phone1'] === '000-000-0000' ||  $vehicle['Phone1'] === '00000' ||  $vehicle['Phone1'] === '0000' && $vehicle['Email'] === null) {
                unset($data['Results'][$key]);
            }
        }

        $data = json_decode($body, true);
        header('Content-Type: application/json');
        echo json_encode($data);
    } catch (RequestException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function carSeatInspectionLocatorByZip($zip)
{
    $apiUrl = 'https://api.nhtsa.gov/CSSIStation/zip/';
    $client = new Client([
        'verify' => false, // Disable SSL verification
    ]);
    $url = $apiUrl . $zip;
    try {
        $response = $client->request('GET', $url);
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);
        header('Content-Type: application/json');
        echo json_encode($data);

    } catch (RequestException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}


function getVehicleCrashRatingId($year, $make, $model)
{

    $apiUrl = "https://api.nhtsa.gov/SafetyRatings/modelyear/$year/make/$make/model/$model";

    $client = new Client([
        'verify' => false, // Disable SSL verification
    ]);

    $url = $apiUrl;

    try {
        $response = $client->request('GET', $url);
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);

        header('Content-Type: application/json');
        echo json_encode($data);
    } catch (RequestException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function getVehicleInvestigation($start, $end, $offset = 0)
{
    $apiUrl = "https://api.nhtsa.gov/safetyIssues/byDate?offset=$offset&max=50&sort=id&amp=[, , , ]&dateEnd=$end&dateStart=$start&issueType=investigation&name=&countOverRide=50";
    $url = $apiUrl;

    $client = new Client([
        'verify' => false, // Disable SSL verification
    ]);

    try {
        $response = $client->request('GET', $url);
        $body = $response->getBody()->getContents();
        $data = json_decode($body, true);
        //  echo $data;

        header('Content-Type: application/json');
        $data['meta']['pagination']['currentUrl'] = ['start' => $start, 'end' => $end, 'offset' => $offset];
        if ($data['meta']['pagination']['nextUrl'] !== null) {
            $_offset = 0;
            $_offset = $offset + 50;
            $data['meta']['pagination']['nextUrl'] = ['start' => $start, 'end' => $end, 'offset' => $_offset];
        }

        if ($data['meta']['pagination']['previousUrl'] !== null) {
            $_offset = 0;
            $_offset = $offset - 50;
            $data['meta']['pagination']['previousUrl'] = ['start' => $start, 'end' => $end, 'offset' => $_offset];
        }

        echo json_encode($data);
    } catch (RequestException $e) {
        header('Content-Type: application/json');
        echo json_encode(['error' => $e->getMessage()]);
    }
}

function videoPlayback($image)
{
    $videoUrl = $image;
    $tempWmvFile = '/var/www/html/tmp/temp_video.wmv'; // Temporary WMV file path
    $tempMp4File = '/var/www/html/tmp/temp_video.mp4'; // Temporary MP4 file path

    // Step 1: Download the WMV file
    $ch = curl_init($videoUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $wmvContent = curl_exec($ch);
    curl_close($ch);

    if ($wmvContent === false || file_put_contents($tempWmvFile, $wmvContent) === false) {
        die("Failed to download or save WMV file. {$tempWmvFile}");
    }

    // Step 2: Convert WMV to MP4 using PHP-FFMpeg
    try {
        $ffmpeg = FFMpeg::create([
            'ffmpeg.binaries'  => '/usr/bin/ffmpeg', // Adjust path to your ffmpeg binary
            'ffprobe.binaries' => '/usr/bin/ffprobe', // Adjust path to your ffprobe binary
        ]);
        
        $video = $ffmpeg->open($tempWmvFile);
        $format = new X264();
        $format->setAudioCodec('aac'); // Ensure audio codec is set

        // Optimizations for faster conversion
        $format->setKiloBitrate(1500); // Set bitrate (adjust as needed)
        $format->setAdditionalParameters(['-preset', 'fast', '-threads', '4']); // Use multi-threading and a faster preset


        // Set the desired resolution (e.g., 1280x720)
        $format->setAdditionalParameters(['-preset', 'fast', '-threads', '4', '-vf', 'scale=1280:720']); // Set resolution and use multi-threading
        $video->save($format, $tempMp4File);

        // Check if the MP4 file was created
        if (!file_exists($tempMp4File) || filesize($tempMp4File) === 0) {
            die('MP4 file conversion failed or file is empty.');
        }

        // Step 3: Serve the MP4 file
        $contentType = 'video/mp4';
        $contentLength = filesize($tempMp4File);

        // Set headers
        header("Content-Type: $contentType");
        header("Accept-Ranges: bytes");
        header("Content-Length: $contentLength");

        $range = 0;
        $length = $contentLength - 1;

        if (isset($_SERVER['HTTP_RANGE'])) {
            $range = $_SERVER['HTTP_RANGE'];
            list(, $range) = explode('=', $range, 2);
            list($start, $end) = explode('-', $range);

            $start = intval($start);
            $end = $end === "" ? $length : intval($end);

            if ($start > $end || $end >= $contentLength) {
                header("HTTP/1.1 416 Requested Range Not Satisfiable");
                exit;
            }

            $length = $end - $start + 1;

            // Send partial content headers
            header("HTTP/1.1 206 Partial Content");
            header("Content-Range: bytes $start-$end/$contentLength");
            header("Content-Length: " . $length);

            // Read and output the specific byte range
            $fp = fopen($tempMp4File, 'rb');
            fseek($fp, $start);
            echo fread($fp, $length);
            fclose($fp);
        } else {
            // Read and output the entire file
            readfile($tempMp4File);
        }

        // Clean up temporary files
        unlink($tempWmvFile);
        unlink($tempMp4File);
    } catch (\Exception $e) {
        die('Error: ' . $e->getMessage());
    }
}


function getPdfFile($link)
{
    $pdfContent = @file_get_contents($link);

    if ($pdfContent === FALSE) {
        http_response_code(404);
        echo 'Video not found';
        exit;
    }

    header('Content-Type: application/pdf');
    header('Content-Length: ' . strlen($pdfContent));

    // Output the video content
    echo $pdfContent;
}

//===================================================================== Routing logic===========================================================================================
$requestUri = $_SERVER['REQUEST_URI'];
$scriptName = $_SERVER['SCRIPT_NAME'];
$path = str_replace(dirname($scriptName), '', $requestUri);
$path = trim($path, '/');
$pathParts = explode('/', $path);

// Check which function to call based on the URL path
if (count($pathParts) > 1) {
    $functionName = $pathParts[1];
    $functionName = explode('?', $functionName)[0];
    
    if ($functionName === 'getPdfFile' && isset($_GET['link'])) {
        $link = $_GET['link'];
        getPdfFile($link);

    } elseif ($functionName === 'videoPlayback' && isset($_GET['image'])) {
        $image = $_GET['image'];
        videoPlayback($image);

    } elseif ($functionName === 'getVehicleInvestigation' && isset($_GET['start']) && isset($_GET['end']) && isset($_GET['offset'])) {
        $start = $_GET['start'];
        $end = $_GET['end'];
        $offset = filter_var($_GET['offset'], FILTER_VALIDATE_INT);

        // Validate date format (YYYY-MM-DD)
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $start) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $end)) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid date format.']);
            exit;
        }

        getVehicleInvestigation($start, $end, $offset);

    } elseif ($functionName === 'getVehicleModel' && isset($_GET['year']) && isset($_GET['make'])) {
        $year = filter_var($_GET['year'], FILTER_VALIDATE_INT);
        $make = $_GET['make'];

        // Validate year (must be 4 digits)
        if (!filter_var($year, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1900, "max_range" => date('Y')]])) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid year format.']);
            exit;
        }

        // Validate make (alphanumeric, spaces, dashes, parentheses allowed)
        if (!preg_match('/^[a-zA-Z0-9\s\-\(\)]+$/', $make)) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid make format.']);
            exit;
        }

        getVehicleModel($year, $make);

    } elseif ($functionName === 'getVehicleByYear' && isset($_GET['modelYear'])) {
        $modelYear = filter_var($_GET['modelYear'], FILTER_VALIDATE_INT);

        // Validate model year
        if (!filter_var($modelYear, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1900, "max_range" => date('Y')]])) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid model year format.']);
            exit;
        }

        getVehicleByYear($modelYear);

    } elseif ($functionName === 'getVehicleCrashRating' && isset($_GET['id'])) {
        $id = $_GET['id'];

        // Validate id (alphanumeric, spaces, dashes, parentheses allowed)
        if (!preg_match('/^[a-zA-Z0-9\s\-\(\)]+$/', $id)) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid ID format.']);
            exit;
        }

        getVehicleCrashRating($id);

    } elseif ($functionName === 'getVehicleCrashRatingId' && isset($_GET['year']) && isset($_GET['make']) && isset($_GET['model'])) {
        $year = filter_var($_GET['year'], FILTER_VALIDATE_INT);
        $make = $_GET['make'];
        $model = $_GET['model'];

        // Validate year, make, and model
        if (!filter_var($year, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1900, "max_range" => date('Y')]])) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid year format.']);
            exit;
        }
        if (!preg_match('/^[a-zA-Z0-9\s\-\(\)]+$/', $make) || !preg_match('/^[a-zA-Z0-9\s\-\(\)]+$/', $model)) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid make/model format.']);
            exit;
        }

        getVehicleCrashRatingId($year, $make, $model);

    } elseif ($functionName === 'getRecalls' && isset($_GET['year']) && isset($_GET['make']) && isset($_GET['model'])) {
        $year = filter_var($_GET['year'], FILTER_VALIDATE_INT);
        $make = $_GET['make'];
        $model = $_GET['model'];

        // Validate year, make, and model
        if (!filter_var($year, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1900, "max_range" => date('Y')]])) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid year format.']);
            exit;
        }
        if (!preg_match('/^[a-zA-Z0-9\s\-\(\)]+$/', $make) || !preg_match('/^[a-zA-Z0-9\s\-\(\)]+$/', $model)) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid make/model format.']);
            exit;
        }

        getRecalls($year, $make, $model);

    } elseif ($functionName === 'getComplaints' && isset($_GET['year']) && isset($_GET['make']) && isset($_GET['model'])) {
        $year = filter_var($_GET['year'], FILTER_VALIDATE_INT);
        $make = $_GET['make'];
        $model = $_GET['model'];

        // Validate year, make, and model
        if (!filter_var($year, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1900, "max_range" => date('Y')]])) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid year format.']);
            exit;
        }
        if (!preg_match('/^[a-zA-Z0-9\s\-\(\)]+$/', $make) || !preg_match('/^[a-zA-Z0-9\s\-\(\)]+$/', $model)) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid make/model format.']);
            exit;
        }

        getComplaints($year, $make, $model);

    } elseif ($functionName === 'carSeatInspectionLocatorByState' && isset($_GET['state'])) {
        $state = $_GET['state'];

        // Validate state (alphanumeric)
        if (!preg_match('/^[a-zA-Z0-9]+$/', $state)) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid state format.']);
            exit;
        }

        carSeatInspectionLocatorByState($state);

    } elseif ($functionName === 'carSeatInspectionLocatorByZip' && isset($_GET['zip'])) {
        $zip = $_GET['zip'];

        // Validate zip (alphanumeric)
        if (!preg_match('/^[a-zA-Z0-9]+$/', $zip)) {
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Invalid zip format.']);
            exit;
        }

        carSeatInspectionLocatorByZip($zip);

    } else {
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Invalid function or missing parameters.']);
    }
} else {
    header('Content-Type: application/json');
    echo json_encode(['error' => 'Function not specified.']);
}
