let products = [];
let cartCount = Number(localStorage.getItem("cartCount")) || 0;
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

const DELIVERY_FEE = 50;

function updateCartDisplay() {
    const cart = document.querySelector("#cart-count");
    const floatingBadge = document.getElementById("floatingCartCount");
    const sidebarCount = document.getElementById("cart-sidebar-count");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartDelivery = document.getElementById("cartDelivery");
    const cartTotal = document.getElementById("cartTotal");

    cartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

    if (cart) {
        cart.textContent = cartCount;
    }

    if (floatingBadge) {
        floatingBadge.textContent = cartCount;
    }

    if (sidebarCount) {
        sidebarCount.textContent = cartCount;
    }

    if (cartItemsContainer) {
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-empty">Your cart is empty.</div>';
        } else {
            cartItemsContainer.innerHTML = cartItems.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <span class="cart-item-title">${item.name}</span>
                        <span class="cart-item-price">₹${item.price * (item.quantity || 1)}</span>
                    </div>
                    <div class="cart-quantity-controls">
                        <button class="qty-btn minus" data-name="${item.name}" type="button">−</button>
                        <span class="qty-value">${item.quantity || 1}</span>
                        <button class="qty-btn plus" data-name="${item.name}" type="button">+</button>
                    </div>
                    <button class="remove-item" data-name="${item.name}" type="button"><i class="fa-solid fa-trash"></i></button>
                </div>
            `).join("");
        }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);
    const total = subtotal + (cartItems.length > 0 ? DELIVERY_FEE : 0);

    if (cartSubtotal) {
        cartSubtotal.textContent = `₹${subtotal}`;
    }

    if (cartDelivery) {
        cartDelivery.textContent = cartItems.length > 0 ? `₹${DELIVERY_FEE}` : `₹0`;
    }

    if (cartTotal) {
        cartTotal.textContent = `₹${total}`;
    }

    localStorage.setItem("cartCount", cartCount);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

function onClickToSave() {
    let product = new Object();
    product.url = document.getElementById("txtUrl").value;
    product.name = document.getElementById("txtName").value;
    product.description = document.getElementById("txtDescription").value;
    product.price = document.getElementById("txtPrice").value;

    products.push(product);
    localStorage.setItem("ls_products", JSON.stringify(products));
    document.getElementById("divResult").innerHTML = JSON.stringify(products);

    document.getElementById("txtUrl").value = "";
    document.getElementById("txtName").value = "";
    document.getElementById("txtDescription").value = "";
    document.getElementById("txtPrice").value = "";
}

function bindProduct(prods = []) {
    const container = document.getElementById("divCoffeeContainer");

    if (!container) return;

    if (prods.length > 0) {
        let content = "";
        for (let i = 0; i < prods.length; i++) {
            content += ` <div class="coffee-card">
                <img src="${prods[i].url}" alt="${prods[i].name}">
                <h3>${prods[i].name}</h3>
                <p>${prods[i].description}</p>
                <p>₹${prods[i].price}</p>
                <button class="add-cart" type="button">Add to Cart</button>
            </div>`;
        }

        container.innerHTML = content;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    products = JSON.parse(localStorage.getItem("ls_products")) || [];
    bindProduct(products);
    updateCartDisplay();

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
    document.addEventListener("click", (event) => {
        const button = event.target.closest(".add-cart");

        if (!button) return;
        if (button.dataset.added === "true") return;

        const card = button.closest(".coffee-card");
        const name = card?.querySelector("h3")?.textContent?.trim() || "Coffee";
        const priceText = card?.querySelector("p:last-of-type")?.textContent?.trim() || "₹0";
        const price = Number(priceText.replace(/[^\d]/g, "")) || 0;

        const imgSrc = card?.querySelector("img")?.src || "";
        const existingItem = cartItems.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cartItems.push({ name, price, quantity: 1, image: imgSrc });
        }

        updateCartDisplay();
    });

    const cartBtns = document.querySelectorAll(".open-cart");
    const closeCart = document.getElementById("closeCart");
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("overlay");

    // Open Sidebar
    cartBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            if (sidebar) sidebar.classList.add("open");
            if (overlay) overlay.classList.add("show");
        });
    });

    document.addEventListener("click", (event) => {
        const plusBtn = event.target.closest(".qty-btn.plus");
        const minusBtn = event.target.closest(".qty-btn.minus");
        const removeBtn = event.target.closest(".remove-item");

        if (plusBtn) {
            const item = cartItems.find(entry => entry.name === plusBtn.dataset.name);
            if (item) {
                item.quantity = (item.quantity || 1) + 1;
                updateCartDisplay();
            }
        }

        if (minusBtn) {
            const item = cartItems.find(entry => entry.name === minusBtn.dataset.name);
            if (item) {
                item.quantity = (item.quantity || 1) - 1;
                if (item.quantity <= 0) {
                    cartItems = cartItems.filter(entry => entry.name !== item.name);
                }
                updateCartDisplay();
            }
        }

        if (removeBtn) {
            cartItems = cartItems.filter(entry => entry.name !== removeBtn.dataset.name);
            updateCartDisplay();
        }
    });

    // Close Sidebar
    if (closeCart) {
        closeCart.addEventListener("click", () => {
            if (sidebar) sidebar.classList.remove("open");
            if (overlay) overlay.classList.remove("show");
        });
    }

    // Close when clicking outside
    if (overlay) {
        overlay.addEventListener("click", () => {
            if (sidebar) sidebar.classList.remove("open");
            overlay.classList.remove("show");
        });
    }

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
});