// AOS & existing scripts
AOS.init({
  duration: 800,
  delay: 400
});

// Initialize Swipers for each category
var snacksSwiper = new Swiper(".snacks-slider", {
  loop: true,
  spaceBetween: 20,
  slidesPerView: 3,
  pagination: {
      el: ".snacks-slider .swiper-pagination",
      clickable: true,
  },
  navigation: {
      nextEl: ".snacks-slider .swiper-button-next",
      prevEl: ".snacks-slider .swiper-button-prev",
  },
  breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
  },
});

var drinksSwiper = new Swiper(".drinks-slider", {
  loop: true,
  spaceBetween: 20,
  slidesPerView: 3,
  pagination: {
      el: ".drinks-slider .swiper-pagination",
      clickable: true,
  },
  navigation: {
      nextEl: ".drinks-slider .swiper-button-next",
      prevEl: ".drinks-slider .swiper-button-prev",
  },
  breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
  },
});

var dessertsSwiper = new Swiper(".desserts-slider", {
  loop: true,
  spaceBetween: 20,
  slidesPerView: 3,
  pagination: {
      el: ".desserts-slider .swiper-pagination",
      clickable: true,
  },
  navigation: {
      nextEl: ".desserts-slider .swiper-button-next",
      prevEl: ".desserts-slider .swiper-button-prev",
  },
  breakpoints: {
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
  },
});

AOS.init({
  duration: 800,
  delay: 400
});

// Navbar Toggle
let navbar = document.querySelector('.navbar');
document.querySelector('#menu-btn').onclick = () => {
  navbar.classList.toggle('active');
  cartSidebar.classList.remove('active');
};

// Cart Functionality
let cart = [];
let cartCount = document.querySelector('.cart-count');
let cartSidebar = document.querySelector('.cart-sidebar');
let cartItemsContainer = document.querySelector('.cart-items');
let cartTotal = document.querySelector('.cart-total span');

// Initialize cart from localStorage
if (localStorage.getItem('cart')) {
  cart = JSON.parse(localStorage.getItem('cart'));
  updateCart();
}

// Add to cart functionality for Add to Cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', addToCart);
});

function addToCart(e) {
  const box = e.target.closest('.box');
  const item = {
    name: box.querySelector('h3').textContent.replace(/\s+/g, ' ').trim(),
    price: parseFloat(box.querySelector('.price').textContent.match(/\d+/)[0]),
    image: box.querySelector('img').src,
    quantity: 1
  };

  const existingItem = cart.find(cartItem => cartItem.name === item.name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push(item);
  }

  updateCart();
  saveCartToStorage();
}

// ***** UPDATED FUNCTION *****
function updateCart() {
  // Show total item count on cart icon
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Clear current cart display
  cartItemsContainer.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
    // Calculate the item subtotal
    const itemSubtotal = item.price * item.quantity;
    total += itemSubtotal;

    // Build the cart item element
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <!-- Display breakdown: price x quantity = subtotal -->
        <p class="item-breakdown">₹${item.price} × ${item.quantity} = ₹${itemSubtotal.toFixed(2)}</p>
        <div class="cart-item-controls">
          <button class="quantity-decrease" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-increase" data-index="${index}">+</button>
        </div>
      </div>
      <button class="remove-item" data-index="${index}">&times;</button>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  // Update total in the cart
  cartTotal.textContent = total.toFixed(2);
}

// Cart Controls
document.querySelector('#cart-btn').addEventListener('click', () => {
  cartSidebar.classList.add('active');
  navbar.classList.remove('active');
});

document.querySelector('.close-cart').addEventListener('click', () => {
  cartSidebar.classList.remove('active');
});

document.querySelector('.checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) return;
  if (confirm('Confirm checkout?')) {
    cart = [];
    updateCart();
    saveCartToStorage();
    alert('Order placed successfully!');
    cartSidebar.classList.remove('active');
  }
});

document.querySelector('.cart-items').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-item')) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    updateCart();
    saveCartToStorage();
  }

  if (e.target.classList.contains('quantity-increase')) {
    const index = e.target.dataset.index;
    cart[index].quantity++;
    updateCart();
    saveCartToStorage();
  }

  if (e.target.classList.contains('quantity-decrease')) {
    const index = e.target.dataset.index;
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    updateCart();
    saveCartToStorage();
  }
});

function saveCartToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Close cart and navbar on scroll
window.onscroll = () => {
  navbar.classList.remove('active');
  cartSidebar.classList.remove('active');
};
