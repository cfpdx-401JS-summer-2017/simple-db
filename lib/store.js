// cSpell:ignore promisify
const promisify = require('util').promisify;
const fs = require('fs');
const path = require('path');
const shortid = require('shortid');
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);

module.exports = class Store {
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
            .then(data => JSON.parse(data))
            .catch(err => {
                if (err.code === 'ENOENT') return null;
                throw err;
            });
    }

    getAll() {
        return readdir(this.root)
            .then(filenames => {
                if (filenames.length === 0) return [];
                return filenames.map(name => {
                    return path.join(this.root, name);
                });
            })
            .then(paths => {
                return Promise.all(
                    paths.map(p => readFile(p,'utf8'))
                );
            })
            .then(arr => {
                return arr.map(data => JSON.parse(data));
            })
            .catch(err => {
                if (err.code === 'ENOENT') return null;
                throw err;
            });
    }

    remove(id) {
        const filename = path.join(this.root, id + '.json');
        return unlink(filename)
            .then(() => {
                return { removed: true };
            })
            .catch(err => {
                if (err.code === 'ENOENT') return { removed: false };
                throw err;
            });
    }
};