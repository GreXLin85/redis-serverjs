// Importing the required modules
const net = require('net');  // Node.js net module for creating TCP servers
const LRU = require('./LRU');  // Importing the LRU (Least Recently Used) cache implementation
const {
    handleInfo,
    handlePing,
    handleSet,
    handleDel,
    handleGet,
    handleQuit,
    handleFlushDB,
    handleSetMaxLRUSize,
    handleUnknown
} = require('./handlers');  // Importing various handler functions for different Redis commands
const { parameterType } = require('./utilities');

// Creating an LRU cache with a maximum size of 100
const lru = new LRU(100);

/**
 * Creates a TCP server instance that listens for incoming connections.
 * @param {net.Socket} socket - The socket object for the connection.
 */
const server = net.createServer((socket) => {
    // Event listener for data received on the socket
    socket.on('data', (data) => {
        // Parsing the Redis command from the received data

        data = data.toString();

        let paramType = parameterType(data);


        // Handling the Redis command based on the command type

        switch (data.toString().split('\r\n')[2]) {
            case "info":
                handleInfo(socket);
                break;
            case "ping":
                handlePing(socket);
                break;
            case "set":
                handleSet(lru, data, paramType, socket);
                break;
            case "del":
                handleDel(lru, data, socket);
                break;
            case "get":
                handleGet(lru, data, socket);
                break;
            case "set_max_lru_size":
                // This command is not a part of the Redis specification
                // It is here to demonstrate the ability to add custom commands
                // You can use this command by running the following command in the terminal:
                // redis-cli -p 6379 set_max_lru_size <size>
                handleSetMaxLRUSize(lru, data, paramType, socket);
                break;
            case "flushdb":
                handleFlushDB(lru, socket);
                break;
            case "dbsize":
                socket.write(`:${lru.size}\r\n`);
                break;
            case "quit":
                handleQuit(socket);
                break;
            default:
                handleUnknown(data, socket);
                break;
        }
    });
});

/**
 * Binds the server to the specified port and address.
 */
server.listen(6379, () => {
    console.log('Server listening on port 6379!');
});
