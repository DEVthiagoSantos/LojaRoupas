const API_URL = "http://localhost:8081";

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

const purchaseModal = document.querySelector("#purchaseModal");
const buyButton = document.querySelector("#buyButton");
const closePurchaseModal = document.querySelector("#closePurchaseModal");

const authModal = document.querySelector("#authModal");
const closeAuthModal = document.querySelector("#closeAuthModal");

console.log("ID do produto:", id);

async function loadProduct() {

    try {

        const response = await fetch(`${API_URL}/product/${id}`);

        if (!response.ok) {

            throw new Error("Produto não encontrado");

        }

        const product = await response.json();

        console.log("Produto recebido da API:", product);

        document.querySelector("#productDescription").textContent =
        product.description;

        document.querySelector("#productImage").src = 
        `../images/${product.image}`;

        document.querySelector("#productImage").alt = 
        product.name;

        document.querySelector("#productName").textContent =
        product.name;

        document.querySelector("#productPrice").textContent =
        `R$ ${Number(product.price).toFixed(2).replace(".", ",")}`;

        await loadRelatedProducts(product);

        const buyButton = document.querySelector("#buyButton");

        buyButton.addEventListener("click", () => {

            const token = sessionStorage.getItem("token");

            if (!token) {

                authModal.style.display = "flex";

                return;
            }


            purchaseModal.style.display = "flex";
        });

        const addButton = document.querySelector("#addToCart");

    } catch(error) {

        console.error("Erro ao carregor produto:", error);
    }
}

closeAuthModal.addEventListener("click", () => {

    authModal.style.display = "none";

});

authModal.addEventListener("click", (event) => {

    if (event.target === authModal) {

        authModal.style.display = "none";
    }
});

closePurchaseModal.addEventListener("click", () => {

    purchaseModal.style.display = "none";

});

purchaseModal.addEventListener("click", (event) => {

    if (event.target === purchaseModal) {

        purchaseModal.style.display = "none";
    }
});

async function addToCart(product) {

    const token = sessionStorage.getItem("token");

    if (!token) {
        alert("Faça login para adicionar produtos ao carrinho");
        return;
    }

    const productData = {
        productId: Number(product.id),
        quantity: 1
    };

    console.log("Produto enviado:", productData);

    try {

        const response = await fetch(`${API_URL}/cart/add`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error(
                `Erro ao adicionar produto: ${response.status}`
            );
        }

        const cart = await response.json();

        console.log("Carrinho atualizado:", cart);

        alert("Produto adicionado ao carrinho!");

    } catch (error) {

        console.error("Erro ao adicionar produto ao carrinho:", error);
        alert("Não foi possivel adicionar o produto ao carrinho.");
    }
}

async function loadRelatedProducts(currentProduct) {

    const container = document.querySelector("#relatedProducts");

    try {

        const response = await fetch(`${API_URL}/product`);


        if (!response.ok) {
            throw new Error("Erro ao buscar produtos relacionados.");
        }

        const products = await response.json();

        console.log("Produtos recebidos: ", products);

        const relatedProducts = products.filter(product => 
            product.category_id === currentProduct.category_id &&
            product.id !== currentProduct.id
        )
        .slice(0, 4);

        container.innerHTML = "";

        if (relatedProducts.length === 0) {

            container.textContent =
             "Não encontramos outros produtos desta categoria.";

             return;
        }

        relatedProducts.forEach(product => {
            
            const card = document.createElement("div");

            card.classList.add("related-product-card");

            card.innerHTML = `
                    
                    <div class="related-product-image">
                         
                         <img
                             src="../images/${product.image}"
                             alt="${product.name}"
                         >
                    </div>


                    <div class="related-product-info">

                          <h3>${product.name}</h3>

                          <p class="related-product-price">
                              R$ ${Number(product.price).toFixed(2).replace(".", ",")}
                          </p>

                          <button class="add-cart">
                                 Adicionar ao Carrinho
                          </button>

                    </div>

            `;

            // Abrir detalhes do produto
            card.addEventListener("click", () => {

                window.location.href =
                      `produto.html?id=${product.id}`;
            });

            const button = card.querySelector(".add-cart");

            button.addEventListener("click", event => {

                event.stopPropagation();

                addToCart(product);
            });

            container.appendChild(card);
        });
    } catch (error) {

        console.error(
            "Erro ao carregar produtos relacionados:",
            error
        );

        container.textContent =
         "Não foi possível carregar os produtos relacionados.";
    }
}

loadProduct();