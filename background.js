(function() {
  if (window.prntscLoaded) return;
  window.prntscLoaded = true;

  var ascii = "qwertyuiopasdfghjklzxcvbnm1234567890".split("");
  var randomMode = true;

  function random(array) {
    return array[~~(Math.random() * array.length)];
  }

  function randomURI() {
    return [
      random(ascii),
      random(ascii),
      random(ascii),
      random(ascii),
      random(ascii),
      random(ascii),
    ].join("")
  }

  function isPrntSc(url) {
    try {
      return new URL(url).hostname === "prnt.sc"
    } catch (err) {
      console.trace("error at isPrntSc:", err)
      return false;
    }
  }

  function goToRandom(tab) {
    if (tab) return updateTabIfPrntSc(tab)
    browser.tabs.query({
      active: true,
      currentWindow: true
    }).then(function(tabs) {
      var [activeTab] = tabs
      updateTabIfPrntSc(activeTab);
    });
  }

  function generateURL() {
    var id = randomURI();
    console.debug({id});
    return new URL(id, "https://prnt.sc").href;
  }

  function updateTabIfPrntSc(activeTab) {
    if (isPrntSc(activeTab.url)) {
      browser.tabs.update(activeTab.id, {
        url: generateURL()
      });
    }
  }

  browser.contextMenus.create({
    id: "mode-random",
    title: "Go Prnt.Sc"
  });

  browser.browserAction.onClicked.addListener(goToRandom);

  browser.contextMenus.onClicked.addListener(function(_info, tab) {
    goToRandom(tab);
  });
})();