chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "form_on_page") {
        chrome.tabs.create({"url": "popup.html"});
    }
});
