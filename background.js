(function() {
  if (window.prntscLoaded) return;
  window.prntscLoaded = true;

  var ascii = "qwertyuiopasdfghjklzxcvbnm".split("");
  var numbers = "1234567890".split("");
  var randomMode = true;

  function random(array) {
    return array[~~(Math.random() * array.length)];
  }

  function randomURI() {
    return [
      random(ascii),
      random(ascii),
      random(numbers),
      random(numbers),
      random(numbers),
      random(numbers),
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

  function generateURL(mode, path) {
    if (mode === "random" || !path) return new URL(randomURI(), "https://prnt.sc").href
    return new URL(path.slice(1, 3) + (+path.slice(3) + 1) % 10000, "https://prnt.sc").href
  }

  function updateTabIfPrntSc(activeTab) {
    const currentUrl = new URL(activeTab.url);
    var mode = randomMode || currentUrl.pathname === "/" ? "random" : "incremental"
    console.log({mode, randomMode})
    if (isPrntSc(activeTab.url)) {
      browser.tabs.update(activeTab.id, {
        url: generateURL(mode, currentUrl.pathname)
      })
    }
  }

  browser.contextMenus.create({
    id: "mode-random",
    title: "Mode: Random"
  });

  browser.browserAction.onClicked.addListener(goToRandom);

  browser.contextMenus.onClicked.addListener(function(info, tab) {
    browser.contextMenus.removeAll();
    if (info.menuItemId === "mode-random") {
      browser.contextMenus.create({
        id: "mode-incremental",
        title: "Mode: Incremental"
      });
      randomMode = false;
    } else {
      browser.contextMenus.create({
        id: "mode-random",
        title: "Mode: Random"
      });
      randomMode = true;
    }

    goToRandom(tab);
  });
})();