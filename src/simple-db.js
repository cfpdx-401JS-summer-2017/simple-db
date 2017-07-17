const db = require('./db')
const shortid = require('shortid')
const path = require('path')
db.rootDir = path.join(__dirname, '../data')

const animals = db.createTable('animals')
const buildings = db.createTable('buildings')

animals.save({ name: 'garfield' }, (err, cat) => {
  if (err) return console.log('ERROR', err)
  const id = cat._id

  animals.get(id, (err, cat) => {
    if (err) return console.log('ERROR', err)
    console.log('got cat', cat)
  })
})

animals.getAll((err, animals) => {
  if (err) return console.log('ERROR', err)
  console.log('we have', animals.length, 'animals')
})

animals.remove(id, (err, cat) => {
  if (err) return console.log('ERROR', err)
  console.log('got cat', cat)
})
