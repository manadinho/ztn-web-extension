let auth_url = "https://ztn.revbits.net:4200/auth/login";

chrome.storage.sync.get(["credentials"], (result) => {
  if (result.credentials) {
    const credentials = JSON.parse(result.credentials);
    auth_url =
      credentials.auth_url || "https://ztn.revbits.net:4200/auth/login";
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  // read changeInfo data and do something with it (like read the url)

  if (
    changeInfo.url &&
    [
      auth_url,
      "http://ztn-uat.revbits.net/auth/login",
      "https://ztn.revbits.com/auth/login",
    ].includes(changeInfo.url.split("?")[0])
  ) {
    sendEventUrlFound();
  }
});

function sendEventUrlFound() {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.webNavigation.getAllFrames({ tabId: tabId }, function (details) {
      details.forEach(function (frame) {
        chrome.tabs.sendMessage(
          tabId,
          { data: "auth_url_found" },
          { frameId: frame.frameId },
          function (response) {
            // console.log(response);
          }
        );
      });
    });
  });
}
