document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    const productCards = document.querySelectorAll('.product-card');
    const features = document.querySelectorAll('.feature');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Add to cart
    if (addToCartButtons) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const product = {
                    id: Date.now(),
                    name: productCard.querySelector('h3').textContent,
                    price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
                    image: productCard.querySelector('img').src
                };
                cart.push(product);
                localStorage.setItem('cart', JSON.stringify(cart));
                alert('Added to cart!');
            });
        });
    }

    // Display cart items
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="remove-from-cart" data-id="${item.id}">Remove</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }
    }

    // Remove from cart
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-from-cart')) {
                const itemId = parseInt(e.target.dataset.id);
                const itemIndex = cart.findIndex(item => item.id === itemId);
                if (itemIndex > -1) {
                    cart.splice(itemIndex, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    location.reload(); // Simple way to re-render the cart
                }
            }
        });
    }
    
    // Calculate and display total price
    if (totalPriceElement) {
        const totalPrice = cart.reduce((total, item) => total + item.price, 0);
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }

    // Filter and Search
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;

        productCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const cardCategory = card.dataset.category;
            
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = category === 'all' || cardCategory === category;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if(searchInput) {
        searchInput.addEventListener('keyup', filterProducts);
    }

    if(categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }

    // Scroll Animation
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.5
    });

    if(features) {
        features.forEach(feature => {
            observer.observe(feature);
        });
    }


    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Modal
    const modal = document.getElementById('game-modal');
    const closeButton = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTrailerLink = document.getElementById('modal-trailer-link');

    productCards.forEach(card => {
        if (card.dataset.category === 'game') {
            card.addEventListener('click', (e) => {
                if (e.target.tagName === 'BUTTON') return;
                const title = card.querySelector('h3').textContent;
                const description = card.dataset.description;
                let trailerUrl = card.dataset.trailer;
                modalTitle.textContent = title;
                modalDescription.textContent = description;
                modalTrailerLink.href = trailerUrl;
                modal.style.display = 'block';
            });
        }
    });

    if(closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });
});