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