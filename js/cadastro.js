const API_URL = "http://localhost:8081";

const registerForm = document.querySelector("#registerForm");

const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const senhaInput = document.querySelector("#senha");
const confirmarSenhaInput = document.querySelector("#confirmarSenha");

const registerMessage = document.querySelector("#registerMessage");
const registerButton = document.querySelector("#registerButton");

registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;
    const confirmarSenha = confirmarSenhaInput.value;

    if (senha !== confirmarSenha) {
        registerMessage.textContent = "As senhas não coincidem.";
        registerMessage.style.color = "red";
        return;
    }

    registerButton.disabled = true;
    registerButton.textContent = "Cadastrando...";

    registerMessage.textContent = "";

    try {

        const response = await fetch(`${API_URL}/users/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                user_name: name,
                email: email,
                senha: senha
            })
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {

            const errorMessage =
                  data?.detail ||
                  data?.message ||
                  data?.error ||
                  "Não foi possível realizar o cadastro.";

            throw new Error(errorMessage);
        }

        registerMessage.textContent = "Cadastro realizado com sucesso!";
        registerMessage.style.color = "green";

        registerForm.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    } catch (error) {

        console.error("Erro ao cadastrar usuário:", error);

        registerMessage.textContent =
            error.message ||"Erro de conexão com o servidor.";

        registerMessage.style.color = "red";
    } finally {

        registerButton.disabled = false;
        registerButton.textContent = "Criar conta";
    }

});