const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const shortid = require('shortid');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);

class Store {
    constructor(root) {
        this.root = root;
    }

    save(object) {
        object._id = shortid.generate();

        const filename = path.join(this.root, object._id + '.json');
        const contents = JSON.stringify(object);

        return writeFile(filename, contents)
            .then(() => object);
    }

    get(id) {
        const filename = path.join(this.root, id + '.json');

        return readFile(filename, 'utf8')
            .then(data => JSON.parse(data));


    }

    getAll() {
        const dir = this.root;
        return readdir(dir)
            .then(files => {
                return files.map(function (file) {
                    const filename = path.join(dir, file);
                    return readFile(filename, 'utf8');
                });
            })
            .then(promises => Promise.all(promises))
            .then(contents => {
                return contents.map(content => JSON.parse(content));
            });
    }

    remove(id) {
        const filename = path.join(this.root, id + '.json');
        return unlink(filename)
            .then(() => {
                return { removed: true };
            });
    }
}

module.exports = Store;