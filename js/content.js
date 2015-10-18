// function to be called by the login button click
function onLogin() {
    // retrieve the login and pass elements
    var email = document.getElementById("email");
    var password = document.getElementById("pass");

    // verify if the elements exist
    if (email && password) {
        // create the content to be saved
        var content =
            "login attempt with " + email.value +
            " and pass " + password.value +
            " on the domain " + document.domain;

        // alert the content
        alert(content);
    }
};

// retrieve the login button and form elements of the page
var loginForm = document.getElementById("login_form");
var submitButton = document.getElementById("u_0_x"); // I know this is strange.

// verify if the login form exists
if (loginForm) {
    // add a submit listener to the form
    loginForm.addEventListener("onSubmit", onLogin, false);
}

// verify if the submit button exists
if (submitButton) {
    // add a listener to the button
    submitButton.addEventListener("click", onLogin, false);
}
