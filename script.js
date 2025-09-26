// JavaScript Code for THE COMIC BOOK STORE (Updated)
const searchIcon = document.getElementById('searchIcon');
const navbar = document.querySelector('.navbar-custom');

searchIcon.addEventListener('click', () => {
    navbar.classList.toggle('search-active');
});

// Favorite functionality
let favCount = 0;
const favButtons = document.querySelectorAll(".fav-btn");
const favBadge = document.querySelector(".bi-heart .badge");
const favoritesPanel = document.getElementById("favoritesPanel");
const favoritesContent = document.getElementById("favoritesContent");
const closeFavPanel = document.getElementById("closeFavPanel");

favButtons.forEach(btn => {
    btn.addEventListener("click", function () {
        const icon = btn.querySelector("i");
        const card = btn.closest(".comic-card").cloneNode(true);
        const title = card.querySelector("h4").innerText;

        if (icon.classList.contains("bi-heart")) {
            icon.classList.remove("bi-heart");
            icon.classList.add("bi-heart-fill");
            icon.style.color = "red";
            favCount++;

            card.querySelectorAll("button").forEach(btn => btn.remove());

            const favItem = document.createElement("div");
            favItem.classList.add("cart-item");
            favItem.innerHTML = `
                <div class="cancel-btn">&times;</div>
                ${card.innerHTML}
            `;

            const buyNowBtn = document.createElement("button");
            buyNowBtn.className = "btn btn-dark btn-sm mt-2";
            buyNowBtn.textContent = "BUY NOW";
            buyNowBtn.addEventListener("click", function () {
                alert("Purchased: " + (card.querySelector(".card-title")?.innerText || "Comic"));
            });

            const addToCartBtn = document.createElement("button");
            addToCartBtn.className = "btn btn-warning btn-sm mt-2 ms-2";
            addToCartBtn.textContent = "Add to Cart";
            addToCartBtn.addEventListener("click", function () {
                const priceText = card.querySelector(".price").innerText;
                const price = parseInt(priceText.replace(/[^\d]/g, "")) || 0;
                addComicToCart(card, price);
            });

            favItem.appendChild(buyNowBtn);
            favItem.appendChild(addToCartBtn);

            favItem.querySelector(".cancel-btn").addEventListener("click", function () {
                favItem.remove();
                favCount = Math.max(0, favCount - 1);
                favBadge.textContent = favCount;
                toggleFavEmptyMessage();
                saveFavoritesToStorage();
            });

            favoritesContent.appendChild(favItem);
        } else {
            icon.classList.remove("bi-heart-fill");
            icon.classList.add("bi-heart");
            icon.style.color = "";
            favCount = Math.max(0, favCount - 1);
            const items = favoritesContent.querySelectorAll(".cart-item");
            items.forEach(item => {
                if (item.querySelector("h4")?.innerText === title) {
                    item.remove();
                }
            });
        }
        favBadge.textContent = favCount;
        toggleFavEmptyMessage();
        saveFavoritesToStorage();
    });
});

document.querySelector(".bi-heart").addEventListener("click", function () {
    favoritesPanel.classList.add("open");
});

closeFavPanel.addEventListener("click", function () {
    favoritesPanel.classList.remove("open");
});

function toggleFavEmptyMessage() {
    const empty = favoritesContent.querySelector(".empty-message");
    const items = favoritesContent.querySelectorAll(".cart-item");
    if (empty) empty.style.display = items.length === 0 ? "block" : "none";
}

let cartCount = 0;
let cartTotal = 0;
const cartButtons = document.querySelectorAll(".cart-btn");
const cartBadge = document.querySelector(".bi-bag .badge");
const cartPanel = document.getElementById("cartPanel");
const cartContent = document.getElementById("cartContent");
const closeCartPanel = document.getElementById("closeCartPanel");
const cartTotalSpan = document.getElementById("cartTotal");

cartButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
        const card = btn.closest(".comic-card").cloneNode(true);
        const priceText = card.querySelector(".price").innerText;
        const price = parseInt(priceText.replace(/[^\d]/g, "")) || 0;
        addComicToCart(card, price);
    });
});

document.querySelector(".right-section .bi-bag").addEventListener("click", function () {
    cartPanel.classList.add("open");
});

closeCartPanel.addEventListener("click", function () {
    cartPanel.classList.remove("open");
});

function toggleCartEmptyMessage() {
    const empty = cartContent.querySelector(".empty-message");
    const items = cartContent.querySelectorAll(".cart-item");
    if (empty) empty.style.display = items.length === 0 ? "block" : "none";
}

function saveFavoritesToStorage() {
    const items = [];
    favoritesContent.querySelectorAll(".cart-item").forEach(item => items.push(item.innerHTML));
    localStorage.setItem("favorites", JSON.stringify(items));
    localStorage.setItem("favCount", favCount);
}

function saveCartToStorage() {
    const items = [];
    cartContent.querySelectorAll(".cart-item").forEach(item => items.push(item.innerHTML));
    localStorage.setItem("cartItems", JSON.stringify(items));
    localStorage.setItem("cartCount", cartCount);
    localStorage.setItem("cartTotal", cartTotal);
}

