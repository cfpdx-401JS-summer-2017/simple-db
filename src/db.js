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
