const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
    constructor(root) {
        this.root = root;
        // this._id = shortid.generate();
    }

    save(object, callback) {
        // QUESTION: this seems weird
        object._id = shortid.generate();

        const filename = path.join(this.root, object._id + '.json');

        fs.writeFile(filename, JSON.stringify(object), err => {
            if(err) return callback(err);
            callback(null, object);
        });
    }

    get(id, callback) {
        const filename = path.join(this.root, id + '.json');

        fs.readFile(filename, (err, data) => {
            if(err) return callback(null, null); // need to return null if doesn't exist
            const contents = JSON.parse(data);
            
            callback(null, contents);
        });
    }

    // TODO:
    // getAll
    // remove


};
