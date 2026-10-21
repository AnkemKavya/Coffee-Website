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
    const cartFooter = document.querySelector(".cart-footer");

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
            cartItemsContainer.classList.add("empty");
            cartItemsContainer.innerHTML = `
                <div id="emptyCart">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <p class="empty-cart-title">Your cart is empty</p>
                    <p class="empty-cart-text">Add some delicious Coffee to get started!</p>
                </div>
            `;
        } else {
            cartItemsContainer.classList.remove("empty");
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

    if (cartFooter) {
        cartFooter.style.display = cartItems.length === 0 ? "none" : "block";
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
    product.category = document.getElementById("txtCategory").value;

    products.push(product);
    localStorage.setItem("ls_products", JSON.stringify(products));
    document.getElementById("divResult").innerHTML = JSON.stringify(products);

    document.getElementById("txtUrl").value = "";
    document.getElementById("txtName").value = "";
    document.getElementById("txtDescription").value = "";
    document.getElementById("txtPrice").value = "";
    document.getElementById("txtCategory").value = "hot";
}

function bindProduct(prods = []) {
    const container = document.getElementById("divCoffeeContainer");

    if (!container) return;

    if (prods.length > 0) {
        const displayedNames = new Set(
            [...container.querySelectorAll("h3")].map(cardTitle => cardTitle.textContent.trim().toLowerCase())
        );
        let content = "";
        for (let i = 0; i < prods.length; i++) {
                const productName = String(prods[i].name || "").trim();
                const normalizedName = productName.toLowerCase();

                if (!productName || displayedNames.has(normalizedName)) continue;

                displayedNames.add(normalizedName);
                const category = String(prods[i].category || "").toLowerCase();
                content += ` <div class="coffee-card" data-category="${category}">
                <img src="${prods[i].url}" alt="${prods[i].name}">
                <h3>${productName}</h3>
                <p>${prods[i].description}</p>
                <p>₹${prods[i].price}</p>
                <button class="add-cart" type="button">Add to Cart</button>
            </div>`;
        }

        container.insertAdjacentHTML("beforeend", content);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    products = JSON.parse(localStorage.getItem("ls_products")) || [];
    bindProduct(products);
    updateCartDisplay();

    let selectedCategory = "all";

    const applyFilters = () => {
        const searchValue = document.querySelector("#search")?.value.toLowerCase().trim() || "";

        document.querySelectorAll(".coffee-card").forEach(card => {
            const title = card.querySelector("h3")?.textContent.toLowerCase() || "";
            const matchesCategory = selectedCategory === "all" || card.dataset.category === selectedCategory;
            const matchesSearch = title.includes(searchValue);

            card.style.display = matchesCategory && matchesSearch ? "block" : "none";
        });
    };

    document.querySelectorAll(".category-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            selectedCategory = tab.dataset.category;

            document.querySelectorAll(".category-tab").forEach(categoryTab => {
                const isActive = categoryTab === tab;
                categoryTab.classList.toggle("active", isActive);
                categoryTab.setAttribute("aria-pressed", String(isActive));
            });

            applyFilters();
        });
    });

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
            const href = this.getAttribute("href");
            if (href === "#") return;

            e.preventDefault();

            const target = document.querySelector(href);

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
    const floatingCart = document.querySelector(".floating-cart");
    const checkoutButton = document.getElementById("checkoutButton");
    const checkoutPanel = document.getElementById("checkoutPanel");
    const orderConfirmationOverlay = document.getElementById("orderConfirmationOverlay");
    const checkoutForm = document.getElementById("checkoutForm");
    const cartContent = document.getElementById("cartContent");
    const cartFooter = document.querySelector(".cart-footer");

    const showCartView = () => {
        cartContent.hidden = false;
        cartFooter.hidden = false;
        checkoutPanel.hidden = true;
    };

    const showCheckoutView = () => {
        const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);
        document.getElementById("checkoutSubtotal").textContent = `₹${subtotal}`;
        document.getElementById("checkoutDelivery").textContent = `₹${DELIVERY_FEE}`;
        document.getElementById("checkoutTotal").textContent = `₹${subtotal + DELIVERY_FEE}`;
        cartContent.hidden = true;
        cartFooter.hidden = true;
        checkoutPanel.hidden = false;
    };

    const showOrderSuccess = () => {
        const orderId = `CF${Math.floor(10000 + Math.random() * 90000)}`;
        document.getElementById("orderNumber").textContent = `#${orderId}`;
        cartItems = [];
        updateCartDisplay();
        closeCartSidebar();
        orderConfirmationOverlay.hidden = false;
    };

    if (checkoutButton) {
        checkoutButton.addEventListener("click", showCheckoutView);
    }

    document.getElementById("backToCart")?.addEventListener("click", showCartView);

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", event => {
            event.preventDefault();

            if (cartItems.length === 0) {
                showCartView();
                return;
            }

            showOrderSuccess();
            checkoutForm.reset();
        });
    }

    const closeOrderSuccess = () => {
        orderConfirmationOverlay.hidden = true;
    };

    document.getElementById("closeSuccess")?.addEventListener("click", closeOrderSuccess);
    document.getElementById("continueShopping")?.addEventListener("click", closeOrderSuccess);
    orderConfirmationOverlay?.addEventListener("click", event => {
        if (event.target === orderConfirmationOverlay) closeOrderSuccess();
    });

    const openCartSidebar = () => {
        if (sidebar) sidebar.classList.add("open");
        if (overlay) overlay.classList.add("show");
        if (floatingCart) floatingCart.classList.add("hidden");
    };

    const closeCartSidebar = () => {
        if (sidebar) sidebar.classList.remove("open");
        if (overlay) overlay.classList.remove("show");
        if (floatingCart) floatingCart.classList.remove("hidden");
        showCartView();
    };

    // Open Sidebar
    cartBtns.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            openCartSidebar();
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
            closeCartSidebar();
        });
    }

    // Close when clicking outside
    if (overlay) {
        overlay.addEventListener("click", () => {
            closeCartSidebar();
        });
    }

    // Search Filter
    const searchInput = document.querySelector("#search");

    if (searchInput) {
        searchInput.addEventListener("input", applyFilters);
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