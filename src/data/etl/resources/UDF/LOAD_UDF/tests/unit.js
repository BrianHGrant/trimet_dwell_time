const load = require('../LOAD_UDF.js');
const assert = require('assert');
const validator = require('validator')

// uuidv4() tests
it('uuidv4 should return false if 2 ids are the same', () => {
  assert.notEqual(load.uuidv4(), load.uuidv4());
});

it('uuidv4 should return true if id is 36 characters', () => {
  assert.equal(load.uuidv4().length, 36);
});

it('uuidv4 should be validated as a v4 uuid', () => {
  assert.equal(validator.isUUID(load.uuidv4(), 4)	, true);
});

// convert seconds from 00:00:00 into a time of day

it('convertSeconds should return 00:00:00 for 0 seconds', () => {
  assert.equal(load.convertSeconds(0), "00:00:00");
});

it('convertSeconds should return values for hours, minutes, seconds', () => {
  assert.equal(load.convertSeconds(76569), "21:16:09");
});

it('convertSeconds should return 24:00:00 for 86400 seconds', () => {
  assert.equal(load.convertSeconds(86400), "24:00:00");
});

// makes a biquery formatted date

it('makeDate should return 2017-11-29 for 29NOV2017:00:00:00', () => {
  assert.equal(load.makeDate("29NOV2017:00:00:00"), "2017-11-29");
});

// makes a bigquery formatted time value
it('makeTime should return 00:00:12 for 12 seconds', () => {
  assert.equal(load.makeTime(12), "00:00:12");
});
