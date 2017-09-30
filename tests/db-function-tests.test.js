const promisify = require("util").promisify;
const {createTable} = require("../src/db");
const rimraf = promisify(require("rimraf"));
const path = require("path");
const chai = require("chai");
const assert = chai.assert;

describe("test db functions", () => {
  const DATA_DIR = path.join(__dirname, "data");
  let animals = null;
  let buildings = null;

  before(async () => {
    await rimraf(DATA_DIR).then();
    await createTable("animals").then(db => (animals = db));
    await createTable("buildings").then(db => (buildings = db));
  });

  it("saves new animal object", async () => {
    let newAnimal = {
      color: "blue",
      name: "ruby"
    };
    const savedElephant = await animals.save(newAnimal)
    assert.deepEqual(newAnimal.name, savedElephant.name);

  }), it("gets object from requested table by id", async () => {
    let newBuilding = {
      name: "skyscraper",
      numOfStories: "100"
    };
    const savedSkyscraper = await buildings.save(newBuilding)
    let retrievedSkyscraper = await buildings.get(savedSkyscraper._id)
    retrievedSkyscraper = JSON.parse(retrievedSkyscraper)
    assert.equal(newBuilding.name, retrievedSkyscraper.name);
  }), it("gets all objects from requested table", async () => {
    let allAnimals = await animals.getAll("animals")
    allAnimals.length < 1 ? assert.deepEqual([], allAnimals) : assert.isArray(allAnimals);
  }), it("removes the object by id", async () => {
    let axolotl = {
      color: "orange",
      name: "josephina"
    };
    newAxolotl = await animals.save(axolotl)
    const removedAxolotl = await animals.remove(newAxolotl._id)
    assert.equal(axolotl.name, newAxolotl.name)
    assert.isUndefined(removedAxolotl)
  });
});

