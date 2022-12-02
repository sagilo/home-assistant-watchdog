var properties = PropertiesService.getUserProperties();

var lastSuccessfulCallKey = 'lastSuccessfulCall';
var lastFailedCallKey = 'lastFailedfulCall';
var numFailuresKey = 'numFailures';

function getLastSuccessful() {
  var timestamp = properties.getProperty(lastSuccessfulCallKey);
  if (timestamp == null) {
    return timestamp;
  }
  var date = new Date();
  date.setTime(timestamp);
  return date;
}

function setLastSuccessful(time) {
  var date = new Date();
  date.setTime(time);
  Logger.log("Setting last successful to time: "+date)
  properties.setProperty(lastSuccessfulCallKey, time);
}

function resetLastSuccessful() {
  Logger.log("Resseting '"+lastSuccessfulCallKey+"' property")
  properties.deleteProperty(lastSuccessfulCallKey);
}

function getLastFailed() {
  var timestamp = properties.getProperty(lastFailedCallKey);
    if (timestamp == null) {
    return timestamp;
  }
  var date = new Date();
  date.setTime(timestamp);
  return date;
}

function setLastFailed(timestamp) {
  var date = new Date();
  date.setTime(timestamp);
  Logger.log("Setting last failed to: "+date);
  properties.setProperty(lastFailedCallKey, timestamp);
}

function resetLastFailed() {
  Logger.log("Resetting '"+lastFailedCallKey+"' property")
  properties.deleteProperty(lastFailedCallKey);
}

function getNumFailures() {
  var numFailures = properties.getProperty(numFailuresKey);
  if (numFailures == null) {
    return 0;
  }
  return parseInt(numFailures);
}

// return updated value
function incNumFailures() {
  var numFailures = getNumFailures();
  numFailures += 1;
  properties.setProperty(numFailuresKey, numFailures)
  return numFailures;
}

function resetNumFailures() {
  Logger.log("Resetting '"+numFailuresKey+"' property")
  properties.deleteProperty(numFailuresKey);
}

