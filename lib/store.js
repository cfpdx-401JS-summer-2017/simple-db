const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const shortid = require('shortid');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

class Store {
    constructor(root) {
        this.root = root;
    }

    save(object) {
        object._id = shortid.generate();

        const filename = path.join(this.root, object._id + '.json');
        const contents = JSON.stringify(object);

        return writeFile(filename, contents)
            .then(() => object);
    }

    get(id) {
        const filename = path.join(this.root, id + '.json');

        return readFile(filename, 'utf8')
            .then(data => JSON.parse(data));


    }

    getAll(callback) {
        const arr = [];
        const dir = this.root;
        let fileCount = 0;
        fs.readdir(dir, (err, files) => {
            if (err) return callback(err);
            files.forEach(function (file) {
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
            callback(null, { removed: true });
        });
    }
}

module.exports = Store;