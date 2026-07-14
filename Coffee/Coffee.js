let products = [];
debugger;
products = JSON.parse(localStorage.getItem("ls_products")) || [];
bindProduct(products);
function onClickToSave() {
    debugger;
    let product = new Object();
    product.url = document.getElementById("txtUrl").value;
    product.name = document.getElementById("txtName").value;
    product.description = document.getElementById("txtDescription").value;
    product.price = document.getElementById("txtPrice").value;

    products.push(product);
    console.log(products);
    localStorage.setItem("ls_products", JSON.stringify(products));
    document.getElementById("divResult").innerHTML = JSON.stringify(products);

    document.getElementById("txtUrl").value = "";
    document.getElementById("txtName").value = "";
    document.getElementById("txtDescription").value = "";
    document.getElementById("txtPrice").value = "";
}

function bindProduct(prods = []) {
    debugger;
    if (prods.length > 0) {
        let content = "";
        for (i = 0; i < prods.length; i++) {
            content += ` <div class="coffee-card">
                <img src="${prods[i].url}" alt="${prods[i].name}">
                <h3>${prods[i].name}</h3>
                <p>${prods[i].description}</p>
                <p>₹${prods[i].price}</p>
                <button class="add-cart">Add to Cart</button>
            </div>`

        }
        document.getElementById("divCoffeeContainer").innerHTML=content;
        console.log(content);
    }
}

// Mobile Menu Toggle
const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-links");

if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
        navMenu.classList.toggle("active");
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});

// Add to Cart
let cartCount = 0;

document.querySelectorAll(".add-cart").forEach(button => {
    button.addEventListener("click", () => {
        cartCount++;

        const cart = document.querySelector("#cart-count");

        if (cart) {
            cart.textContent = cartCount;
        }

        alert("Coffee added to cart!");
    });
});


const cartBtn = document.getElementById("cartBtn");
const closeCart = document.getElementById("closeCart");
const sidebar = document.getElementById("cartSidebar");
const overlay = document.getElementById("overlay");

// Open Sidebar
cartBtn.addEventListener("click", () => {

    sidebar.classList.add("open");

    overlay.classList.add("show");

});

// Close Sidebar
closeCart.addEventListener("click", () => {

    sidebar.classList.remove("open");

    overlay.classList.remove("show");

});

// Close when clicking outside
overlay.addEventListener("click", () => {

    sidebar.classList.remove("open");

    overlay.classList.remove("show");

});


// Search Filter
const searchInput = document.querySelector("#search");

if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();

        document.querySelectorAll(".coffee-card").forEach(card => {
            const title = card.querySelector("h3").textContent.toLowerCase();

            card.style.display = title.includes(value)
                ? "block"
                : "none";
        });
    });
}

// Contact Form Validation
const form = document.querySelector("#contactForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.querySelector("#name").value.trim();
        const email = document.querySelector("#email").value.trim();
        const message = document.querySelector("#message").value.trim();

        if (!name || !email || !message) {
            alert("Please fill in all fields.");
            return;
        }

        alert("Message sent successfully!");
        form.reset();
    });
}