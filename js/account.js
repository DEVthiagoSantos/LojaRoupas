const loggedOut = document.querySelector("#loggedOut");
const loggedIn = document.querySelector("#loggedIn");

const accountName = document.querySelector("#accountName");
const accountAvatar = document.querySelector("#accountAvatar");

const logoutButton = document.querySelector("#logoutButton");

const openProfileMenu = document.querySelector("#openProfileMenu");
const profileOverlay = document.querySelector("#profileOverlay");
const closeProfileMenu = document.querySelector("#closeProfileMenu");

const user = JSON.parse(sessionStorage.getItem("user"));

// Verifica se existe um usuário autenticado
if (user) {

    if (loggedOut) loggedOut.hidden = true;
    if (loggedIn) loggedIn.hidden = false;

    if (accountName) {
        accountName.textContent = user.name;
    }

    if (accountAvatar) {
        accountAvatar.textContent = user.name.trim().charAt(0)
        .toUpperCase();
    }


} else {
    if (loggedOut) loggedOut.hidden = false;
    if (loggedIn) loggedIn.hidden = true;
}

// Abre o painel de perfil
if (openProfileMenu && profileOverlay) {

    openProfileMenu.addEventListener("click", () => {
        profileOverlay.classList.add("active");
    });
}

// Fecha o painel pelo botão X
if (closeProfileMenu && profileOverlay) {
    
    closeProfileMenu.addEventListener("click", () => {
        profileOverlay.classList.remove("active");
    });
}

// Fecha o painel ao clicar fora dele
if (profileOverlay) {

    profileOverlay.addEventListener("click", (event) => {

        if (event.target === profileOverlay) {
            profileOverlay.classList.remove("active");
        }
    });
}

// Encerra a sessão
if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");

        window.location.href = window.location.pathname.includes("/pages/")
        ? "../index.html"
        : "index.html";
    });
}