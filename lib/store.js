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
        return object;
    }

    get(id, callback) {
        const filename = path.join(this.root, id + '.json');
        fs.readFile(filename, (err, data) => {
            if (err) return callback(err.code === 'ENOENT' ? null : err, null);
            callback(null, JSON.parse(data));
        });
    }

    remove(id, callback) {
        const filename = path.join(this.root, id + '.json');
        fs.unlink(filename, err => {
            if(err) return callback(err.code === 'ENOENT' ? null : err, { removed: false } );
            callback(null, { removed: true } );
        });
    }
    // moar methods...
};