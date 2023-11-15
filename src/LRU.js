// Definition of the LRU (Least Recently Used) cache class
class LRU {
    // Constructor initializes the LRU cache with a specified maximum size
    constructor(maxSize) {
        this.maxSize = maxSize;  // Maximum size of the cache
        this.cache = {};  // Actual cache storage using a key-value mapping
        this.size = 0;  // Current size of the cache
        this.head = null;  // Reference to the most recently used item
        this.tail = null;  // Reference to the least recently used item
    }

    // Method to update the maximum size of the cache
    setMaxSize(maxSize) {
        this.maxSize = maxSize;
    }

    // Method to get the value associated with a key from the cache
    get(key) {
        if (this.cache[key]) {
            const value = this.cache[key].value;
            this.remove(key);
            this.set(key, value);
            return value;
        }
        return null;
    }

    // Method to set a key-value pair in the cache
    set(key, value) {
        if (this.cache[key]) {
            this.remove(key);
        } else if (this.size === this.maxSize) {
            delete this.cache[this.tail.key];
            this.remove(this.tail.key);
        }
        this.cache[key] = { key, value };
        this.addToFront(key);
    }

    // Method to remove a key-value pair from the cache
    remove(key) {
        const { prev, next } = this.cache[key];
        if (prev) {
            this.cache[prev].next = next;
        } else {
            this.head = next;
        }
        if (next) {
            this.cache[next].prev = prev;
        } else {
            this.tail = prev;
        }
        delete this.cache[key];
        this.size--;
    }

    // Method to add a key to the front of the cache (most recently used)
    addToFront(key) {
        const node = this.cache[key];
        node.prev = null;
        node.next = this.head;
        if (this.head) {
            this.cache[this.head].prev = key;
        }
        this.head = key;
        if (!this.tail) {
            this.tail = key;
        }
        this.size++;
    }

    // Method to print the contents of the cache (for debugging purposes)
    print() {
        let curr = this.head;
        while (curr) {
            console.log(curr);
            curr = this.cache[curr].next;
        }
    }
}

// Exporting the LRU class to be used in other modules
module.exports = LRU;
