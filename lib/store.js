const promisify = require('util').promisify;
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
    constructor(root) {
        this.root = root;
        // this._id = shortid.generate();
    }

    save(object) {
        object._id = shortid.generate();

        const filename = path.join(this.root, object._id + '.json');
        const contents = JSON.stringify(object);

        return writeFile(filename, contents)
            .then(() => object);
    }

    get(id, callback) {
        const filename = path.join(this.root, id + '.json');

        fs.readFile(filename, (err, data) => {
            if (err) return callback(null, null);
            const contents = JSON.parse(data);
            
            callback(null, contents);
        });
    }

    getAll(callback) {
        fs.readdir(this.root, (err, files) => {
            if (err) return callback(null, null);
            // callback(null, files);
            var list = [];
            let count = files.length;

            files.forEach(file => {
                const filePath = path.join(this.root, file);

                fs.readFile(filePath, 'utf8', (err, contents) => {
                    if (err) return callback(null, null);
                    list.push(JSON.parse(contents));
                    count--;
                    if (count === 0) callback(null, list);
                });
                
            }); 
        });
    }

    remove(id, callback) {
        const filename = path.join(this.root, id + '.json');
        let status = {};

        fs.unlink(filename, (err) => {
            if (err) {
                // file doesn't exist
                status = { removed: false };
                return callback(err, status);
            } else {
                status = { removed: true };
                callback(null, status);
            }
        });
    }

};
