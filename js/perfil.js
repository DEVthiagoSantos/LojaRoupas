
(() => {

    const API_URL = "http://localhost:8081";

    let user = JSON.parse(sessionStorage.getItem("user"));

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

    let currentImageURL = null;

    // Verifica se os elementos do perfil existem nesta página
    if (!profileImage || !profileForm) {
        return;
    }

    // Verifica se existe um usuário conectado
    if (!user) {
        return;
    }

    // Preenche os dados do usuário
    function carregarDadosUsuario() {

        profileName.textContent = user.name;
        profileEmail.textContent = user.email;

        nameInput.value = user.name;
        emailInput.value = user.email;

    }

    carregarDadosUsuario();

    // Habilita a edição dos campos
    editProfileButton.addEventListener("click", () => {

        nameInput.readOnly = false;
        emailInput.readOnly = false;

        editProfileButton.hidden = true;
        saveProfileButton.hidden = false;

        profileMessage.textContent = "";

    });

    // Salva os dados do perfil
    profileForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();

        if (!name || !email) {

            profileMessage.textContent = "Preencha todos os campos.";
            profileMessage.style.color = "red";

            return;
        }

        user = {
            ...user,
            name: name,
            email: email
        };

        sessionStorage.setItem("user", JSON.stringify(user));

        carregarDadosUsuario();

        // Atualiza também o cabeçalho
        const accountName = document.querySelector("#accountName");
        const accountAvatar = document.querySelector("#accountAvatar");

        if (accountName) {
            accountName.textContent = user.name;
        }

        if (accountAvatar) {
            accountAvatar.textContent = user.name.trim().charAt(0).toUpperCase();
        }

        nameInput.readOnly = true;
        emailInput.readOnly = true;

        editProfileButton.hidden = false;
        saveProfileButton.hidden = true;

        profileMessage.textContent = "Dados atualizados nesta sessão.";
        profileMessage.style.color = "green";

    });

    // Carrega a imagem de perfil
    async function carregarImagemPerfil() {

        const token = sessionStorage.getItem("token");

        if (!token) {
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

            if (currentImageURL) {
                URL.revokeObjectURL(currentImageURL);
            }

            currentImageURL = URL.createObjectURL(imageBlob);

            profileImage.src = currentImageURL;

        } catch (error) {

            console.error("Erro ao carregar imagem de perfil:", error);

        }

    }

    carregarImagemPerfil();

    // Envia uma nova foto de perfil
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

            profileMessage.textContent = "Selecione uma imagem JPEG, PNG ou WEBP.";
            profileMessage.style.color = "red";

            photoInput.value = "";

            return;
        }

        if (file.size > 5 * 1024 * 1024) {

            profileMessage.textContent = "A imagem não pode ultrapassar 5 MB.";
            profileMessage.style.color = "red";

            photoInput.value = "";

            return;
        }

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

            profileMessage.textContent = "Foto de perfil atualizada.";
            profileMessage.style.color = "green";

        } catch (error) {

            console.error("Erro ao atualizar foto:", error);

            profileMessage.textContent = "Não foi possível atualizar a foto.";
            profileMessage.style.color = "red";

        } finally {

            photoInput.value = "";

        }

    });

})();
