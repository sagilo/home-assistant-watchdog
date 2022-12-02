function checkIfHaRunning() {
  
  var headers = {
    'Authorization': "Bearer "+HA_TOKEN,
  };
    
  var options =
      {
        "method"  : "GET",
        "headers": headers,
        "muteHttpExceptions": true,
      };
  
  var url = HA_URL + '/api/';
  Logger.log("Trying to fetch '"+url+"'");
  var result = UrlFetchApp.fetch(url, options);
  var responseCode = result.getResponseCode();
  if (responseCode == 200) {
    Logger.log("Got response, code: "+responseCode+", result: "+result);
    var params = JSON.parse(result.getContentText());
    var responseMessage = params.message;
    if (responseMessage == EXPECTED_API_RESPONSE) {
      return;
    }

    throw "Unexpected API response: "+responseMessage+", exected: "+EXPECTED_API_RESPONSE;
  }

  throw "Invalid response code: "+responseCode;
}

function haRunning() {
  var numFailures = getNumFailures();
  var shouldNotifyForRestoration = notifiedForFailure(numFailures);
  if (shouldNotifyForRestoration) {
    var downSince = getLastFailed();
    Logger.log("HA is back up after failure, downSince="+downSince);
    notifyHaBackUp(downSince);
  } else {
    Logger.log("HA is up, not notifying, num of previous failures: "+numFailures);  
  }
  
  resetLastFailed();
  resetNumFailures();

  setLastSuccessful(getTimestamp());  
}

function haNotRunning(error) {
  Logger.log("HA is down!, error: "+ error);
  
  var numFailures = incNumFailures();
  if (numFailures == 1) {
    Logger.log("First failure, setting error time");
    setLastFailed(getTimestamp());
  }
  
  Logger.log("numFailures="+numFailures);
  Logger.log("NUM_ERRROS_BEFORE_NOTIFYING="+NUM_ERRROS_BEFORE_NOTIFYING);
  Logger.log("NUM_ERROR_BEFORE_RE_NOTIFYING="+NUM_ERROR_BEFORE_RE_NOTIFYING);
  
  var shouldNotify = shouldNotifyAboutFailure(numFailures);
  if (shouldNotify) {
    Logger.log("Notifying HA down. numFailures="+numFailures);
    notifyHaDown(numFailures, error);
    return;
  }
  
  Logger.log("HA is down, not notifying, runsSinceFailure="+numFailures);
}

function shouldNotifyAboutFailure(numFailures) {
  var shouldNotifyForFirstTime = numFailures == NUM_ERRROS_BEFORE_NOTIFYING;
  var numErrorsSinceFirstNotification = numFailures - NUM_ERRROS_BEFORE_NOTIFYING;
  var shouldReNotify = numFailures >= NUM_ERRROS_BEFORE_NOTIFYING && (numErrorsSinceFirstNotification) % NUM_ERROR_BEFORE_RE_NOTIFYING == 0;
  return shouldNotifyForFirstTime || shouldReNotify;
}

function notifiedForFailure(numFailures) {
  return numFailures >= NUM_ERRROS_BEFORE_NOTIFYING;
}

function notifyHaBackUp(downSince) {
  var subject = "HA is back up";
  var message = "HA was down since "+downSince+" and is now back up";
  message += "<br><br>";
  message += "URL: " + HA_URL;
  Logger.log("HA is back up, sending notification");
  MailApp.sendEmail({
      to: NOTIFICATION_EMAIL, 
      subject: subject, 
      htmlBody: message
    });
}

function notifyHaDown(numFailures, error) {
  var lastSuccessful = getLastSuccessful();
  var downSince = getLastFailed();
  var subject = "HA is down!";
  var message = "";
  message += "<h2>HA is down</h2>";
  message += "Since "+downSince+", tried "+numFailures+" times since";
  message += "<br>";
  message += "URL: " + HA_URL;
  message += "<br><br>";
  message += "<p style='color:#8C1515;'>Error: </p>"
  message += "<code>" + error + "</code>";
  message += "<br><br>";

  if (lastSuccessful != null) {
    message += "Last successful check was at "+lastSuccessful;
  } else {
    message += "No previous successful checks";
  }

  Logger.log("Sending notification to: "+NOTIFICATION_EMAIL+", message="+message);
  MailApp.sendEmail({
      to: NOTIFICATION_EMAIL, 
      subject: subject, 
      htmlBody: message
    });
}

function getTimestamp() {
  return (new Date()).getTime();
}