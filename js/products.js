const searchInput = document.querySelector("#searchProduct");

const categoryFilter = document.querySelector("#categoryFilter");

const cards = document.querySelectorAll(".catalog-card");

function filterProducts() {

    const search = searchInput.value.toLowerCase();

    const category = categoryFilter.value;

    cards.forEach(card=>{

        const name = card.querySelector("h3")
        .textContent.toLowerCase();


        const cardCategory = card.dataset.category;

        const matchName = name.includes(search);

        const matchCategory = category === "all" || cardCategory === category;
    
        if (matchName && matchCategory) {

            card.hidden = false;
        
        } else {

            card.hidden = true;

        }

    });

}

searchInput.addEventListener("input", filterProducts);

categoryFilter.addEventListener("change", filterProducts);

const sortProducts = document.querySelector("#sortProducts");

const productsGrid = document.querySelector(".catalog-grid");

function sortCards() {

    const cardsArray = Array.from(cards);

    const option = sortProducts.value;

    if (option === "price-asc") {

        cardsArray.sort((a,b) => {

            return Number(a.dataset.price) - Number(b.dataset.price);

        });

    }

    if (option === "price-desc") {

        cardsArray.sort((a,b) => {

            return Number(b.dataset.price) - Number(a.dataset.price);

        });

    }

    if (option === "name") {

        cardsArray.sort((a,b) => {

            const nameA = a.querySelector("h3").textContent;

            const nameB = b.querySelector("h3").textContent;

            return nameA.localeCompare(nameB);

        });
    }

    cardsArray.forEach(card=>{

        productsGrid.appendChild(card);

    });
}

sortProducts.addEventListener("change", sortCards);

async function addToCart(event) {

    const token = sessionStorage.getItem("token");

    if (!token) {
        alert("Faça login para adicionar produtos ao carrinho.");
        return;
    }

    const card = event.target.closest(".catalog-card");
    
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

        console.log("Productos recebidos da API:", products);

        const catalogGrid = document.querySelector("#catalogGrid");

        catalogGrid.innerHTML = "";

        products.forEach(product => {

            catalogGrid.innerHTML += `
                    <article
                         class="catalog-card"
                         data-id="${product.id}"
                         data-name="${product.name}"
                         data-price="${product.price}"
                         data-category="${product.category_id}"
                    >
                        
                         <div class="catalog-image">
                              
                              <img
                                  src="../images/${product.image}"
                                  alt="${product.name}"
                              >
                         </div>

                         <div class="catalog-info">

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
    } catch (error) {
        console.error("Erro:", error);
    }
}

loadProducts();

const catalogGrid = document.querySelector("#catalogGrid");

catalogGrid.addEventListener("click", event => {

    const card = event.target.closest(".catalog-card")

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

    window.location.href = `produto.html?id=${id}`;
})