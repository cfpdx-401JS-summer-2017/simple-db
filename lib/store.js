const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
    constructor(root) {
        this.root = root;
    }

    save(object, callback) {
        object._id = shortid.generate();
        const filename = path.join(this.root, object._id + '.json');
        

        // do REAL implementation here...

        // this is here for now to make sure 
        // we have access to the directory
        // create my mkdirp

        fs.writeFile(filename, JSON.stringify(object), err => {
            if(err) return callback(err);
            callback(null, object);
        });
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