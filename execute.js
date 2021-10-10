console.log("Location:", window.location.href);

browser.runtime.onMessage(function() {
  console.log("Got message:", arguments);
});