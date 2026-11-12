const searchInput = document.querySelector("#searchInput");

const productCards = document.querySelectorAll(".product-card");

searchInput.addEventListener("keyup", function () {

    const search = searchInput.value.toLowerCase();

    productCards.forEach(function (card){

        const productName = card.querySelector("h3")
        .textContent.toLowerCase();

        if (productName.includes(search)) {

            card.style.display = "block";
        } else {

            card.style.display = "none";
        }
    });
});

async function addToCart(event) {

    const token = sessionStorage.getItem("token");

    if (!token) {
        alert("Faça login ara adicionar produtos ao carrinho.");
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

const API_URL = "http://localhost:8081";

async function loadProducts() {

    try {

        const response = await fetch(`${API_URL}/product`);

        if (!response.ok) {
            throw new Error("Erro ao buscar produtos");
        }

        const products = await response.json();

        console.log("Produtos recebidos da API:", products);

        const productsGrid = document.querySelector("#productsGrid");

        productsGrid.innerHTML = "";

        products.forEach(product => {

            productsGrid.innerHTML += `
                        <article
                            class="product-card"
                            data-id="${product.id}"
                            data-name="${product.name}"
                            data-price="${product.price}"
                            data-category="${product.category_id}"
                        >

                        <div class="product-image">
                             
                             <img
                                 src="images/${product.image}"
                                 alt="${product.name}"
                             >
                        </div>

                        <div class="product-info">

                             <span class="category">
                                  ${product.category_name}
                             </span>

                             <h3>
                                 ${product.name}
                             </h3>

                             <p>
                                ${product.description}
                             </p>

                             <span class="price">
                                  R$
                                  ${Number(product.price).toFixed(2).replace(".", ",")}
                             </span>

                             <button class="add-cart">
                                  Adicionar ao carrinho
                             </button>

                        </div>
                    </article>
            `;
        });

    } catch(error) {

        console.error("Erro: ", error);
    }
}

loadProducts();

const productGrid = document.querySelector("#productsGrid");

productGrid.addEventListener("click", event => {

    const card = event.target.closest(".product-card")

    if (!card) {
        return;
    }

    // Se clicou no botão de adicionar ao carrinho
    // não abre a página do produto.

    if (event.target.closest(".add-cart")) {

        addToCart(event);

        return;
    }

    const id = card.dataset.id;

    window.location.href = `pages/produto.html?id=${id}`;
})