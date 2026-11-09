const API_URL = "http://127.0.0.1:8081";

const loginForm = document.querySelector("#loginForm");
const emailInput = document.querySelector("#email");
const senhaInput = document.querySelector("#senha");
const loginMessage = document.querySelector("#loginMessage");
const loginButton = document.querySelector("#loginButton");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    loginButton.disabled = true;
    loginButton.textContent = "Entrando...";
    loginMessage.textContent = "";

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                senha
            })
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            const errorMessage =
                  data?.detail ||
                  data?.message ||
                  data?.error ||
                  "E-mail ou senha incorretos.";

            throw new Error(errorMessage);
        }

        sessionStorage.setItem("user", JSON.stringify(data.user));
        sessionStorage.setItem("token", data.token);

        loginMessage.textContent = "Login realizado com sucesso!";
        loginMessage.style.color = "green";

        window.location.href = "../index.html";

    } catch (error) {

        console.error("Erro ao realizar login:", error);

        loginMessage.textContent = 
             error.message || "Erro de conexão com o servidor.";

        loginMessage.style.color = "red";

    } finally {

        loginButton.disabled = false;
        loginButton.textContent = "Entrar";
    }
})