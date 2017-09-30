const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const unlink = promisify(fs.unlink);
const shortid = require('shortid');

module.exports = class Store {
	constructor(dirName) {
		this.dirName = dirName;
	}

	save(obj) {
		obj._id = shortid.generate();
		const filePath = path.join(this.dirName, obj._id + '.json');
		const fileContents = JSON.stringify(obj);
		return writeFile(filePath, fileContents).then(() => obj);
	}

	get(id) {
		const filePath = path.join(this.dirName, id + '.json');
		return readFile(filePath).then(obj => obj);
	}

	getAll() {
		const filePath = path.join(this.dirName, '/');
		return readdir(filePath).then(files => files);
	}

	remove(id) {
		const filePath = path.join(this.dirName, id + '.json');
		unlink(filePath).then(err => err);
	}
};
