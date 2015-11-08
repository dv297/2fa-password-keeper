// Save the options to local stroage
function save_options(e) {
    e.preventDefault();
    var masterPassword = document.getElementById("masterPassword").value;
    var key = document.getElementById("key").value;

    var json = {};
    json["masterPassword"] = masterPassword;
    json["key"] = key;

    chrome.storage.sync.set(json, function () {
        var status = document.getElementById("status");
        var oldStatus = status.textContent;
        status.textContent = "Options saved!";
        setTimeout(function () {
            status.textContent = oldStatus;
        }, 2000);
    });
};

document.getElementById("save").addEventListener("click", save_options);
