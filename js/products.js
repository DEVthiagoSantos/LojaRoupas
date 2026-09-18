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

const productCards = document.querySelectorAll(".catalog-card");

productCards.forEach(card => {

    card.addEventListener("click", () => {

        const id = card.dataset.id;

        window.location.href = `produto.html?id=${id}`;
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