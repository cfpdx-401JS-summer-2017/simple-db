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

    get(id, callback) {
        const filename = path.join(this.root, id + '.json');
        fs.readFile(filename, (err, contents) => {
            if (err) return callback(err);
            callback(null, JSON.parse(contents));
        });
    }

    remove(id, callback) {
        const filename = path.join(this.root, id + '.json');
        fs.unlink(filename, (err) => {
            if (err) return callback(err);
            callback(null, {removed: true});
        });
    }
}

module.exports = Store;