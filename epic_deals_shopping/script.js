// Cart functionality
let cartCount = 0;
let cartItems = [];

// Wishlist functionality
let wishlistItems = [];

// Filter and sort state
let currentSortBy = 'default';
let currentPriceRange = { min: 0, max: 300 };

// All products data for search
const allProducts = [
    // Skincare
    { name: 'Vitamin C Serum', price: 31, category: 'skincare', original: 89 },
    { name: 'Hyaluronic Acid Moisturizer', price: 34, category: 'skincare', original: 68 },
    { name: 'Green Tea Face Mask', price: 18, category: 'skincare', original: 45 },
    { name: 'SPF 50 Sunscreen', price: 19, category: 'skincare', original: 42 },
    { name: 'Rose Water Toner', price: 11, category: 'skincare', original: 35 },
    { name: 'Retinol Night Cream', price: 52, category: 'skincare', original: 95 },
    // Home Decor
    { name: 'Luxury Scented Candle Set', price: 32, category: 'homedecor', original: 79 },
    { name: 'Modern Wall Art Canvas', price: 67, category: 'homedecor', original: 149 },
    { name: 'Decorative Throw Pillows', price: 30, category: 'homedecor', original: 60 },
    { name: 'LED String Lights', price: 16, category: 'homedecor', original: 45 },
    { name: 'Ceramic Planter Set', price: 36, category: 'homedecor', original: 85 },
    { name: 'Round Wall Mirror', price: 62, category: 'homedecor', original: 120 },
    // Men's Clothing
    { name: "Men's Casual Shirt", price: 26, category: 'mens', original: 65 },
    { name: 'Slim Fit Denim Jeans', price: 40, category: 'mens', original: 89 },
    { name: "Men's Leather Jacket", price: 150, category: 'mens', original: 299 },
    { name: 'Baseball Cap Collection', price: 20, category: 'mens', original: 48 },
    { name: "Men's Running Sneakers", price: 46, category: 'mens', original: 130 },
    { name: "Men's Cargo Shorts", price: 26, category: 'mens', original: 55 },
    // Women's Clothing
    { name: 'Floral Summer Dress', price: 42, category: 'womens', original: 120 },
    { name: "Women's Blouse", price: 31, category: 'womens', original: 78 },
    { name: 'High Heel Pumps', price: 43, category: 'womens', original: 95 },
    { name: "Women's Skinny Jeans", price: 32, category: 'womens', original: 85 },
    { name: "Women's Winter Coat", price: 84, category: 'womens', original: 199 },
    { name: 'Designer Handbag', price: 45, category: 'womens', original: 150 },
    // Kids' Clothing
    { name: "Kids' Graphic T-Shirts", price: 21, category: 'kids', original: 60 },
    { name: "Girls' Party Dress", price: 30, category: 'kids', original: 75 },
    { name: "Boys' Denim Jeans", price: 20, category: 'kids', original: 45 },
    { name: "Kids' Sneakers", price: 21, category: 'kids', original: 65 },
    { name: "Kids' Hoodie", price: 19, category: 'kids', original: 50 },
    { name: "Kids' Backpack", price: 18, category: 'kids', original: 42 }
];

// Function to add items to cart
function addToCart(productName, price) {
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }

    cartCount++;
    updateCartCount();
    saveCartToStorage();
    showNotification(`${productName} added to cart! ($${price})`);
}

// Update cart count display
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    cartCountElement.textContent = cartCount;
    cartCountElement.style.animation = 'pulse 0.3s ease';
    setTimeout(() => {
        cartCountElement.style.animation = '';
    }, 300);
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartCount', cartCount);
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cartItems');
    const savedCount = localStorage.getItem('cartCount');

    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
    if (savedCount) {
        cartCount = parseInt(savedCount);
        updateCartCount();
    }
}

// Remove item from cart
function removeFromCart(productName) {
    const itemIndex = cartItems.findIndex(item => item.name === productName);

    if (itemIndex > -1) {
        const item = cartItems[itemIndex];
        cartCount -= item.quantity;
        cartItems.splice(itemIndex, 1);
        updateCartCount();
        saveCartToStorage();
        displayCart();
        showNotification(`${productName} removed from cart`);
    }
}

// Update item quantity
function updateQuantity(productName, change) {
    const item = cartItems.find(item => item.name === productName);

    if (item) {
        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
            removeFromCart(productName);
        } else {
            item.quantity = newQuantity;
            cartCount += change;
            updateCartCount();
            saveCartToStorage();
            displayCart();
        }
    }
}

