const fs = require('fs')
const db = require('../src/db')
const shortid = require('shortid')
const Animal = require('../src/Animal')
const Building = require('../src/Building')
const assert = require('assert')

describe('test db functions', () => {
  before(() => {
  })
  it('saves new animal object', () => {
    const name = 'yolanda'
    const id = shortid.generate()
    const myAnimal = new Animal({name: name, id: id})
    myAnimal.save(myAnimal, () => {
    })
    assert.ok(myAnimal._id)
}),
  it('gets object from requested table by id', () => {

  }),
  it('gets all objects from requested table', () => {

  }),
  it('removes the object by id', () => {

  })
})
