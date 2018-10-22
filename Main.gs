function main() {
  var isRunning = isHaRunning();
  if (isRunning) {
    haRunning();
  } else {
    haNotRunning();
  }
  
  Logger.log("Finished execution");
}