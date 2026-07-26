const searchInput = document.querySelector("#searchProduct");

const categoryFilter = document.querySelector("#categoryFilter");

const cards = document.querySelectorAll(".product-card");

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

const productsGrid = document.querySelector(".products-grid");

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
