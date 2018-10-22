var properties = PropertiesService.getUserProperties();

var lastSuccessfulCallKey = 'lastSuccessfulCall';
var lastFailedCallKey = 'lastFailedfulCall';
var numFailuresKey = 'numFailures';

//resetLastSuccessful();
//resetLastFailed();
//resetNumFailures();

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
  properties.setProperty(lastSuccessfulCallKey, time);
}

function resetLastSuccessful() {
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

function setLastFailed(time) {
  properties.setProperty(lastFailedCallKey, time);
}

function resetLastFailed() {
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
  properties.deleteProperty(numFailuresKey);
}

