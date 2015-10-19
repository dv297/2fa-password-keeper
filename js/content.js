chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
        var firstHref = "http://www.google.com";
        var message = {
            "message": "open_new_tab",
            "url": firstHref
        };
        chrome.runtime.sendMessage(message);
    }
});
