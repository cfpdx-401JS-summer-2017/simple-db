const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

class Store {
    constructor(root) {
        this.root = root;
    }

    save(object, callback) {
        const filename = path.join(this.root, 'test');
        object._id = shortid.generate();

        fs.writeFile(filename, 'contents', err => {
            if (err) return callback(err);
            callback(null, object);

        });
    }
}

module.exports = Store;