// Calculate cart total
function calculateCartTotal() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Display cart modal
function displayCart() {
    const cartModal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItemsContainer');

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>🛒 Your cart is empty</p>
                <p>Start shopping to add items!</p>
            </div>
        `;
        document.getElementById('cartTotal').textContent = '0.00';
    } else {
        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price} each</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
                <div class="cart-item-total">
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="remove-btn" onclick="removeFromCart('${item.name}')">🗑️</button>
                </div>
            </div>
        `).join('');

        document.getElementById('cartTotal').textContent = calculateCartTotal().toFixed(2);
    }

    cartModal.style.display = 'flex';
}

// Close cart modal
function closeCart() {
    const cartModal = document.getElementById('cartModal');
    cartModal.style.display = 'none';
}

// Checkout function
function checkout() {
    if (cartItems.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const total = calculateCartTotal();
    showNotification(`Processing checkout for $${total.toFixed(2)}... (Demo mode)`);

    // In a real app, this would redirect to a payment page
    setTimeout(() => {
        showNotification('Order placed successfully! 🎉');
        cartItems = [];
        cartCount = 0;
        updateCartCount();
        saveCartToStorage();
        closeCart();
    }, 2000);
}

// ===== WISHLIST FUNCTIONALITY =====
// Toggle wishlist
function toggleWishlist(productName, price, category, original) {
    const existingIndex = wishlistItems.findIndex(item => item.name === productName);

    if (existingIndex > -1) {
        wishlistItems.splice(existingIndex, 1);
        showNotification(`${productName} removed from wishlist`);
    } else {
        wishlistItems.push({ name: productName, price, category, original });
        showNotification(`${productName} added to wishlist ❤️`);
    }

    saveWishlistToStorage();
    updateWishlistIcons();
    updateWishlistCount();
}

// Check if item is in wishlist
function isInWishlist(productName) {
    return wishlistItems.some(item => item.name === productName);
}

// Save wishlist to localStorage
function saveWishlistToStorage() {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
}

// Load wishlist from localStorage
function loadWishlistFromStorage() {
    const saved = localStorage.getItem('wishlistItems');
    if (saved) {
        wishlistItems = JSON.parse(saved);
        updateWishlistCount();
    }
}

// Update wishlist count
function updateWishlistCount() {
    const countEl = document.querySelector('.wishlist-count');
    if (countEl) {
        countEl.textContent = wishlistItems.length;
    }
}

// Update wishlist heart icons
function updateWishlistIcons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productName = btn.getAttribute('data-product');
        if (isInWishlist(productName)) {
            btn.classList.add('active');
            btn.innerHTML = '❤️';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '🤍';
        }
    });
}

