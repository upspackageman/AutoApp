<?php

namespace Config;
require '../vendor/autoload.php'; // Ensure Composer's autoloader is included


class Database {
    private $servername = "localhost";
    private $username = "root";
    private $password = "KickMe5697";
    private $dbname = "auto_complaints";
    public $conn;

    // Constructor for initializing a database connection
    public function __construct() {
       
        $this->conn = new \mysqli($this->servername, $this->username, $this->password, $this->dbname);
        
        // Check connection
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }
}

?>
