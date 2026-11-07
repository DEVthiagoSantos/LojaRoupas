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

function addToCart(event) {

    const card = event.target.closest(".catalog-card");

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