const fs = require('fs');
const db = require('../src/db');
const shortid = require('shortid');

class Store {
  constructor(obj) {
    _id = 0;
    name = 'name';
    type = 'type';
  }
  save({ obj }) {
    return { name: this.name, _id: this._id, type: this.type };
  }

  get() {}
  getAll() {}

  remove() {}
}

module.exports = Store;

// make this a function that can be exported and returns/ creates an obj

// sets rootdir prompt

// creates store object

// save({obj}) {
//   const savedAnimal = {name: this.name, _id: this._id}

// }

// get (id) {

// }
// getAll () {

// }

// remove () {

// }

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
