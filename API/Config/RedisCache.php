<?php

class RedisCache
{
    private $redis;

    public function __construct()
    {
        // Usage in your function
// ... your code ...

        $this->redis = new RedisCache();
        
        // Connect to Redis (use the service name from docker-compose if running in Docker)
        $this->redis->connect('redis', 6379); // 'redis' as the hostname for Docker setup, '127.0.0.1' for local
    }

    function logMemoryUsage($message) {
        $currentMemory = memory_get_usage();
        $peakMemory = memory_get_peak_usage();
        file_put_contents('memory_usage.log', "$message - Current: $currentMemory bytes, Peak: $peakMemory bytes\n", FILE_APPEND);
    }

    // Method to set data in Redis
    public function set($key, $value, $expiration = 3600)
    {
        $this->redis->set($key, $value, $expiration);
    }

    // Method to get data from Redis
    public function get($key)
    {
        return $this->redis->get($key);
    }

    // Method to check if a key exists
    public function exists($key)
    {
        return $this->redis->exists($key);
    }

    // Method to delete a key
    public function delete($key)
    {
        $this->redis->del($key);
    }

    // Additional methods for rate-limiting or caching can be added here
}
