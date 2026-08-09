const params = new URLSearchParams(window.location.search);

const id = params.get("id");

console.log(id);

const products = {

    1: {
        name: "Camisa do Flamengo",
        price: "70,90",
        image: "../images/camisaFlamengo.png"
    },
    
    2: {
        name: "Camisa do Brasil",
        price: "170,90",
        image: "../images/camisaBrasil.png"
    },

    3: {
        name: "Camisa de Portugal",
        price: "150,90",
        image: "../images/camisaPortugal.png"
    }
}

const product = products[id];

document.querySelector("#productImage").src = product.image;

document.querySelector("#productName").textContent = product.name;

document.querySelector("#productPrice").textContent = `R$ ${product.price}`;
