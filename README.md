# Redis Server JS

This is a tiny Redis Server with simple commands written in JavaScript. It is based on the [Redis Protocol Specification](http://redis.io/topics/protocol).

## Installation

```bash
git clone https://github.com/GreXLin85/redis-serverjs.git
cd redis-serverjs
```

### Usage

```bash
npm start
```

### Commands Implemented

* [PING](http://redis.io/commands/ping)
* [SET](http://redis.io/commands/set)
* [GET](http://redis.io/commands/get)
* [DEL](http://redis.io/commands/del)
* [FLUSHDB](http://redis.io/commands/flushdb) - This command is not support ASYNC/SYNC option in our implementation.
* [DBSIZE](http://redis.io/commands/dbsize)
* SET_MAX_LRU_SIZE - This is a custom command to set the maximum size of the LRU cache. The default value is 100. This command is used to test the LRU cache.
Usage: SET_MAX_LRU_SIZE size

### References

* [Redis Protocol Specification](http://redis.io/topics/protocol)
* [Redis Commands](http://redis.io/commands)