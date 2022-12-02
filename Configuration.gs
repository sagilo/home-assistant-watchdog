// how many errors should occur before
// notification
var NUM_ERRROS_BEFORE_NOTIFYING = 2;
// after notified once, how many errors should 
// occur before another notification.
var NUM_ERROR_BEFORE_RE_NOTIFYING = 10;
// HA url
var HA_URL = "";
// HA Long lived token
var HA_TOKEN = "";
var EXPECTED_API_RESPONSE = "API running.";

// notification email, tip: use (+) trick 
// for easy filtering, for example:
// yourname+hawatchdog@gmail.com
// see more at:
// https://www.lifewire.com/easy-gmail-address-hacks-1616186
var NOTIFICATION_EMAIL = ""

if (NUM_ERRROS_BEFORE_NOTIFYING < 1) {
   throw ("NUM_ERRROS_BEFORE_NOTIFYING must be 1 or greater");
}

if (NUM_ERROR_BEFORE_RE_NOTIFYING < 1) {
   throw ("NUM_ERROR_BEFORE_RE_NOTIFYING must be 1 or greater");
}

if (HA_URL == "") {
    throw ("Missing HA_URL");
}

if (HA_URL.endsWith("/")) {
    throw ("HA URL shouldn't end with a slash:  "+HA_URL);
}

if (HA_TOKEN == "") {
    throw ("Missing HA_TOKEN");
}

if (NOTIFICATION_EMAIL == "") {
    throw ("Missing NOTIFICATION_EMAIL");
}
