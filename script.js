import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyCf9brUoN8uMIRD4bWaRaOmtbF4ik8uf8Q",
  authDomain: "dear-collection.firebaseapp.com",
  projectId: "dear-collection",
  storageBucket: "dear-collection.firebasestorage.app",
  messagingSenderId: "1051859230518",
  appId: "1:1051859230518:web:c3117f4e9127a9dab0dd97",
  measurementId: "G-4D1L6HK65L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Mock Product Data
const shirtProducts = [
    { id: 1, name: "Classic White Shirt", price: 49.99, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=600&q=80", category: "shirt" },
    { id: 2, name: "Premium Cotton Shirt", price: 59.99, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=600&q=80", category: "shirt" },
    { id: 3, name: "Formal Blue Shirt", price: 69.99, image: "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?auto=format&fit=crop&w=600&q=80", category: "shirt" }
];

const pantProducts = [
    { id: 4, name: "Black Casual Pants", price: 79.99, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80", category: "pant" },
    { id: 5, name: "Navy Blue Trousers", price: 89.99, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80", category: "pant" },
    { id: 6, name: "Gray Formal Pants", price: 99.99, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80", category: "pant" }
];

const tshirtProducts = [
    { id: 7, name: "Classic T-Shirt", price: 29.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80", category: "tshirt" },
    { id: 8, name: "Premium Cotton T-Shirt", price: 39.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80", category: "tshirt" },
    { id: 9, name: "Graphic T-Shirt", price: 34.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80", category: "tshirt" }
];

const trouserProducts = [
    { id: 10, name: "Formal Trousers", price: 109.99, image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&w=600&q=80", category: "trouser" },
    { id: 11, name: "Casual Trousers", price: 79.99, image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&w=600&q=80", category: "trouser" },
    { id: 12, name: "Business Trousers", price: 119.99, image: "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&w=600&q=80", category: "trouser" }
];

const products = [...shirtProducts, ...pantProducts, ...tshirtProducts, ...trouserProducts];

// Cart State
let cart = [];
let nextProductId = products.length + 1;

// DOM Elements
const productGrid = document.getElementById('product-grid');
const shirtGrid = document.getElementById('shirt-grid');
const pantGrid = document.getElementById('pant-grid');
const tshirtGrid = document.getElementById('tshirt-grid');
const trouserGrid = document.getElementById('trouser-grid');
const menuToggleBtn = document.getElementById('menu-toggle');
const closeMenuBtn = document.getElementById('close-menu');
const menuSidebar = document.getElementById('menu-sidebar');
const cartToggleBtn = document.getElementById('cart-toggle');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const sharedOverlay = document.getElementById('shared-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');

// Initialize App
function init() {
    if (productGrid) {
        renderProducts();
    }
    renderCategoryProducts();
    loadCart();
    setupEventListeners();
    handleNavbarScroll();
}

function renderCategoryProducts() {
    if (shirtGrid) renderProductsToGrid(shirtProducts, shirtGrid);
    if (pantGrid) renderProductsToGrid(pantProducts, pantGrid);
    if (tshirtGrid) renderProductsToGrid(tshirtProducts, tshirtGrid);
    if (trouserGrid) renderProductsToGrid(trouserProducts, trouserGrid);
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.custom-navbar');
    if (!navbar) return;

    const updateNavbar = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('transparent');
        } else {
            navbar.classList.add('transparent');
            navbar.classList.remove('scrolled');
        }
    };

    updateNavbar();
    window.addEventListener('scroll', updateNavbar);
}

// Render Products to Grid
function renderProducts() {
    if (!productGrid) return;
    renderProductsToGrid(products, productGrid);
}

function renderProductsToGrid(productList, grid) {
    if (!grid) return;
    grid.innerHTML = '';
    productList.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        grid.appendChild(productCard);
    });

    // Add event listeners to new buttons
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = normalizeId(e.target.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function setupCategoryBuyButtons() {
    const categoryButtons = [];
    if (!productGrid) {
        categoryButtons.push(...document.querySelectorAll('.add-to-cart-btn'));
    }
    categoryButtons.push(...document.querySelectorAll('.buy-btn'));

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            if (!card) return;
            const title = card.querySelector('.product-title, h3')?.textContent.trim() || 'Product';
            const priceText = card.querySelector('.product-price')?.textContent.trim() || '';
            const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
            const image = card.querySelector('img')?.src || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80';
            let product = products.find(p => p.name === title);
            if (!product) {
                product = { id: nextProductId++, name: title, price, image, category: 'custom' };
                products.push(product);
            }
            addToCart(product);
        });
    });
}

// Cart Logic
function normalizeId(id) {
    if (typeof id === 'string' && id.trim() !== '' && !Number.isNaN(Number(id))) {
        return Number(id);
    }
    return id;
}

function addToCart(productInfo) {
    let product;
    if (typeof productInfo === 'object') {
        product = { ...productInfo };
        if (product.id == null) {
            product.id = nextProductId++;
        }
    } else {
        const normalizedId = normalizeId(productInfo);
        product = products.find(p => p.id === normalizedId);
    }
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    saveCart();
    openCart(); // Optional: open cart when item is added
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

// UI Updates
function updateCartUI() {
    // Update Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;

    // Update Items List
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
    } else {
        cartItemsContainer.innerHTML = '';
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        // Add listeners for quantity and remove buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(normalizeId(e.target.dataset.id), -1));
        });
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(normalizeId(e.target.dataset.id), 1));
        });
        document.querySelectorAll('.remove-item').forEach(btn => {
            // target could be the button or the icon inside it
            const id = btn.dataset.id || btn.closest('button').dataset.id;
            btn.addEventListener('click', () => removeFromCart(normalizeId(id)));
        });
    }

    // Update Total
    const totalCost = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = '$' + totalCost.toFixed(2);
}