// Display wishlist modal
function displayWishlist() {
    const modal = document.getElementById('wishlistModal');
    const container = document.getElementById('wishlistItemsContainer');

    if (wishlistItems.length === 0) {
        container.innerHTML = `
            <div class="empty-wishlist">
                <p>💔 Your wishlist is empty</p>
                <p>Add some favorites to see them here!</p>
            </div>
        `;
    } else {
        container.innerHTML = wishlistItems.map(item => {
            const discount = Math.round(((item.original - item.price) / item.original) * 100);
            return `
                <div class="wishlist-item">
                    <div class="wishlist-item-info">
                        <h4>${item.name}</h4>
                        <div class="wishlist-item-prices">
                            <span class="wishlist-original">$${item.original}</span>
                            <span class="wishlist-price">$${item.price}</span>
                            <span class="wishlist-discount">-${discount}%</span>
                        </div>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="wishlist-add-cart-btn" onclick="addToCart('${item.name}', ${item.price}); showNotification('Added to cart!');">
                            Add to Cart
                        </button>
                        <button class="wishlist-remove-btn" onclick="toggleWishlist('${item.name}', ${item.price}, '${item.category}', ${item.original})">
                            Remove
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    modal.style.display = 'flex';
}

// Close wishlist modal
function closeWishlist() {
    document.getElementById('wishlistModal').style.display = 'none';
}

// ===== PRICE FILTER & SORTING =====
// Apply filters and sorting
function applyFiltersAndSort() {
    const allCards = document.querySelectorAll('.deal-card');
    let visibleCards = Array.from(allCards);

    // Filter by price
    visibleCards = visibleCards.filter(card => {
        const priceText = card.querySelector('.sale-price').textContent.replace('$', '');
        const price = parseInt(priceText);
        return price >= currentPriceRange.min && price <= currentPriceRange.max;
    });

    // Sort
    if (currentSortBy !== 'default') {
        visibleCards.sort((a, b) => {
            const priceA = parseInt(a.querySelector('.sale-price').textContent.replace('$', ''));
            const priceB = parseInt(b.querySelector('.sale-price').textContent.replace('$', ''));
            const discountA = parseInt(a.querySelector('.badge').textContent.replace('-', '').replace('%', ''));
            const discountB = parseInt(b.querySelector('.badge').textContent.replace('-', '').replace('%', ''));

            switch(currentSortBy) {
                case 'price-low': return priceA - priceB;
                case 'price-high': return priceB - priceA;
                case 'discount': return discountB - discountA;
                default: return 0;
            }
        });
    }

    // Hide all cards first
    allCards.forEach(card => card.style.display = 'none');

    // Show and reorder visible cards
    visibleCards.forEach((card, index) => {
        card.style.display = 'block';
        card.style.order = index;
    });
}

// Update price range
function updatePriceRange(min, max) {
    currentPriceRange = { min, max };
    document.getElementById('priceRangeText').textContent = `$${min} - $${max}`;
    applyFiltersAndSort();
}

// Change sort order
function changeSortOrder(sortBy, element) {
    currentSortBy = sortBy;
    document.querySelectorAll('.sort-option').forEach(opt => opt.classList.remove('active'));
    if (element) element.classList.add('active');
    applyFiltersAndSort();
}

// Reset filters
function resetFilters() {
    currentPriceRange = { min: 0, max: 300 };
    currentSortBy = 'default';
    document.getElementById('priceMin').value = 0;
    document.getElementById('priceMax').value = 300;
    document.getElementById('priceRangeText').textContent = '$0 - $300';
    document.querySelectorAll('.deal-card').forEach(card => card.style.display = 'block');
}

// ===== PRODUCT COMPARISON =====
let compareItems = [];

function toggleCompare(productName, price, original, category) {
    const existingIndex = compareItems.findIndex(item => item.name === productName);

    if (existingIndex > -1) {
        compareItems.splice(existingIndex, 1);
        showNotification(`${productName} removed from comparison`);
    } else {
        if (compareItems.length >= 4) {
            showNotification('Maximum 4 products can be compared');
            return;
        }
        compareItems.push({ name: productName, price, original, category });
        showNotification(`${productName} added to comparison`);
    }

    updateCompareCount();
}

function updateCompareCount() {
    const countEl = document.querySelector('.compare-count');
    if (countEl) {
        countEl.textContent = compareItems.length;
        countEl.style.display = compareItems.length > 0 ? 'flex' : 'none';
    }
}

function showCompare() {
    const modal = document.getElementById('compareModal');
    const container = document.getElementById('compareContainer');

    if (compareItems.length === 0) {
        container.innerHTML = '<div class="empty-compare"><p>No products to compare</p></div>';
    } else {
        container.innerHTML = `
            <table class="compare-table">
                <thead>
                    <tr>
                        <th>Feature</th>
                        ${compareItems.map(item => `<th>${item.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Category</strong></td>
                        ${compareItems.map(item => `<td>${getCategoryName(item.category)}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Original Price</strong></td>
                        ${compareItems.map(item => `<td>$${item.original}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Sale Price</strong></td>
                        ${compareItems.map(item => `<td class="compare-price">$${item.price}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Discount</strong></td>
                        ${compareItems.map(item => {
                            const discount = Math.round(((item.original - item.price) / item.original) * 100);
                            return `<td class="compare-discount">${discount}%</td>`;
                        }).join('')}
                    </tr>
                    <tr>
                        <td><strong>Actions</strong></td>
                        ${compareItems.map(item => `
                            <td>
                                <button class="compare-add-btn" onclick="addToCart('${item.name}', ${item.price})">Add to Cart</button>
                            </td>
                        `).join('')}
                    </tr>
                </tbody>
            </table>
        `;
    }

    modal.style.display = 'flex';
}

function closeCompare() {
    document.getElementById('compareModal').style.display = 'none';
}

function clearCompare() {
    compareItems = [];
    updateCompareCount();
    closeCompare();
    showNotification('Comparison cleared');
}

// ===== SOCIAL SHARING =====
function shareProduct(productName, platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${productName} on EPIC DEALS!`);

    let shareUrl;
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${text}%20${url}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(window.location.href);
            showNotification('Link copied to clipboard!');
            return;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// ===== DARK MODE =====
let darkMode = false;

function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    localStorage.setItem('darkMode', darkMode);

    const icon = document.querySelector('.dark-mode-toggle');
    if (icon) {
        icon.textContent = darkMode ? '☀️' : '🌙';
    }

    showNotification(darkMode ? 'Dark mode enabled' : 'Light mode enabled');
}

function loadDarkMode() {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
        darkMode = true;
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('.dark-mode-toggle');
        if (icon) icon.textContent = '☀️';
    }
}

// ===== FLASH DEALS CAROUSEL =====
const flashDeals = [
    { name: 'Vitamin C Serum', price: 31, original: 89, time: '2h 15m' },
    { name: "Men's Leather Jacket", price: 150, original: 299, time: '4h 32m' },
    { name: 'Designer Handbag', price: 45, original: 150, time: '1h 45m' },
    { name: 'Modern Wall Art Canvas', price: 67, original: 149, time: '3h 20m' }
];

let currentDealIndex = 0;

function rotateDealBanner() {
    const banner = document.querySelector('.flash-deal-content-3d');
    if (!banner) return;

    const deal = flashDeals[currentDealIndex];
    const discount = Math.round(((deal.original - deal.price) / deal.original) * 100);

    banner.innerHTML = `
        <div class="deal-badge-flash">⚡ FLASH DEAL</div>
        <h3>${deal.name} - $${deal.price} <span style="text-decoration: line-through; opacity: 0.7; font-size: 1.3rem;">$${deal.original}</span> (-${discount}%)</h3>
    `;

    currentDealIndex = (currentDealIndex + 1) % flashDeals.length;
}

function initFlashDeals() {
    rotateDealBanner();
    setInterval(rotateDealBanner, 5000); // Rotate every 5 seconds
}

// ===== NAVIGATION SCROLL FUNCTIONS =====
function scrollNavLeft() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.scrollBy({
            left: -200,
            behavior: 'smooth'
        });
    }
}

function scrollNavRight() {
    const navLinks = document.getElementById('navLinks');
    if (navLinks) {
        navLinks.scrollBy({
            left: 200,
            behavior: 'smooth'
        });
    }
}

// Show notification
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Countdown Timer
function initCountdown() {
    // Set the sale end date (3 days from now)
    const saleEndDate = new Date();
    saleEndDate.setDate(saleEndDate.getDate() + 3);
    saleEndDate.setHours(23, 59, 59, 999);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = saleEndDate - now;

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = '<h2>Sale Ended!</h2>';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// Newsletter subscription
function subscribeNewsletter(event) {
    event.preventDefault();
    const emailInput = event.target.querySelector('input[type="email"]');
    const email = emailInput.value;

    showNotification(`Thank you for subscribing! We'll send deals to ${email}`);
    emailInput.value = '';

    return false;
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Load saved cart
    loadCartFromStorage();

    // Load wishlist
    loadWishlistFromStorage();
    updateWishlistIcons();

    // Load dark mode
    loadDarkMode();

    // Initialize countdown
    initCountdown();

    // Initialize flash deals banner
    initFlashDeals();

    // Add click handler to cart icon
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', displayCart);
        cartIcon.style.cursor = 'pointer';
    }

    // Add click handler to wishlist icon
    const wishlistIcon = document.querySelector('.wishlist-icon');
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', displayWishlist);
        wishlistIcon.style.cursor = 'pointer';
    }

    // Add click handler to compare icon
    const compareIcon = document.querySelector('.compare-icon');
    if (compareIcon) {
        compareIcon.addEventListener('click', showCompare);
        compareIcon.style.cursor = 'pointer';
    }

    // Smooth scroll
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to navbar
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }

        lastScroll = currentScroll;
    });

    // Animate cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all deal cards
    const dealCards = document.querySelectorAll('.deal-card');
    dealCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Observe category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });

    // Add pulse animation to CTA button
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        const firstCategory = document.querySelector('#skincare');
        if (firstCategory) {
            firstCategory.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Function to scroll to specific category section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Function to scroll to clothing subsection
function scrollToSubsection(subsectionId) {
    const subsection = document.getElementById(subsectionId);
    if (subsection) {
        const offsetTop = subsection.offsetTop - 100;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Search functionality
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.toLowerCase().trim();

    if (!query) {
        showNotification('Please enter a search term');
        return;
    }

    const results = allProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    displaySearchResults(results, query);
}

// Display search results
function displaySearchResults(results, query) {
    const overlay = document.getElementById('searchOverlay');
    const resultsContainer = document.getElementById('searchResults');

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>No products found for "${query}"</p>
                <p>Try searching for:</p>
                <ul>
                    <li>Skincare products</li>
                    <li>Home decor items</li>
                    <li>Clothing (men's, women's, kids')</li>
                </ul>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = results.map(product => {
            const discount = Math.round(((product.original - product.price) / product.original) * 100);
            return `
                <div class="search-result-item">
                    <div class="result-info">
                        <h4>${product.name}</h4>
                        <span class="result-category">${getCategoryName(product.category)}</span>
                    </div>
                    <div class="result-pricing">
                        <span class="result-original">$${product.original}</span>
                        <span class="result-price">$${product.price}</span>
                        <span class="result-discount">-${discount}%</span>
                    </div>
                    <button class="result-add-btn" onclick="addToCart('${product.name}', ${product.price}); closeSearch();">
                        Add to Cart
                    </button>
                </div>
            `;
        }).join('');
    }

    overlay.style.display = 'flex';
}

// Get category display name
function getCategoryName(category) {
    const names = {
        'skincare': 'Skincare',
        'homedecor': 'Home Decor',
        'mens': "Men's Clothing",
        'womens': "Women's Clothing",
        'kids': "Kids' Clothing"
    };
    return names[category] || category;
}

// Close search overlay
function closeSearch() {
    const overlay = document.getElementById('searchOverlay');
    overlay.style.display = 'none';
    document.getElementById('searchInput').value = '';
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
});

// Track Order functionality
function trackOrder(event) {
    event.preventDefault();
    const orderNumber = event.target.querySelector('input').value;
    const statusDiv = document.getElementById('orderStatus');

    // Simulate order tracking
    statusDiv.innerHTML = `
        <div class="tracking-result">
            <h4>Order ${orderNumber}</h4>
            <div class="tracking-timeline">
                <div class="tracking-step completed">
                    <span class="step-icon">✓</span>
                    <span>Order Placed</span>
                    <small>Nov 25, 2025</small>
                </div>
                <div class="tracking-step completed">
                    <span class="step-icon">✓</span>
                    <span>Processing</span>
                    <small>Nov 26, 2025</small>
                </div>
                <div class="tracking-step active">
                    <span class="step-icon">📦</span>
                    <span>Shipped</span>
                    <small>Nov 28, 2025</small>
                </div>
                <div class="tracking-step">
                    <span class="step-icon">⏱</span>
                    <span>Out for Delivery</span>
                    <small>Pending</small>
                </div>
                <div class="tracking-step">
                    <span class="step-icon">⏱</span>
                    <span>Delivered</span>
                    <small>Expected: Dec 2, 2025</small>
                </div>
            </div>
        </div>
    `;
    showNotification('Order tracking information loaded');
}

// Initiate Return functionality
function initiateReturn(event) {
    event.preventDefault();
    const orderNumber = event.target.querySelector('input').value;
    const reason = event.target.querySelector('select').value;

    showNotification(`Return initiated for order ${orderNumber}. You will receive a confirmation email shortly.`);
    event.target.reset();
}

// Toggle Side Menu
function toggleMenu() {
    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    sideMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
}

// Toggle Language Dropdown in Navbar
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    dropdown.classList.toggle('active');

    // Close dropdown when clicking outside
    if (dropdown.classList.contains('active')) {
        document.addEventListener('click', closeLanguageDropdownOutside);
    } else {
        document.removeEventListener('click', closeLanguageDropdownOutside);
    }
}

