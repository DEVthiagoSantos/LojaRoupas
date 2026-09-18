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

        console.log(products);

    } catch (error) {

        console.error("Erro:", error);

    } 
}

loadProducts;