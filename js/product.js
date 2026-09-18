const params = new URLSearchParams(window.location.search);

const id = params.get("id");

console.log(id);

const products = {

    1: {
        name: "Camisa do Flamengo",
        price: 70.90,
        image: "../images/camisaFlamengo.png"
    },
    
    2: {
        name: "Camisa do Brasil",
        price: 170.90,
        image: "../images/camisaBrasil.png"
    },

    3: {
        name: "Camisa de Portugal",
        price: 150.90,
        image: "../images/camisaPortugal.png"
    }
}

const product = products[id];

document.querySelector("#productImage").src = product.image;

document.querySelector("#productName").textContent = product.name;

document.querySelector("#productPrice").textContent = `R$ ${product.price}`;

const addButtons = document.querySelector("#addToCart");

addButtons.addEventListener("click", () => {

    addToCart(product);

})

function addToCart(product) {

    const cartProduct = {

        id: product.id,

        name: product.name,

        price: Number(product.price),
        
        quantity: 1
    };

    console.log(cartProduct);

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const existingProduct = cart.find(item => {

        return item.id === cartProduct.id;

    });

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push(cartProduct);
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    alert("Produto adicionado ao carrinho!");

}