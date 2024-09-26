<?php

namespace Models;

class Visitor
{
    private $conn;

    public function __construct($dbConnection)
    {
        $this->conn = $dbConnection;
    }

    public function getVisitors()
    {
        $stmt = $this->conn->prepare("SELECT * FROM visitor_logs ORDER BY date_visited DESC");

        if ($stmt === false) {
            return ["status" => "error", "message" => "Failed to prepare statement"];
        }

        if ($stmt->execute()) {
            $result = $stmt->get_result(); // Fetch the result set

            $visitors = [];
            while ($row = $result->fetch_assoc()) {
                $visitors[] = $row;
            }
            $stmt->close();
            return $visitors;
        } else {
            $stmt->close();
            return ["status" => "error", "message" => "Failed to log IP address"];
        }
    }

    // Method to log the visitor information
    public function logVisitor($ip_address, $visited_page, $timestamp, $country, $country_code, $city)
    {


        $stmt = $this->conn->prepare("INSERT INTO visitor_logs (id, ip_address, visited_page, date_visited, country, country_code, city) VALUES (UUID(), ?, ?, ?, ?, ?, ?)");

        if ($stmt === false) {
            return ["status" => "error", "message" => "Failed to prepare statement"];
        }

        $stmt->bind_param("ssssss", $ip_address, $visited_page, $timestamp, $country, $country_code, $city);

        // Execute the statement
        if ($stmt->execute()) {
            $stmt->close();
            return ["status" => "success", "message" => "IP address logged successfully"];
        } else {
            $stmt->close();
            return ["status" => "error", "message" => "Failed to log IP address"];
        }
    }
}
