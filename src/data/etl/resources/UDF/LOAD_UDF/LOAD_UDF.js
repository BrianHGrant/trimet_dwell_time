const proj4 = require("./proj4js.js")
// creates a random uuid for operation
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// converts seconds of day to time
function convertSeconds(sec) {
  var hrs = Math.floor(sec / 3600);
  var min = Math.floor((sec - (hrs * 3600)) / 60);
  var seconds = sec - (hrs * 3600) - (min * 60);
  seconds = Math.round(seconds * 100) / 100

  var result = (hrs < 10 ? "0" + hrs : hrs);
  result += ":" + (min < 10 ? "0" + min : min);
  result += ":" + (seconds < 10 ? "0" + seconds : seconds);
  return result;
}

// converts the date string to date format recognized by bigquery
function makeDate(datestring) {
    var parts = datestring.split(':');
    var dateparts = [parts[0].substring(5, 9), parts[0].substring(2, 5), parts[0].substring(0, 2)]
    var months = {
        JAN: "01",
        FEB: "02",
        MAR: "03",
        APR: "04",
        MAY: "05",
        JUN: "06",
        JUL: "07",
        AUG: "08",
        SEP: "09",
        OCT: "10",
        NOV: "11",
        DEC: "12"
    };
    return dateparts[0] + "-" + months[dateparts[1].toUpperCase()] + "-" + dateparts[2];
}

// converts a second value to a big query time value
function makeTime(second) {
  var date = new Date(null);
  date.setSeconds(second); // specify value for SECONDS here
  var result = date.toISOString().substr(11, 8);
  return result;
}

// takes the inported csv line, splits values on commas, performs transforms then returns json object
function transform(line) {
  var values = line.split(','); // splits comma separated text into an array

  var stopEvent = new Object(); // creates the stopEvent object

  stopEvent.id = uuidv4(); // random uuid
  stopEvent.service_date = makeDate(values[0]);
  stopEvent.vehicle_number = values[1];
  // stopEvent.leave_time = convertSeconds(values[2]);
  // stopEvent.train = values[3];
  stopEvent.route_number = values[5];
  stopEvent.direction = values[6];
  stopEvent.service_key = values[7];
  stopEvent.trip_number = values[8];
  // stopEvent.stop_time = convertSeconds(values[9]);
  // stopEvent.arrive_time = convertSeconds(values[10]);
  // stopEvent.dwell = makeTime(values[11]);
  stopEvent.location_id = values[12];
  // stopEvent.door = values[13]
  // because dwell time is better represented as the door time
  stopEvent.dwell = makeTime(values[13]);

  // stopEvent.lift = values[14]
  // stopEvent.ons = values[15]
  // stopEvent.offs = values[16]
  // stopEvent.maximum_speed = values[17];
  // stopEvent.train_mileage = values[18];
  // stopEvent.pattern_distance = values[19];
  // stopEvent.location_distance = values[20];
  stopEvent.x_coordinate = values[22]
  stopEvent.y_coordinate = values[23];

  return JSON.stringify(stopEvent);
}


// exports included for mocha testing
if (typeof module !== 'undefined' && module.exports != null) {
    exports.uuidv4 = uuidv4;
    exports.convertSeconds = convertSeconds;
    exports.makeDate = makeDate;
    exports.makeTime = makeTime;
    exports.transform = transform;
}
