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
    lru.remove(data.toString().split('\r\n')[4]);
    return socket.write("+OK\r\n");
}

/**
 * Handles the GET command.
 * @param {LRU} lru - The LRU cache to retrieve the value from.
 * @param {Buffer} data - The data received from the client.
 * @param {net.Socket} socket - The socket to write the response to.
 * @returns {boolean} - Returns true if the response was successfully written to the socket.
 */
module.exports.handleGet = function (lru, data, socket) {
    return socket.write("+" + lru.get(data.toString().split('\r\n')[4]) + "\r\n");
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
    lru.setMaxSize(param);
    return socket.write("+OK\r\n");
}