function closeLanguageDropdownOutside(event) {
    const dropdown = document.getElementById('languageDropdown');
    const menuBtn = document.querySelector('.language-menu-btn');

    if (!dropdown.contains(event.target) && !menuBtn.contains(event.target)) {
        dropdown.classList.remove('active');
        document.removeEventListener('click', closeLanguageDropdownOutside);
    }
}

// Select Language from Navbar Dropdown
function selectLanguage(langCode, flag, code, langName) {
    // Update navbar button
    document.getElementById('currentFlag').textContent = flag;
    document.querySelector('.lang-code').textContent = code;

    // Remove active class from all options
    const allOptions = document.querySelectorAll('.lang-option');
    allOptions.forEach(opt => opt.classList.remove('active'));

    // Add active class to selected option
    event.target.closest('.lang-option').classList.add('active');

    // Close dropdown
    document.getElementById('languageDropdown').classList.remove('active');
    document.removeEventListener('click', closeLanguageDropdownOutside);

    // Change font based on language
    applyLanguageFont(langCode);

    // Show notification
    showNotification(`Language changed to ${langName}`);

    // Store language preference
    localStorage.setItem('preferredLanguage', langCode);
    localStorage.setItem('preferredFlag', flag);
    localStorage.setItem('preferredCode', code);
    localStorage.setItem('preferredLangName', langName);
}

