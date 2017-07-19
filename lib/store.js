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

    getAll(callback) {
        const arr = [];
        const dir = this.root;
        let fileCount = 0;
        fs.readdir(dir, (err, files) => {
            if (err) return callback(err);
            files.forEach(function(file) {
                const filename = path.join(dir, file);
                fs.readFile(filename, (err, contents) => {
                    if (err) return callback(err);
                    arr.push(JSON.parse(contents));
                    fileCount++;
                    if (fileCount === files.length) {
                        callback(null, arr);
                    }
                });
            });
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