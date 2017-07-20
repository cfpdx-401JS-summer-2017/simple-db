const promisify = require('util').promisify;
const rimraf = promisify(require('rimraf'));
const path = require('path');
const db = require('../lib/db');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const assert = chai.assert;



describe('db', () => {
    const TEST_DIR = path.join(__dirname, 'test');

    before(() => rimraf(TEST_DIR));

    let alcohol = null;
    let ipa = null;
    let drinks = [];

    before(() => {
        db.rootDir = TEST_DIR;
        return db.createTable('alcohol')
            .then(store => { alcohol = store; });
    });

    it('saves alcohol to the db', () => {
        return alcohol.save({ type: 'beer', name: 'IPA' })
            .then(savedBeer => {
                ipa = savedBeer;
                drinks.push(ipa);
                assert.equal(savedBeer.type, 'beer');
                assert.equal(savedBeer.name, 'IPA');
                assert.ok(savedBeer._id);
            });
    });

    it('gets alcohol by id', () => {
        return alcohol.get(ipa._id)
            .then(beer => {
                assert.equal(beer._id, ipa._id);
            });

    });

    it('returns all of the alcohol objects', () => {
        const gin = { type: 'hardA', name: 'gin' };
        return alcohol.save(gin)
            .then(saved => {
                drinks.push(saved);
            })
            .then(() => alcohol.getAll())
            .then((alcoholArray => {
                assert.deepEqual(alcoholArray,[ipa,gin].sort((a, b)=> (a._id > b._id) ? 1: -1));
            }));
            
    });

    xit('removes alcohol by id', done => {
        alcohol.remove(ipa._id, (err, data) => {
            if (err) return done(err);
            assert.deepEqual(data, { removed: true });
            done();
        });
    });

});