// Sidebar Toggles
function disableBodyScroll() {
    document.body.style.overflow = 'hidden';
}

function enableBodyScroll() {
    if (!signinModal || !signinModal.classList.contains('active')) {
        document.body.style.overflow = '';
    }
}

function closeAllSidebars() {
    menuSidebar.classList.remove('open');
    cartSidebar.classList.remove('open');
    sharedOverlay.classList.remove('active');
    enableBodyScroll();
}

function openMenu() {
    closeAllSidebars();
    menuSidebar.classList.add('open');
    sharedOverlay.classList.add('active');
    disableBodyScroll();
}

function openCart() {
    closeAllSidebars();
    cartSidebar.classList.add('open');
    sharedOverlay.classList.add('active');
    disableBodyScroll();
}

// Event Listeners
function setupEventListeners() {
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', openMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllSidebars();
        });
    }

    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', openCart);
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllSidebars();
        });
    }

    if (sharedOverlay) {
        sharedOverlay.addEventListener('click', closeAllSidebars);
    }

    const menuLinks = document.querySelectorAll('.menu-links a');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeAllSidebars);
    });

    const heroButton = document.querySelector('.hero-btn');
    const categoriesSection = document.getElementById('categories');
    if (heroButton && categoriesSection) {
        heroButton.addEventListener('click', (event) => {
            event.preventDefault();
            heroButton.classList.add('clicked');
            categoriesSection.classList.add('highlighted');
            categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                heroButton.classList.remove('clicked');
                categoriesSection.classList.remove('highlighted');
            }, 1200);
        });
    }

    setupCategoryBuyButtons();

    document.addEventListener('click', (event) => {
        const button = event.target.closest('#close-menu, #close-cart');
        if (button) {
            closeAllSidebars();
        }
    });
}

// Local Storage (Optional persistence)
function saveCart() {
    localStorage.setItem('vanillaCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('vanillaCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Run app
document.addEventListener('DOMContentLoaded', init);

// Sign In Modal Logic
const signinToggleBtn = document.getElementById('signin-toggle');
const signinModal = document.getElementById('signin-modal');
const closeModalBtn = document.getElementById('close-modal');
const authToggleBtn = document.getElementById('auth-toggle-btn');
const modalTitle = document.getElementById('modal-title');
const nameGroup = document.getElementById('name-group');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authToggleText = document.getElementById('auth-toggle-text');
const authForm = document.getElementById('auth-form');

let isLogin = true;

if (signinToggleBtn && signinModal) {
    signinToggleBtn.addEventListener('click', () => {
        signinModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
    });
}

if (closeModalBtn && signinModal) {
    closeModalBtn.addEventListener('click', () => {
        signinModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (signinModal) {
    signinModal.addEventListener('click', (e) => {
        if (e.target === signinModal) {
            signinModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

if (authToggleBtn) {
    authToggleBtn.addEventListener('click', () => {
        isLogin = !isLogin;
        if (isLogin) {
            modalTitle.textContent = 'Sign In';
            nameGroup.style.display = 'none';
            authSubmitBtn.textContent = 'Sign In';
            authToggleText.firstChild.textContent = "Don't have an account? ";
            authToggleBtn.textContent = 'Create one';
        } else {
            modalTitle.textContent = 'Create Account';
            nameGroup.style.display = 'block';
            authSubmitBtn.textContent = 'Create Account';
            authToggleText.firstChild.textContent = "Already have an account? ";
            authToggleBtn.textContent = 'Sign In';
        }
    });
}

if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert(isLogin ? 'Signed in successfully!' : 'Account created successfully!');
        signinModal.classList.remove('active');
        document.body.style.overflow = '';
        authForm.reset();
    });
}

// Checkout Modal Logic
const checkoutBtn = document.querySelector('.checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutModalBtn = document.getElementById('close-checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
const cardDetailsSection = document.getElementById('card-details');
const upiDetailsSection = document.getElementById('upi-details');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutTotal = document.getElementById('checkout-total');
const SHIPPING_COST = 10.00;

function updateCheckoutSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + SHIPPING_COST;
    checkoutSubtotal.textContent = '$' + subtotal.toFixed(2);
    checkoutTotal.textContent = '$' + total.toFixed(2);
}

function openCheckout() {
    updateCheckoutSummary();
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckout() {
    checkoutModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Payment method switching
if (paymentMethodRadios.length > 0) {
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const method = e.target.value;
            if (method === 'card') {
                cardDetailsSection.style.display = 'block';
                upiDetailsSection.style.display = 'none';
            } else if (method === 'upi') {
                cardDetailsSection.style.display = 'none';
                upiDetailsSection.style.display = 'block';
            } else {
                cardDetailsSection.style.display = 'none';
                upiDetailsSection.style.display = 'none';
            }
        });
    });
}

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checkout.');
            return;
        }
        openCheckout();
    });
}

if (closeCheckoutModalBtn) {
    closeCheckoutModalBtn.addEventListener('click', closeCheckout);
}

if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            closeCheckout();
        }
    });
}

if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('checkout-name').value,
            phone: document.getElementById('checkout-phone').value,
            email: document.getElementById('checkout-email').value,
            address: document.getElementById('checkout-address').value,
            city: document.getElementById('checkout-city').value,
            postal: document.getElementById('checkout-postal').value,
            paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
            total: checkoutTotal.textContent
        };

        console.log('Order placed:', formData);
        alert(`Order placed successfully! Total: ${formData.total}\n\nThank you for your purchase!`);
        
        closeCheckout();
        cart = [];
        updateCartUI();
        saveCart();
        checkoutForm.reset();
    });
}
