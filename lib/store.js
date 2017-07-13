const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
    constructor(root) {
        this.root = root;
        this._id = shortid.generate();
    }

    save(object, callback) {
        const filename = path.join(this.root, this._id + '.json'); // QUESTION: not sure about this

        fs.writeFile(filename, JSON.stringify(object), err => {
            if(err) return callback(err);
            callback(null, object);
        });
    }

    // TODO
    // get
    // getAll
    // remove


};
