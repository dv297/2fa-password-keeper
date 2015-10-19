function save_options(e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;

    chrome.storage.sync.set({
        email: email,
        phone: phone
    }, function () {
        var status = document.getElementById("status");
        status.textContent = "Options saved!";
        setTimeout(function () {
            status.textContent = "";
        }, 2000);
    });
};

function restore_options(e) {
    e.preventDefault();
    chrome.storage.sync.get({
        email: "",
        phone: ""
    }, function (items) {
        document.getElementById("email").value = items.email;
        document.getElementById("phone").value = items.phone;
    });
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
