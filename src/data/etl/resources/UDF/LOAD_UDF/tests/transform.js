const load = require('../LOAD_UDF.js');
const helpers = require("./helpers.js")
const assert = require('assert');
const proj4 = require("../proj4js.js")


// test data
var result = {"id":"0f3066c2-fb5a-4e8f-806d-48befd7b5e22","service_date":"2017-11-30","vehicle_number":"02631","route_number":"921","direction":"1","service_key":"W","trip_number":"9917","location_id":"10487","dwell":"00:00:00","x_coordinate":"7651313.91","y_coordinate":"673043.31"};
var keys = [ 'id','service_date','vehicle_number','route_number','direction','service_key','trip_number','location_id','dwell','x_coordinate','y_coordinate' ];
var testData = "30NOV2017:00:00:00,02631,58273,9910,8368,921,1,W,9917,58440,58273,0,10487,0,0,0,0,0,17,37.02,0,37.485026999,7651313.91,673043.31,1,5";

// tests

it('transform should process an example csv line and return a json string', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.equal(helpers.type(load.transform(testData)),"string");
});

it('transform should process an example csv line and return json with correct keys', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.equal(helpers.arraysEqual(keys, test),true);
});

it('transform should return an id not original to sample', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.notEqual(test.id, result.id);
});

it('transform should return service_date equal to test result', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.notEqual(test.service_date, result.service_date);
});

it('transform should return vehicle_number equal to test result', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.notEqual(test.vehicle_number, result.vehicle_number);
});

it('transform should return route_number equal to test result', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.notEqual(test.route_number, result.route_number);
});

it('transform should return direction equal to test result', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.notEqual(test.direction, result.direction);
});

it('transform should return service_key equal to test service_key', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.notEqual(test.service_key, result.service_key);
});

it('transform should return trip_number equal to test trip_number', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.notEqual(test.trip_number, result.trip_number);
});

it('transform should return location_id equal to test location_id', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.notEqual(test.location_id, result.location_id);
});

it('transform should return dwell equal to test dwell', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.notEqual(test.dwell, result.dwell);
});

it('transform should return x_coordinate equal to test x_coordinate', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.notEqual(test.x_coordinate, result.x_coordinate);
});

it('transform should return y_coordinate equal to test y_coordinate', () => {
  var test = Object.keys(JSON.parse(load.transform(testData)))
  assert.notEqual(test.y_coordinate, result.y_coordinate);
});
