const fs = require('fs');
const path = require('path');

module.exports = class Store {
    constructor(root) {
        this.root = root;
    }

    save(object, callback) {
        const fileName = path.join(this.root, 'test');

        // TODO


        fs.writeFile(fileName, 'contents', err => {
            if(err) return callback(err);
            callback(null, obj);
        });
    }

    // TODO
    // get
    // getAll
    // remove


};