// Apply appropriate font for selected language
function applyLanguageFont(langCode) {
    const fontMap = {
        'en': "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        'es': "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        'fr': "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        'de': "'Segoe UI', 'Roboto', Arial, sans-serif",
        'it': "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        'pt': "'Segoe UI', 'Roboto', Arial, sans-serif",
        'zh': "'Microsoft YaHei', '微软雅黑', 'PingFang SC', 'Hiragino Sans GB', 'STHeiti', 'WenQuanYi Micro Hei', sans-serif",
        'ja': "'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ Pro W3', 'Meiryo', 'メイリオ', 'MS PGothic', sans-serif",
        'ko': "'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
        'ar': "'Tahoma', 'Arial', 'Segoe UI', 'Geeza Pro', 'Traditional Arabic', sans-serif",
        'hi': "'Noto Sans Devanagari', 'Mangal', 'Kokila', 'Devanagari MT', sans-serif",
        'ru': "'Segoe UI', 'Roboto', 'Arial', 'Helvetica Neue', sans-serif"
    };

    const selectedFont = fontMap[langCode] || fontMap['en'];
    document.body.style.fontFamily = selectedFont;

    // Store font preference
    localStorage.setItem('preferredFont', selectedFont);

    // Apply RTL direction for Arabic
    if (langCode === 'ar') {
        document.body.setAttribute('dir', 'rtl');
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.body.setAttribute('dir', 'ltr');
        document.documentElement.setAttribute('dir', 'ltr');
    }
}

