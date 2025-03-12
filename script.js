// Add this at the top of script.js
console.log('Script loaded successfully!');

// Initialize global variables
let cart = [];
let total = 0;
let subtotal = 0;
let tax = 0;

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    console.log('Script loaded successfully!');

    // Get all required DOM elements
    const menuGrid = document.querySelector('.menu-grid');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Dark Mode Toggle Functionality
    if (darkModeToggle) {
        // Check for saved preference
        const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
        
        // Initialize dark mode
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
            darkModeToggle.checked = true;
        }

        // Handle toggle
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', darkModeToggle.checked);
            
            // Add visual feedback
            const notification = showNotification(
                darkModeToggle.checked ? 'Dark mode enabled' : 'Light mode enabled'
            );
        });
    }

    // Menu Category Filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    // Initialize menu - show all items
    menuItems.forEach(item => {
        item.style.display = 'block';
        item.style.animation = 'fadeInUp 0.5s ease-out forwards';
    });

    // Food Type Filtering
    const foodFilterBtns = document.querySelectorAll('.food-filter-btn');
    
    function filterByFoodType(selectedType) {
        const activeCategory = document.querySelector('.category-btn.active').dataset.category;
        
        menuItems.forEach(item => {
            const itemType = item.dataset.type;
            const matchesCategory = activeCategory === 'all' || item.dataset.category === activeCategory;
            
            if (selectedType === 'all') {
                item.style.display = matchesCategory ? 'block' : 'none';
            } else {
                item.style.display = (itemType === selectedType && matchesCategory) ? 'block' : 'none';
            }
            
            if (item.style.display === 'block') {
                item.style.animation = 'fadeInUp 0.5s ease-out forwards';
            }
        });
    }

    // Handle food filter button clicks
    foodFilterBtns.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            foodFilterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter items
            filterByFoodType(button.dataset.type);
        });
    });

    // Update category button click handler
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // Get current food type filter
            const activeFilter = document.querySelector('.food-filter-btn.active').dataset.type;
            filterByFoodType(activeFilter);
        });
    });

    // Menu Navigation
    if (menuGrid && prevBtn && nextBtn) {
        const scrollAmount = 600;
        nextBtn.addEventListener('click', () => {
            menuGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            menuGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // Menu Item Hover Effects
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            requestAnimationFrame(() => item.style.transform = 'translateY(-10px)');
        });
        
        item.addEventListener('mouseleave', () => {
            requestAnimationFrame(() => item.style.transform = 'translateY(0)');
        });
    });

    // Mobile Menu Toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Add to Cart Functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.dataset.item;
            const price = parseFloat(button.dataset.price);
            addToCart(item, price, button);
        });
    });

    // Set 'All' category as active by default
    const allButton = document.querySelector('.category-btn[data-category="all"]');
    if (allButton) {
        allButton.classList.add('active');
    }

    // Handle lazy loading of images
    const menuImages = document.querySelectorAll('.menu-item .item-image img');
    menuImages.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });

    // Payment Gateway Functionality
    const paymentMethods = document.querySelectorAll('input[name="payment"]');
    const paymentForms = document.querySelectorAll('.payment-form');
    const paymentAmounts = document.querySelectorAll('.payment-amount');
    const paymentSection = document.getElementById('payment-section');

    // Update payment amount
    function updatePaymentAmount() {
        paymentAmounts.forEach(amount => {
            amount.textContent = total.toFixed(2);
        });
    }

    // Show payment section when checkout button is clicked
    document.getElementById('checkout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        if (cart.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        paymentSection.style.display = 'block';
        updatePaymentAmount();
        paymentSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Handle payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('change', () => {
            // Hide all forms
            paymentForms.forEach(form => form.style.display = 'none');
            // Show selected form
            document.querySelector(`.${method.value}-form`).style.display = 'block';
        });
    });

    // Card number formatting
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }

    // Expiry date formatting
    const expiry = document.getElementById('expiry');
    if (expiry) {
        expiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }

    // Handle payment submission
    document.querySelectorAll('.pay-now-btn').forEach(button => {
        button.addEventListener('click', () => {
            // Add your payment processing logic here
            showNotification('Processing payment...');
            setTimeout(() => {
                showNotification('Payment successful! Order confirmed.');
                cart = [];
                subtotal = 0;
                tax = 0;
                total = 0;
                updateCart();
                updateCartCount();
                paymentSection.style.display = 'none';
            }, 2000);
        });
    });

    // Address Management
    const addressForm = document.getElementById('addressForm');
    const savedAddressesContainer = document.getElementById('savedAddresses');
    let savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];

    // Display saved addresses
    function displaySavedAddresses() {
        if (savedAddressesContainer) {
            savedAddressesContainer.innerHTML = savedAddresses.map((address, index) => `
                <div class="address-card" data-index="${index}">
                    <div class="address-info">
                        <h4>${address.fullName}</h4>
                        <p>${address.street}, ${address.city} - ${address.pincode}</p>
                        <p>${address.phone}</p>
                    </div>
                    <span class="address-type-badge ${address.type}">${address.type}</span>
                </div>
            `).join('');

            // Add click handlers to address cards
            document.querySelectorAll('.address-card').forEach(card => {
                card.addEventListener('click', () => {
                    document.querySelectorAll('.address-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    
                    // Fill form with selected address
                    const address = savedAddresses[card.dataset.index];
                    Object.keys(address).forEach(key => {
                        const input = document.getElementById(key);
                        if (input) input.value = address[key];
                    });
                });
            });
        }
    }

    // Handle address form submission
    if (addressForm) {
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                fullName: document.getElementById('fullName').value,
                phone: document.getElementById('phone').value,
                street: document.getElementById('street').value,
                city: document.getElementById('city').value,
                pincode: document.getElementById('pincode').value,
                type: document.getElementById('addressType').value
            };

            if (document.getElementById('saveAddress').checked) {
                savedAddresses.push(formData);
                localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
                displaySavedAddresses();
                showNotification('Address saved successfully!');
            }
        });
    }

    // Initialize saved addresses
    displaySavedAddresses();

    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            e.target.value = value;
        });
    }

    // Pincode validation
    const pincodeInput = document.getElementById('pincode');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 6) value = value.slice(0, 6);
            e.target.value = value;
        });
    }
});

