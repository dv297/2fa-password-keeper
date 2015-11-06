// Save the options to local stroage
function save_options(e) {
    e.preventDefault();
    var masterPassword = document.getElementById("masterPassword").value;

    var key = "masterPassword";
    var value = masterPassword;
    var json = {};
    json[key] = value;

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
