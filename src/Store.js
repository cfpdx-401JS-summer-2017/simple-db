const fs = require('fs');
const db = require('./db');
const shortid = require('shortid');

module.exports = class Store {
  constructor(tableDir) {
    this.tableDir = tableDir;
  }

  save(objToSave, cb) {
    objToSave._id = shortid.generate();
    const fileName = objToSave.tableDir + '/' + objToSave._id + '.json';
    const fileContents = objToSave.obj;
    fs.writeFile(fileName, JSON.stringify(fileContents), err => {
      cb(err, objToSave);
    });
  }

  get(id, cb) {
    const animalPath = process.cwd() + '/tests/data/animals/' + id + '.json';
    const buildingPath = process.cwd() + '/tests/data/buildings/' + id + '.json';
    let path = '';
    fs.existsSync(animalPath) ? (path = animalPath) : (path = buildingPath);
    fs.readFile(path, (err, retrievedObj) => {
      cb(err, JSON.parse(retrievedObj));
    });
  }
  getAll(cb) {
    //   returns array of all objects from the requested table
    // return empty array [] when no objects
  }

  remove(id, cb) {
    // return removed = true or removed = false;
  }
};
/*
.save(<objectToSave>, callback)
creates a _id property for the object
saves the object in a file, where the filename is the _id. e.g. if the id is 12345, the file will be 12345.json
returns objectToSave with added _id property

.get(<id>, callback)
returns the object from the requested table that has that id
return null if that id does not exist

.getAll(callback)
returns array of all objects from the requested table
return empty array [] when no objects

.remove(<id>, callback)
removes the object
return { removed: true } or { removed: false } */
