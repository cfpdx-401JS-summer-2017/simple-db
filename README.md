Simple Database
===

July 13, 2017

## Description:

Create a library that exports a single, global db that has a:
* `rootDir` property to set the root dir
* `createTable` method that returns a store

Use a class for the return store that takes the directory that it should use in the constructor.

The store offers `save`, `get`, `getAll`, and `remove` methods.

Use json as a file format to store (serialized and deserialized) javascript objects.