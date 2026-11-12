const API_URL = "http://localhost:8081";

const cartItems = document.querySelector("#cartItems");
const totalPrice = document.querySelector("#totalPrice");

document.addEventListener("DOMContentLoaded", () => {
    loadCart();
})

async function loadCart() {

    const token = sessionStorage.getItem("token");

    if (!token) {
        cartItems.innerHTML = "<p>Faça login para ter acesso ao carrinho.</p>";
        totalPrice.textContent = "Total: R$ 0,00";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/cart`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar carrinho: ${response.status}`);
        }

        const cart = await response.json();

        renderCart(cart);
    } catch (error) {

        console.error("Erro ao carregar carrinho:", error);
        cartItems.innerHTML = "<p>Não foi possivel carregar seu carrinho.</p>";
    }
}

function renderCart(cart) {

    cartItems.innerHTML = "";

    if (!cart.items || cart.items.length === 0) {

        cartItems.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalPrice.textContent = "Total: R$ 0,00";
        return;
    }

    cart.items.forEach(product => {

        cartItems.innerHTML += `
                <div class="cart-item">
                        
                      <img src="../images/${product.image}" alt="${product.name}">

                      <h2>${product.name}</h2>

                      <p>
                          Preço: R$ ${Number(product.price)
                               .toFixed(2).replace(".", ",")}
                      </p>

                      <div class="quantity-control">

                           <button
                                class="decrease"
                                data-id="${product.productId}">
                                -
                           </button>

                           <span>${product.quantity}</span>

                           <button
                                class="increase"
                                data-id="${product.productId}">
                                +
                           </button>

                      </div>

                      <p>
                          Subtotal: R$ ${Number(product.subtotal)
                                      .toFixed(2).replace(".", ",")}
                      </p>

                      <button
                          class="remove-item"
                          data-id="${product.productId}">
                          Remover
                      </button>

                </div>
        `;
    });

    totalPrice.textContent = 
        `Total: R$ ${Number(cart.total).toFixed(2).replace(".", ",")}`;

    registerCartEvents();
}

function registerCartEvents() {

    document.querySelectorAll(".increase").forEach(button => {

        button.addEventListener("click", increaseQuantity);

    });

    document.querySelectorAll(".decrease").forEach(button => {
        button.addEventListener("click", decreaseQuantity);
    });

    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", removeItem);
    });
}

async function updateQuantity(productId, quantity) {

    const token = sessionStorage.getItem("token");

    try {

        const response = await fetch(
            `${API_URL}/cart/item/${productId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ quantity })
            }
        );

        if (!response.ok) {
            throw new Error(`Erro ao atualizar quantidade: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro ao atualizar quantidade: ", error);
    }
}

function increaseQuantity(event) {

    const productId = event.currentTarget.dataset.id;

    const quantity = Number(
        event.currentTarget.parentElement.querySelector("span").textContent
    );

    updateQuantity(productId, quantity + 1);
    window.location.reload();
}

function decreaseQuantity(event) {

    const productId = event.currentTarget.dataset.id;

    const quantity = Number(
        event.currentTarget.parentElement.querySelector("span").textContent
    );

    if (quantity > 1) {
        updateQuantity(productId, quantity - 1);
        window.location.reload();
    }
}

async function removeItem(event) {

    const productId = event.currentTarget.dataset.id;
    const token = sessionStorage.getItem("token");

    try {

        const response = await fetch(
            `${API_URL}/cart/item/${productId}`,
            {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Erro ao remover produto: ${response.status}`);
        }

        const cart = await response.json();
        renderCart(cart);
        window.location.reload();
    } catch (error) {

        console.error("Erro ao remover produto:", error);
    }
}