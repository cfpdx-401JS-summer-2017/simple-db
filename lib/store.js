const promisify = require('util').promisify;
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);


module.exports = class Store {
    constructor(root) {
        this.root = root;
    }
    save(object) {
        const id = shortid.generate();
        object._id = id;
        const fileName = path.join(this.root, id + '.json');

        return writeFile(fileName, JSON.stringify(object))
            .then(() => object);
    }

    get(id) {
        const fileName = path.join(this.root, id + '.json');

        return readFile(fileName)
            .then(data => JSON.parse(data));
    }

    getAll() {
        return readdir(this.root)
            .then(files => files.map(file => path.join(this.root, file)))
            .then(filePath => {
                return Promise.all(
                    filePath.map(file => readFile(file, 'utf8'))
                );

            }).then(meowmeow => meowmeow.map(file => JSON.parse(file)));

    }

    remove(id, callback) {
        const fileName = path.join(this.root, id + '.json');

        fs.unlink(fileName, (err) => {
            if (err) return callback(err);
            callback(null, { removed: true });
        });



    }
};



