// cSpell:ignore promisify
const promisify = require('util').promisify;
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const writeFile = promisify(fs.writeFile);

module.exports = class Store {
    constructor(root) {
        this.root = root;
    }

    save(object) {
        object._id = shortid.generate();
        const filename = path.join(this.root, object._id + '.json');
        const contents = JSON.stringify(object);


        return writeFile(filename, contents)
            .then( () => object);
        
    }

    get(id, callback) {
        const filename = path.join(this.root, id + '.json');
        fs.readFile(filename, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') return callback(null, null);
                return callback(err );
            } 
            callback(null, JSON.parse(data));
        });
    }

    getAll(callback) {

        fs.readdir(this.root, (err, filenames) => {
            if (err) {
                if (err.code === 'ENOENT') return callback(null, null);
                return callback(err);
            }

            if (filenames.length === 0) return callback(null, []);

            let counter = filenames.length;
            let objArr = [];

            filenames.forEach(name => {
                let filename = path.join(this.root, name);

                fs.readFile(filename, (err, data) => {
                    if (err) {
                        if (err.code === 'ENOENT') return callback(null, null);
                        return callback(err);
                    }
                    counter--;

                    objArr.push(JSON.parse(data));
                    if (counter === 0) callback(null, objArr);
                });

            });
        });
    }

    remove(id, callback) {
        const filename = path.join(this.root, id + '.json');
        fs.unlink(filename, (err) => {
            if (err) {
                if (err.code === 'ENOENT') return callback(null, { removed: false });
                return callback(err);
            }
            callback(null, { removed: true });
        });



    }

    // moar methods...
};