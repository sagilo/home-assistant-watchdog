function main() {
  try {
    checkIfHaRunning();
    haRunning();
  } catch (e) {
    haNotRunning(e);
  }
  
  Logger.log("Finished execution");
}
