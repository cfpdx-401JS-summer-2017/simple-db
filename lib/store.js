const promisify = require('util').promisify;
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
    constructor(root) {
        this.root = root;
    }

    save(object) {
        object._id = shortid.generate();

        const filename = path.join(this.root, object._id + '.json');
        const contents = JSON.stringify(object);

        return writeFile(filename, contents)
            .then(() => object)
            // .catch(err => console.log(err));
    }

    get(id) {
        const filename = path.join(this.root, id + '.json');

        return readFile(filename, 'utf8')
            .then(contents => JSON.parse(contents))
            // .catch(err => console.log(err));
    }

    getAll() {
        // get all files
        return readdir(this.root)
            // get the full path of each file
            .then(files => files.map(f => path.join(this.root, f)))
            // read each file
            .then(filePaths => {
                return Promise.all(
                    filePaths.map(f => readFile(f, 'utf8'))
                );
            })
            .then(contents => contents.map(c => JSON.parse(c)));
            
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
