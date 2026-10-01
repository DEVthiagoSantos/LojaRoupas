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

const productsCards = document.querySelectorAll(".product-card");

productsCards.forEach(card => {

    card.addEventListener("click", () => {

        const id = card.dataset.id;

        window.location.href = `pages/produto.html?id=${id}`;
    });
    
});

const addButtons = document.querySelectorAll(".add-cart");

addButtons.forEach(button => {

    button.addEventListener("click", (event) => {

        event.stopPropagation();

        addToCart(event)
    });
});

function addToCart(event) {

    const card = event.target.closest(".product-card");

    const product = {

        id: card.dataset.id,

        name: card.dataset.name,

        price: Number(card.dataset.price),

        quantity: 1
    }

    console.log(product);

    let cart = JSON.parse(
    localStorage.getItem("cart")
    ) || [];

    const existingProduct = cart.find(item => {

        return item.id === product.id;
    });

    if (existingProduct) {

        existingProduct.quantity++;
    } else {

        cart.push(product);
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Produto adicionado ao carrinho!");
    
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
        return;
    }

    const id = card.dataset.id;

    window.location.href = `pages/produto.html?id=${id}`;
})