// Change Language (for side menu)
function changeLanguage(langCode, langName) {
    // Remove active class from all language buttons
    const allLangBtns = document.querySelectorAll('.language-btn');
    allLangBtns.forEach(btn => btn.classList.remove('active'));

    // Add active class to selected button
    event.target.closest('.language-btn').classList.add('active');

    // Update current language display
    const currentLangElement = document.getElementById('currentLang');
    const languageMap = {
        'en': 'English (US)',
        'es': 'Español (Spain)',
        'fr': 'Français (France)',
        'de': 'Deutsch (Germany)',
        'it': 'Italiano (Italy)',
        'pt': 'Português (Portugal)',
        'zh': '中文 (China)',
        'ja': '日本語 (Japan)',
        'ko': '한국어 (Korea)',
        'ar': 'العربية (Saudi Arabia)',
        'hi': 'हिन्दी (India)',
        'ru': 'Русский (Russia)'
    };

    currentLangElement.textContent = languageMap[langCode] || langName;

    // Change font based on language
    applyLanguageFont(langCode);

    // Show notification
    showNotification(`Language changed to ${langName}`);

    // Store language preference (in a real app, this would save to backend/localStorage)
    localStorage.setItem('preferredLanguage', langCode);
}

// Load saved language preference on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('preferredLanguage');
    const savedFont = localStorage.getItem('preferredFont');
    const savedFlag = localStorage.getItem('preferredFlag');
    const savedCode = localStorage.getItem('preferredCode');

    if (savedLang && savedFont) {
        // Apply saved font
        document.body.style.fontFamily = savedFont;

        // Apply RTL if Arabic
        if (savedLang === 'ar') {
            document.body.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('dir', 'rtl');
        }

        // Update navbar button if saved
        if (savedFlag && savedCode) {
            const flagElement = document.getElementById('currentFlag');
            const codeElement = document.querySelector('.lang-code');
            if (flagElement) flagElement.textContent = savedFlag;
            if (codeElement) codeElement.textContent = savedCode;
        }
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.3);
        }
    }
`;
document.head.appendChild(style);
