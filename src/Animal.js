class Animal {
  constructor (animal) {
    this._id = animal.id
    this.name = animal.name
  }

  save (name, id) {
    const savedAnimal = {name: this.name, _id: this._id}

  }

  get (id) {

  }
  getAll () {

  }

  remove () {

  }
}
module.exports = Animal
