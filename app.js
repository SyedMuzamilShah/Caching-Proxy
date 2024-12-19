// Import required libraries
import express from 'express';
import minimist from 'minimist';
import NodeCache from 'node-cache';
import axios from 'axios';

// Initialize application and parse command-line arguments
const app = express();
const args = minimist(process.argv);

// Initialize cache instance
// stdTTL: 0         Data will be cached indefinitely (no expiration)
// stdTTL: <number>  Data will expire after the specified time in seconds
// checkperiod: <number>  Interval in seconds to check and delete expired cache entries
const myCache = new NodeCache({ stdTTL: 0, checkperiod: 120 });

// Define the server port from arguments or default to 3000
const port = args.port || 3000;

// Check for `--clear-cache` flag and clear the cache if present
const canClear = args['clear-cache'];
if (canClear) {
    myCache.flushAll(); // Clear all cached data
    console.log("Cache cleared successfully");

    // Exit the process after clearing the cache
    process.exit(0);
}

// Middleware to handle proxying requests and caching responses
const cacheAndForward = async (req, res, next) => {
    // Extract the requested endpoint
    const endPoint = req.originalUrl;

    // Get the origin server URL from command-line arguments
    const mainServerUrl = args.origin;

    // Construct the full URL to forward the request
    const url = mainServerUrl + endPoint;

    // Check if the response for this endpoint is already cached
    const cacheResponse = myCache.get(endPoint);
    if (cacheResponse) {
        res.setHeader('X-Cache', 'HIT'); // Mark response as from cache

        // Pass the cached response to the request object
        req.response = cacheResponse;
        next(); // Proceed to the next middleware
        return;
    }

    console.log("Requesting data from the origin server...");

    try {
        // Forward the request to the origin server
        const externalResponse = await axios({
            method: req.method,
            url: url,
        });

        // Mark the response as from the origin server
        res.setHeader('X-Cache', 'MISS');

        // Cache the origin server's response data
        myCache.set(endPoint, externalResponse.data);

        // Pass the origin server response to the request object
        req.response = externalResponse.data;
        next(); // Proceed to the next middleware
    } catch (error) {
        console.error('Error fetching data from origin server:', error.message);

        // Respond with an error message if the request to the origin server fails
        res.status(500).send('Failed to fetch data from the origin server');
    }
};

// Route to handle all incoming requests
app.get('*', cacheAndForward, (req, res) => {
    // Log whether the response was served from cache or the origin server
    const cacheHeader = res.getHeader('X-Cache');
    console.log(`X-Cache: ${cacheHeader}`);

    // Send the response back to the client
    res.send(req.response);
});

// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running and listening on port ${port}`);
});