// Cart related functions
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
    cartCount.classList.add('updating');
    setTimeout(() => cartCount.classList.remove('updating'), 300);
}

function addToCart(item, price, button) {
    cart.push({ name: item, price: price });
    subtotal += price;
    tax = subtotal * 0.1;
    total = subtotal + tax;
    
    const menuItem = button.closest('.menu-item');
    const itemName = menuItem.querySelector('h3');
    const itemPrice = menuItem.querySelector('.price');
    
    itemName.classList.add('added-to-cart');
    itemPrice.classList.add('added-to-cart');
    
    updateCart();
    updateCartCount();
    showNotification(`Added ${item} to cart!`);
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const subtotalAmount = document.getElementById('subtotal-amount');
    const taxAmount = document.getElementById('tax-amount');
    const totalAmount = document.getElementById('total-amount');
    
    if (cartItems) {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <button onclick="removeItem(${index})" class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
                <div class="item-details">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">₹${item.price.toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }
    
    if (subtotalAmount) subtotalAmount.textContent = subtotal.toFixed(2);
    if (taxAmount) taxAmount.textContent = tax.toFixed(2);
    if (totalAmount) totalAmount.textContent = total.toFixed(2);
}

function removeItem(index) {
    const removedItem = cart[index];
    subtotal -= removedItem.price;
    tax = subtotal * 0.1;
    total = subtotal + tax;
    
    document.querySelectorAll('.menu-item').forEach(item => {
        const itemName = item.querySelector('h3').textContent;
        if (itemName === removedItem.name) {
            item.querySelector('h3').classList.remove('added-to-cart');
            item.querySelector('.price').classList.remove('added-to-cart');
        }
    });
    
    cart.splice(index, 1);
    updateCart();
    updateCartCount();
}

function showNotification(message) {
    // Create container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;

    // Add to container
    container.appendChild(notification);

    // Remove after animation
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Set the birthday date and time (12 PM)
const birthdayDate = new Date('2024-04-15T12:00:00'); // Change this to the actual birthday

function updateCountdown() {
    const currentDate = new Date();
    const difference = birthdayDate - currentDate;

    if (difference <= 0) {
        document.getElementById('celebration').classList.remove('hidden');
        createConfetti();
        createBalloons();
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

function createConfetti() {
    const confettiContainer = document.querySelector('.confetti-container');
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `float ${Math.random() * 3 + 2}s linear forwards`;
        confettiContainer.appendChild(confetti);
    }
}

function createBalloons() {
    const balloonsContainer = document.querySelector('.balloons');
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#ff8484', '#a8e6cf'];

    for (let i = 0; i < 30; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 100 + 'vw';
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animation = `float ${Math.random() * 6 + 4}s ease-in-out infinite`;
        balloonsContainer.appendChild(balloon);
    }
}

// Add photo hover effect
document.querySelectorAll('.photo-container').forEach(photo => {
    photo.addEventListener('mouseover', () => {
        photo.style.transform = 'scale(1.05) rotate(2deg)';
    });

    photo.addEventListener('mouseout', () => {
        photo.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const menuImages = document.querySelectorAll('.item-image img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                observer.unobserve(img);
            }
        });
    });

    menuImages.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });
});

// Keep utility functions outside DOMContentLoaded
function handleScroll(direction) {
    const menuGrid = document.querySelector('.menu-grid');
    menuGrid.scrollBy({
        left: direction * 400,
        behavior: 'smooth'
    });
}