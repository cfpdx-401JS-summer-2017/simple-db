const fs = require('fs');
const path = require('path');
const shortid = require('shortid');

module.exports = class Store {
    constructor(root) {
        this.root = root;
    }
    save(object, callback) {
        const id = shortid.generate();
        object._id = id;
        const fileName = path.join(this.root, id + '.json');

        fs.writeFile(fileName, JSON.stringify(object), err => {
            if(err) return callback(err);
            callback(null,object);
        });
    }

    get(id, callback) {
        const fileName = path.join(this.root, id + '.json');

        fs.readFile(fileName, (err, data) => {
            if(err) return callback(err);
            callback(null, JSON.parse(data));
        });
    }
};

