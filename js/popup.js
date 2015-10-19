/***************************************************************
 * Generate a password by generating a random number, changing
 * to a string, creating a length 32 substring, then hashing it
 * with SHA512.
**/
function generatePassword () {
    var number = Math.random() * 9999999999;
    var binary = number.toString(2);
    var generatedPassword = CryptoJS.SHA512(binary);
    document.getElementById("generatedPassword").textContent = generatedPassword;
};

/***************************************************************
 * We save the password to the local storage for later
 * retrieval. It should be encrypted, and the encryption
 * technique should not be known, even if someone were able to
 * get this source code.
**/
function save () {
    var generatedPassword = document.getElementById("generatedPassword");

    // TODO: Save to storage

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
}

// Generate it the first time
generatePassword();

// Add listeners for our buttons
document.getElementById("save").addEventListener("click", save);
document.getElementById("regenerate").addEventListener("click", generatePassword);