function restoreFavoritesFromStorage() {
    const storedFavs = JSON.parse(localStorage.getItem("favorites") || "[]");
    favCount = parseInt(localStorage.getItem("favCount") || "0");
    favBadge.textContent = favCount;
    favoritesContent.innerHTML = "";

    storedFavs.forEach(html => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("cart-item");
        wrapper.innerHTML = html;

        wrapper.querySelector(".cancel-btn")?.addEventListener("click", () => {
            wrapper.remove();
            favCount = Math.max(0, favCount - 1);
            favBadge.textContent = favCount;
            toggleFavEmptyMessage();
            saveFavoritesToStorage();
        });

        wrapper.querySelector(".btn-dark")?.addEventListener("click", () => {
            alert("Purchased: " + (wrapper.querySelector(".card-title")?.innerText || "Comic"));
        });

        wrapper.querySelector(".btn-warning")?.addEventListener("click", () => {
            const priceText = wrapper.querySelector(".price").innerText;
            const price = parseInt(priceText.replace(/[^\d]/g, "")) || 0;
            const comicCard = wrapper.querySelector(".comic-card");
            if (comicCard) {
                addComicToCart(comicCard, price);
            }
        });

        favoritesContent.appendChild(wrapper);
    });

    toggleFavEmptyMessage();
}

function restoreCartFromStorage() {
    const storedCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
    cartCount = parseInt(localStorage.getItem("cartCount") || "0");
    cartTotal = parseInt(localStorage.getItem("cartTotal") || "0");
    cartCount = Math.max(0, cartCount);
    cartTotal = Math.max(0, cartTotal);
    cartBadge.textContent = cartCount;
    cartTotalSpan.textContent = cartTotal;
    cartContent.innerHTML = "";

    storedCart.forEach(html => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("cart-item");
        wrapper.innerHTML = html;

        wrapper.querySelector(".cancel-btn")?.addEventListener("click", () => {
            const priceText = wrapper.querySelector(".price").innerText;
            const price = parseInt(priceText.replace(/[^\d]/g, "")) || 0;
            wrapper.remove();
            cartCount = Math.max(0, cartCount - 1);
            cartTotal = Math.max(0, cartTotal - price);
            cartBadge.textContent = cartCount;
            cartTotalSpan.textContent = cartTotal;
            toggleCartEmptyMessage();
            saveCartToStorage();
        });

        wrapper.querySelector(".btn-dark")?.addEventListener("click", () => {
            alert("Purchased: " + (wrapper.querySelector(".card-title")?.innerText || "Comic"));
        });

        cartContent.appendChild(wrapper);
    });

    toggleCartEmptyMessage();
}

function addComicToCart(comicElement, price) {
    const card = comicElement.cloneNode(true);
    card.querySelectorAll("button").forEach(btn => btn.remove());

    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
        <div class="cancel-btn">&times;</div>
        ${card.innerHTML}
    `;

    const buyBtn = document.createElement("button");
    buyBtn.className = "btn btn-dark btn-sm mt-2";
    buyBtn.textContent = "BUY NOW";
    buyBtn.addEventListener("click", function () {
        alert("Purchased: " + (cartItem.querySelector(".card-title")?.innerText || "Comic"));
    });

    cartItem.appendChild(buyBtn);

    cartItem.querySelector(".cancel-btn").addEventListener("click", function () {
        cartItem.remove();
        cartCount = Math.max(0, cartCount - 1);
        cartTotal = Math.max(0, cartTotal - price);
        cartBadge.textContent = cartCount;
        cartTotalSpan.textContent = cartTotal;
        toggleCartEmptyMessage();
        saveCartToStorage();
    });

    cartContent.appendChild(cartItem);
    cartCount++;
    cartTotal += price;
    cartBadge.textContent = cartCount;
    cartTotalSpan.textContent = cartTotal;
    toggleCartEmptyMessage();
    saveCartToStorage();
}

restoreFavoritesFromStorage();
restoreCartFromStorage();

// Search functionality
const searchInput = document.getElementById("searchInput");
const comicCards = document.querySelectorAll(".comic-card");

searchInput.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    comicCards.forEach(card => {
        const title = card.querySelector("h4").innerText.toLowerCase();
        const publisher = card.querySelector(".publisher").innerText.toLowerCase();
        card.style.display = title.includes(query) || publisher.includes(query) ? "flex" : "none";
    });
});

// Navbar buttons
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

function updateNavbarAuth() {
    const loggedInEmail = localStorage.getItem("loggedInEmail");
    if (loggedInEmail) {
        signupBtn.style.display = "none";
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
    } else {
        signupBtn.style.display = "inline-block";
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
    }
}

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedInEmail");
    updateNavbarAuth();
    window.location.href = "index.html";
});

updateNavbarAuth();

// Filter panel toggle
document.getElementById("filterToggleBtn").addEventListener("click", function () {
    document.getElementById("filterPanel").style.display = "block";
});

document.getElementById("closeFilterBtn").addEventListener("click", function () {
    document.getElementById("filterPanel").style.display = "none";
});

document.getElementById("priceFilter").addEventListener("input", function () {
    document.getElementById("priceValue").textContent = this.value;
});

function applyFilters() {
    const selectedPublisher = document.getElementById("publisherFilter").value;
    const maxPrice = parseInt(document.getElementById("priceFilter").value);
    const keyword = document.getElementById("keywordFilter").value.toLowerCase();

    const cards = document.querySelectorAll(".comic-card");
    cards.forEach(card => {
        const publisher = card.querySelector(".publisher").textContent.trim();
        const price = parseInt(card.querySelector(".price").textContent.replace("\u20B9", "").replace(",", ""));
        const title = card.querySelector("h4").textContent.toLowerCase();

        const matchesPublisher = selectedPublisher === "all" || publisher === selectedPublisher;
        const matchesPrice = price <= maxPrice;
        const matchesKeyword = title.includes(keyword);

        card.style.display = (matchesPublisher && matchesPrice && matchesKeyword) ? "block" : "none";
    });

    document.getElementById("filterPanel").style.display = "none";
}