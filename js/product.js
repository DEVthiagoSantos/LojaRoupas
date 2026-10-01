const API_URL = "http://localhost:8081";

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

console.log("ID do produto:", id);

async function loadProduct() {

    try {

        const response = await fetch(`${API_URL}/product/${id}`);

        if (!response.ok) {

            throw new Error("Produto não encontrado");

        }

        const product = await response.json();

        console.log("Produto recebido da API:", product);

        document.querySelector("#productImage").src = 
        `../images/${product.image}`;

        document.querySelector("#productImage").alt = 
        product.name;

        document.querySelector("#productName").textContent =
        product.name;

        document.querySelector("#productPrice").textContent =
        `R$ ${Number(product.price).toFixed(2).replace(".", ",")}`;

        const addButton = document.querySelector("#addToCart");

        addButton.addEventListener("click", () => {

            addToCart(product);
        })
    } catch(error) {

        console.error("Erro ao carregor produto:", error);
    }
}

function addToCart(product) {

    const cartProduct = {

        id: product.id,

        name: product.name,

        price: Number(product.price),

        quantity: 1
    };

    console.log("Produto para o carrinho:", cartProduct);

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

loadProduct();