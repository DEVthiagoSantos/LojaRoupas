const cartItems = document.querySelector("#cartItems");

const totalPrice = document.querySelector("#totalPrice");

const cart = JSON.parse(
    localStorage.getItem("cart")
) || [];

console.log(cart);

let total = 0;

cart.forEach(product => {

    total += product.price * product.quantity;

    cartItems.innerHTML += `
          
        <div class="cart-item">

            <h3>${product.name}</h3>

            <p>Preço: R$ ${product.price.toFixed(2)}</p>

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
                data-id="${product.id}"
            >
                Remover
            </button>

        </div>
    `;

});

const increaseButtons = document.querySelectorAll(".increase");

const decreaseButtons = document.querySelectorAll(".decrease");

const removeButtons = document.querySelectorAll(".remove-item");

increaseButtons.forEach(button => {

    button.addEventListener("click", increaseQuantity);

})

decreaseButtons.forEach(button => {

    button.addEventListener("click", decreaseQuantity);
})

removeButtons.forEach(button => {

    button.addEventListener("click", removeItem);
});

function increaseQuantity(event) {

    const id = event.target.dataset.id;

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const product = cart.find(item => item.id === id);

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

    const id = event.target.dataset.id;

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    const product = cart.find(item => item.id === id);

    if (product) {

        if (product.quantity > 1) {

            product.quantity--;

        }
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();
}

function removeItem(event) {

    const id = event.target.dataset.id;

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    cart = cart.filter(product => {

        return product.id != id;
    });

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    location.reload();

}

totalPrice.textContent = `Total: R$ ${total.toFixed(2)}`;