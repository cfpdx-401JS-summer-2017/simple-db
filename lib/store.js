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
            if (err) return callback(err);
            callback(null, object);
        });
    }

    get(id, callback) {
        const fileName = path.join(this.root, id + '.json');

        fs.readFile(fileName, (err, data) => {
            if (err) return callback(err);
            callback(null, JSON.parse(data));
        });
    }

    getAll(callback) {
        fs.readdir(this.root, (err, files) => {
            if (err) return callback(err);
            const fileData = [];
            let count = files.length;

            for (let i = 0; i < files.length; i++) {
                const filePath = path.join(this.root, files[i]);

                fs.readFile(filePath, (err, data) => {
                    if (err) return callback(err);
                    fileData.push(JSON.parse(data));
                    count--;
                    if (count === 0) callback(null, fileData);

                });
            }
        });
    }

    remove(id, callback) {
        const fileName = path.join(this.root, id + '.json');

        fs.unlink(fileName, (err) => {
            if (err) return callback(err);
            callback(null, {removed: true});
        });



    }
};



