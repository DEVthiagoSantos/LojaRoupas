const loggedOut = document.querySelector("#loggedOut");
const loggedIn = document.querySelector("#loggedIn");

const accountName = document.querySelector("#accountName");
const accountAvatar = document.querySelector("#accountAvatar");
const logoutButton = document.querySelector("#logoutButton");

const user = JSON.parse(sessionStorage.getItem("user"));

if (user) {

    loggedOut.hidden = true;
    loggedIn.hidden = false;

    accountName.textContent = user.name;

    accountAvatar.textContent = user.name
                 .trim()
                 .charAt(0)
                 .toUpperCase();
} else {

    loggedOut.hidden = false;
    loggedIn.hidden = true;

}

logoutButton.addEventListener("click", () => {

    sessionStorage.removeItem("user");
    window.location.href = "../index.html";

});