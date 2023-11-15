/**
 * This module exports functions that handle Redis commands received by the server.
 * @module handlers
 */

const { convertToType } = require("./utilities");

/**
 * Handles the INFO command.
 * @param {net.Socket} socket - The socket to write the response to.
 * @returns {boolean} - Returns true if the response was successfully written to the socket.
 */
module.exports.handleInfo = function (socket) {
    return socket.write("+OK\r\n");
}

/**
 *  Handles the FLUSHDB command.
 * @param {LRU} lru - The LRU cache to clear.
 * @param {net.Socket} socket - The socket to write the response to.
 * @returns {boolean} - Returns true if the response was successfully written to the socket.
 */
module.exports.handleFlushDB = function (lru, socket) {
    lru.flushdb();
    return socket.write("+OK\r\n");
}

/**
 * Handles the PING command.
 * @param {net.Socket} socket - The socket to write the response to.
 * @returns {boolean} - Returns true if the response was successfully written to the socket.
 */
module.exports.handlePing = function (socket) {
    return socket.write("+PONG\r\n");
}

/**
 * Handles the SET command.
 * @param {LRU} lru - The LRU cache to store the key-value pair in.
 * @param {Buffer} data - The data received from the client.
 * @param {net.Socket} socket - The socket to write the response to.
 * @returns {boolean} - Returns true if the response was successfully written to the socket.
 */
module.exports.handleSet = function (lru, data, paramType, socket) {
    let param = convertToType(data.toString().split('\r\n')[6], paramType);
    lru.set(data.toString().split('\r\n')[4], param);
    return socket.write("+OK\r\n");
}

/**
 * Handles the DEL command.
 * @param {LRU} lru - The LRU cache to remove the key from.
 * @param {Buffer} data - The data received from the client.
 * @param {net.Socket} socket - The socket to write the response to.
 * @returns {boolean} - Returns true if the response was successfully written to the socket.
 */
module.exports.handleDel = function (lru, data, socket) {
    const dataArr = data.toString().split('\r\n')

    const key = dataArr[4]

    if (key === null) {
        return socket.write("-ERR unknown key '" + key + "'\r\n");
    }

    let delCount = 0;

    for (let i = 4; i < dataArr.length; i++) {
        const value = lru.get(key)

        if (value === null) {
            continue;
        }

        lru.remove(key);
        delCount++;
    }

    return socket.write(":" + delCount + "\r\n");
}

/**
 * Handles the GET command.
 * @param {LRU} lru - The LRU cache to retrieve the value from.
 * @param {Buffer} data - The data received from the client.
 * @param {net.Socket} socket - The socket to write the response to.
 * @returns {boolean} - Returns true if the response was successfully written to the socket.
 */
module.exports.handleGet = function (lru, data, socket) {
    const key = data.toString().split('\r\n')[4]

    if (key === null) {
        return socket.write("-ERR unknown key '" + key + "'\r\n");
    }

    const value = lru.get(key)

    if (value === null) {
        return socket.write("-ERR unknown key '" + key + "'\r\n");
    }

    return socket.write("+" + value + "\r\n");
}

/**
 * Handles the QUIT command.
 * @param {net.Socket} socket - The socket to write the response to.
 * @returns {boolean} - Returns true if the response was successfully written to the socket.
 */
module.exports.handleQuit = function (socket) {
    socket.write("+OK\r\n");
    return socket.end();
}

/**
 * Handles unknown commands.
 * @param {Buffer} data - The data received from the client.
 * @param {net.Socket} socket - The socket to write the response to.
 * @returns {boolean} - Returns true if the response was successfully written to the socket.
 */
module.exports.handleUnknown = function (data, socket) {
    return socket.write("-ERR unknown command '" + data.toString().split('\r\n')[2] + "'\r\n");
}

/**
 * Handles the SET_MAX_LRU_SIZE command.
 * @param {LRU} lru - The LRU cache to set the max size of.
 * @param {Buffer} data - The data received from the client.
 * @param {net.Socket} socket - The socket to write the response to.
 * @returns {boolean} - Returns true if the response was successfully written to the socket.
 */
module.exports.handleSetMaxLRUSize = function (lru, data, paramType, socket) {
    let param = convertToType(data.toString().split('\r\n')[4], paramType);

    // check if param not smaller than 1 and not smaller than the current size of the cache
    if (param >= 1 && param >= lru.size) {
        lru.setMaxSize(param);
        return socket.write("+OK\r\n");
    }

    return socket.write("-ERR invalid max size\r\n");


}