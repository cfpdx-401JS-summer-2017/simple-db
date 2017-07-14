const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

class Store {
    constructor(root) {
        this.root = root;
    }

    save(object, callback) {
        object._id = shortid.generate();

        const filename = path.join(this.root, object._id);
        const contents = JSON.stringify(object);

        fs.writeFile(filename, contents, err => {
            if (err) return callback(err);
            callback(null, object);

        });
    }
}

module.exports = Store;