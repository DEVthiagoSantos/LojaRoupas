const API_URL = "http://localhost:8081";

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

console.log("ID do produto:", id);

async function loadProduct() {

    try {

        const response = await fetch(`${API_URL}/product/${id}`);

        if (!response.ok) {

            throw new Error("Produto não encontrado");

        }

        const product = await response.json();

        console.log("Produto recebido da API:", product);

        document.querySelector("#productImage").src = 
        `../images/${product.image}`;

        document.querySelector("#productImage").alt = 
        product.name;

        document.querySelector("#productName").textContent =
        product.name;

        document.querySelector("#productPrice").textContent =
        `R$ ${Number(product.price).toFixed(2).replace(".", ",")}`;

        const addButton = document.querySelector("#addToCart");

        addButton.addEventListener("click", () => {

            addToCart(product);
        })
    } catch(error) {

        console.error("Erro ao carregor produto:", error);
    }
}

async function addToCart(event) {

    const token = sessionStorage.getItem("token");

    if (!token) {
        alert("Faça login para adicionar produtos ao carrinho.");
        return;
    }

    const card = event.target.closest(".product-card");
    
    if (!card) {
        console.error("Card do produto não encontrado.");
        return;
    }

    const product = {
        productId: Number(card.dataset.id),
        quantity: 1
    };

    console.log("Produto enviado:", product);

    try {

        const response = await fetch(`${API_URL}/cart/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error(`Erro ao adicionar produto: ${response.status}`);
        }

        const cart = await response.json();

        console.log("Carrinho atualizado:", cart);

        alert("Produto adicionado ao carrinho!");

    } catch (error) {

        console.error("Erro ao adicionar produto ao carrinho:", error);
        alert("Não foi possível adicionar o produto ao carrinho.");
    }
}

loadProduct();