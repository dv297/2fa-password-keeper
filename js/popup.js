/***************************************************************
 * Checks the pin with what we have storeed and shows the
 * password if the pin is correct.
**/
function checkPin (e) {
    e.preventDefault();

    var submittedPin = document.getElementById("pin").value;

    chrome.storage.sync.get(function (items) {

        // Hash what the user submitted
        var submittedPinHash = CryptoJS.SHA512(submittedPin).toString();

        // Compare pins
        if (items.pin === submittedPinHash) {
            chrome.tabs.query({'active': true}, function (tabs) {
                var url = tabs[0].url;
                var regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/;
                var domain = url.replace(regex, "$1");

                // Display the password
                document.getElementById("retrievedPassword").textContent = items[domain];
                document.getElementById("passwordBox").style.display = "block";

                // Hide the qr code and input field
                document.getElementById("pinBox").style.display = "none";
                document.getElementById("qrcodeBox").style.display = "none";

            });
        } else {
            document.getElementById("retrievedPassword").textContent = "";
            document.getElementById("passwordBox").style.display = "none";

            // Relay the error to the UI
            var status = document.getElementById("status")
            var oldStatus = status.textContent;
            status.textContent = "Not a valid pin.";
            setTimeout(function () {
                status.textContent = oldStatus;
            }, 2000);
        }
    });
};

/***************************************************************
 * Generate a password by generating a random number, changing
 * to a string, creating a length 32 substring, then hashing it
 * with SHA512.
**/
function generateBarCode (e) {
    e.preventDefault();

    // DOM Nodes that we will need
    var credentialsBox = document.getElementById("credentialsBox");
    var pinBox = document.getElementById("pinBox");
    var qrcodeBox = document.getElementById("qrcodeBox");

    // User input
    var submittedPassword = document.getElementById("masterPassword").value;

    // Get the real password from storage
    chrome.storage.sync.get(function (items) {
        if (items.masterPassword === submittedPassword) {

            // Create the pin
            var pin = createPin(8);
            console.log(pin);
            // Hash the pin for local storage
            var pinHash = CryptoJS.SHA512(pin).toString();

            var json = {};
            var key = "pin";
            var value = pinHash;
            json[key] = pinHash;

            chrome.storage.sync.set(json, function () {
                // Encrypt the pin with the app key
                var rkEncryptionKey = CryptoJS.enc.Base64.parse(items.key);              
                
                // Creates an initialization vector to send to the mobile device
                var iv = CryptoJS.lib.WordArray.random(16);
                var rkIv = CryptoJS.enc.Hex.stringify(iv);
                
                var encrypted = CryptoJS.AES.encrypt(pin, rkEncryptionKey, {mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv});

                // Generate QR Code, delimits the IV from the encrypted message using a colon
                var qrText = rkIv + ":" + encrypted.toString();
                var code = new QRCode(qrcodeBox, qrText);

                // Clear the password
                document.getElementById("masterPassword").value = "";

                // Show the QR Code and the Pin Box
                credentialsBox.style.display = "none";
                pinBox.style.display = "block";
                qrcodeBox.style.display = "block";
            });
        } else {
            // Hide the QR Code and the Pin Box
            crednetialsBox.style.dispaly = "block";
            pinBox.style.display = "none";
            qrcodeBox.style.display = "none";
        }
    });
};

/***************************************************************
 * Generate a password by generating a random number, changing
 * to a string, creating a length 32 substring, then hashing it
 * with SHA512.
**/
function generatePassword () {
    var number = Math.random() * 9999999999;
    var binary = number.toString(2);
    var generatedPassword = CryptoJS.SHA512(binary).toString();
    document.getElementById("generatedPassword").textContent = generatedPassword;
};

function createPin (length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

/***************************************************************
 * Decide what part of the pop up we need to show.
**/
function manipulatePopup () {
    chrome.tabs.query({'active': true}, function (tabs) {
        var url = tabs[0].url;
        var regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/;
        var domain = url.replace(regex, "$1");
        chrome.storage.sync.get(domain, function (items) {
            if (items[domain]) {
                document.getElementById("create").style.display = "none";
            } else {
                document.getElementById("retrieve").style.display = "none";
            }
        });
    });
};
/***************************************************************
 * We save the password to the local storage for later
 * retrieval. It should be encrypted, and the encryption
 * technique should not be known, even if someone were able to
 * get this source code.
**/
function save () {
    var generatedPassword = document.getElementById("generatedPassword");
    chrome.tabs.query({'active': true}, function (tabs) {
        var url = tabs[0].url;
        var regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/;
        var domain = url.replace(regex, "$1");

        // Set the key value pair to be inserted.
        var key = domain;
        var value = generatedPassword.textContent;
        var json = {};
        json[key] = value;

        // Save to storage
        chrome.storage.sync.set(json, function () {
            // Select the password and prepare to copy
            var range = document.createRange();
            range.selectNode(generatedPassword);
            window.getSelection().addRange(range);

            try {
                var isSuccessful = document.execCommand("copy");
                if (isSuccessful) {
                    // Relay the success to the UI
                    var status = document.getElementById("status")
                    var oldStatus = status.textContent;
                    status.textContent = "Copied to clipboard!";
                    setTimeout(function () {
                        status.textContent = oldStatus;
                    }, 2000);
                }
            } catch (exception) {
                // Catch the error
            }

            window.getSelection().removeAllRanges();
        });
    });
}

// Generate it the first time
generatePassword();

// Decide what we want to show
manipulatePopup();

// Add listeners for our buttons
document.getElementById("save").addEventListener("click", save);
document.getElementById("regenerate").addEventListener("click", generatePassword);
document.getElementById("submitMasterPassword").addEventListener("click", generateBarCode);
document.getElementById("submitPin").addEventListener("click", checkPin);
