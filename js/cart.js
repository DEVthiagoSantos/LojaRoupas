const cartItems = document.querySelector("#cartItems");
const totalPrice = document.querySelector("#totalPrice");

let cart = JSON.parse(
    localStorage.getItem("cart")
) || [];

console.log("Carrinho:", cart);

let total = 0;

cartItems.innerHTML = "";

cart.forEach(product => {

    total += Number(product.price) * product.quantity;

    cartItems.innerHTML += `
             <div class="cart-item">

                 <h2>${product.name}</h3>

                 <p>
                    Preço: R$ ${Number(product.price)
                        .toFixed(2).replace(".", ",")}
                 </p>

                 <div class="quantity-control">

                    <button
                        class="decrease"
                        data-id="${product.id}">
                        -
                    </button>

                    <span>
                        ${product.quantity}
                    </span>

                    <button
                        class="increase"
                        data-id="${product.id}">
                        +
                    </button>

                 </div>

                 <button
                    class="remove-item"
                    data-id="${product.id}">
                    Remover
                 </button>
            
             </div>
    `
});

const increaseButtons = document.querySelectorAll(".increase");

const decreaseButtons = document.querySelectorAll(".decrease");

const removeButtons = document.querySelectorAll(".remove-item");

increaseButtons.forEach(button => {

    button.addEventListener("click", increaseQuantity);

});

decreaseButtons.forEach(button => {
    
    button.addEventListener("click", decreaseQuantity);
});

removeButtons.forEach(button => {

    button.addEventListener("click", removeItem);
});

function increaseQuantity(event) {

    const id = String(event.target.dataset.id);

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const product = cart.find(item => {

        return String(item.id) === id;
    });

    if (product) {

        product.quantity++;
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();
}

function decreaseQuantity(event) {

    const id = String(event.target.dataset.id);

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const product = cart.find(item => {

        return String(item.id) === id;
    });

    if (product && product.quantity > 1) {

        product.quantity--;
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();
}

function removeItem(event) {

    const id = String(event.target.dataset.id);

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    cart = cart.filter(product => {

        return String(product.id) !== id;
    });

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();

}

totalPrice.textContent = 
`Total: R$ ${total.toFixed(2).replace(".", ",")}`;