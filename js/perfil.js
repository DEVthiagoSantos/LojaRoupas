const user = JSON.parse(sessionStorage.getItem("user"));

const profileImage = document.querySelector("#profileImage");
const photoInput = document.querySelector("#photoInput");

const profileName = document.querySelector("#profileName");
const profileEmail = document.querySelector("#profileEmail");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");

const profileForm = document.querySelector("#profileForm");
const profileMessage = document.querySelector("#profileMessage");

const editProfileButton = document.querySelector("#editProfileButton");
const saveProfileButton = document.querySelector("#saveProfileButton");

let selectedPhoto = null;

// Verifica se existe um usuário conectado
if (!user) {
    window.location.href = "login.html";
}

if (user) {

    profileName.textContent = user.name;
    profileEmail.textContent = user.email;

    nameInput.value = user.name;
    emailInput.value = user.email;

}

// Habilita a edição dos campos
editProfileButton.addEventListener("click", () => {

    nameInput.readOnly = false;
    emailInput.readOnly = false;

    editProfileButton.hidden = true;
    saveProfileButton.hidden = false;

    profileMessage.textContent = "";
});

photoInput.addEventListener("change", async () => {

    const file = photoInput.files[0];

    if (!file) {
        return;
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
        profileMessage.textContent = "Selecione uma image JPEG, PNG ou WEBP.";
        profileMessage.style.color = "red";
        photoInput.value = "";
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        profileMessage.textContent = "A imagem não pode ultrapassar 5 MB";
        profileMessage.style.color = "red";
        photoInput.value = "";
        return;
    }

    const imageUrl = URL.createObjectURL(file);
    profileImage.src = imageUrl;

    const formData = new FormData();
    formData.append("file", file);

    const token = sessionStorage.getItem("token");

    try {
        
        const response = await fetch(`${API_URL}/users/profile-image`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erro no upload: ${response.status}`);
        }

        await carregarImagemPerfil();

        profileMessage.textContent = "Foto de perfil atualizada";
        profileMessage.style.color = "green";

    } catch (error) {

        console.error("Erro ao atualizar foto:", error);

        profileMessage.textContent = "Não foi possivel atualizar a foto.";
        profileMessage.style.color = "red";

        await carregarImagemPerfil();

    } finally {
        URL.revokeObjectURL(imageUrl);
        photoInput.value = "";
    }

});

profileForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        profileMessage.textContent = "Preencha todos os campos.";
        profileMessage.style.color = "red";
        return;
    }

    const updateUser = {
        ...user,
        name: name,
        email: email
    };

    sessionStorage.setItem("user", JSON.stringify(updateUser));

    profileName.textContent = name;
    profileEmail.textContent = email;

    nameInput.readOnly = true;
    emailInput.readOnly = true;

    editProfileButton.hidden = false;
    saveProfileButton.hidden = true;

    profileMessage.textContent = "Dados atualizados nesta sessão.";
    profileMessage.style.color = "green";
});

const API_URL = "http://localhost:8081";

document.addEventListener("DOMContentLoaded", () => {
    carregarImagemPerfil();
});

async function carregarImagemPerfil() {
    const token = sessionStorage.getItem("token");
    const profileImage = document.querySelector("#profileImage");

    if (!token) {
        console.error("Usuário não autenticado.");
        return;
    }

    if (!profileImage) {
        console.error("Elemento #profileImage não encontrado.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/profile-image`, {

            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar imagem: ${response.status}`);
        }

        const imageBlob = await response.blob();

        const imageURL = URL.createObjectURL(imageBlob);

        profileImage.src = imageURL;
    } catch (error) {

        console.error("Erro ao carregar imagem de perfil:", error);
    }
}
