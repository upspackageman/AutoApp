<?php
namespace Models;

class User {
    private $conn;
    private $table_name = "admins";

    public function __construct($dbConnection) {
        $this->conn = $dbConnection;
    }

    // Method to get user by login (username or email)
    public function getUserByLogin($login) {

        $query = "SELECT * FROM " . $this->table_name . " WHERE username = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
       // echo json_encode( $query);
        // Bind parameter
        $stmt->bind_param('s', $login);
    
        $stmt->execute();
    
       
        // Return the statement object
        return $stmt;
    }

    // Method to verify user credentials
    public function verifyCredentials($login, $password) {
       
        $stmt = $this->getUserByLogin($login);
        
       

        if ($result = $stmt->get_result()) {
            $user = $result->fetch_assoc();
            if ($user && password_verify($password, $user['password'])) {
                return $user;
            }
        }

        return false; 
    }
}
?>
