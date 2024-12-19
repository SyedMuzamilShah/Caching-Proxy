# Caching Proxy
## Overview
- A caching proxy server that runs locally and forwards requests to an actual server. It caches responses to serve subsequent identical requests directly from the cache, reducing the load on the actual server.

## Features
- Proxies requests to an origin server.
- Caches responses to avoid unnecessary forwarding for repeated requests.
- Adds `X-Cache` headers to indicate whether the response was served from the cache (`HIT`) or fetched from the origin server (`MISS`).
- Provides a command to clear all cached responses.
## Usage
* Run the app using the following commands:
0. **clone repo**
    ```bash
    git clone https://github.com/SyedMuzamilShah/Caching-Proxy.git
    cd Caching-Proxy
    ```
    * cloned the repository and navigate to the the folder
1. **Install dependences**
   ```bash
   npm i express axoss node-cache minimist axios
   ```
   * install all that required dependencies

2. **Running**
    ```bash
    node app.js --port <number> --origin <url>
    ```
    * Navigate to http://localhost:3000/products in your browser.
    - The first request will be forwarded to http://dummyjson.com/products.
    - Subsequent requests will be served from the cache.

3. **Cleaning cashes**
    ```bash
    node app.js --clear-cache
    ```
    * This will flush all cached entries and exit the process.

# Project Url : [text](https://roadmap.sh/projects/caching-server)