function haRunning() {
  var downSince = getLastFailed();
  if (downSince > 0) {
    Logger.log("HA is back up after failure, downSince="+downSince);
    notifyHaBackUp(downSince);
  } else {
    Logger.log("HA is up, no previous error");  
  }
  
  resetLastFailed();
  resetNumFailures();

  setLastSuccessful(getTimestamp());  
}

function haNotRunning() {
  Logger.log("HA is down!");
  
  var numFailures = incNumFailures();
  if (numFailures == 1) {
    Logger.log("First failure, setting error time");
    setLastFailed(getTimestamp());
  }
  
  Logger.log("numFailures="+numFailures);
  Logger.log("NUM_ERRROS_BEFORE_NOTIFYING="+NUM_ERRROS_BEFORE_NOTIFYING);
  Logger.log("NUM_ERROR_BEFORE_RE_NOTIFYING="+NUM_ERROR_BEFORE_RE_NOTIFYING);
  
  var shouldNotifyForFirstTime = numFailures == NUM_ERRROS_BEFORE_NOTIFYING;
  var numErrorsSinceFirstNotification = numFailures - NUM_ERRROS_BEFORE_NOTIFYING;
  var shouldReNotify = numFailures >= NUM_ERRROS_BEFORE_NOTIFYING && (numErrorsSinceFirstNotification) % NUM_ERROR_BEFORE_RE_NOTIFYING == 0;
  if (shouldNotifyForFirstTime || shouldReNotify) {
    Logger.log("Notifying HA down. numFailures="+numFailures);
    notifyHaDown(numFailures);
  } else {
    Logger.log("HA is down, not notifying, runsSinceFailure="+numFailures);
  }
}

function notifyHaBackUp(downSince) {
  var subject = "HA is back up";
  var message = "HA was down since "+downSince+" but is now back up";
  message += "\n\n";
  message += HA_URL;
  Logger.log("HA is back up, sending notification");
  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, message);
}

function notifyHaDown(numFailures) {
  var lastSuccessful = getLastSuccessful();
  var downSince = getLastFailed();
  var subject = "HA is down!";
  var message = "HA is down since "+downSince+", tried "+numFailures+" times since.";
  message += "\n";
  if (lastSuccessful != null) {
    message += "Last successful check was at "+lastSuccessful;
  } else {
    message += "No previous successful checks";
  }
  message += "\n\n";
  message += HA_URL;
  
  Logger.log("Sending notification to: "+NOTIFICATION_EMAIL+", message="+message);
  MailApp.sendEmail(NOTIFICATION_EMAIL, subject, message);
}

var expectedApiResponse = "API running.";

function isHaRunning() {
  
  var headers = {
    'Authorization': "Bearer "+HA_TOKEN,
    'Content-Type' : "application/json",
  };
    
  var options =
      {
        "method"  : "GET",
        "headers": headers,
      };
  
  try {
    var url = HA_URL + '/api/';
    var result = UrlFetchApp.fetch(url, options);
    if (result.getResponseCode() == 200) {
      Logger.log(result);
      var params = JSON.parse(result.getContentText());    
      if (params.message == expectedApiResponse) {
        return true;
      }
    }
  } catch (e) {
    Logger.log(e);
  }
  return false;
}

function getTimestamp() {
  return (new Date()).getTime();
}
