const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

class Store {
    constructor(root) {
        this.root = root;
    }

    save(object, callback) {
        object._id = shortid.generate();

        const filename = path.join(this.root, object._id + '.json');
        const contents = JSON.stringify(object);

        fs.writeFile(filename, contents, err => {
            if (err) return callback(err);
            callback(null, object);

        });
    }

    get(filePath, callback) {
        fs.readFile(filePath, (err, contents) => {
            if (err) throw err;
            callback(null, JSON.parse(contents));
        });
    }
}

module.exports = Store;