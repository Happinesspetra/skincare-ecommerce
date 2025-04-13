// Side navigation functions
function openNav() {
  const sidenav = document.getElementById("mySidenav");
  sidenav.style.width = "100%";
  sidenav.style.height = "100vh";
  document.body.style.overflow = "hidden"; // Prevent scrolling when sidenav is open
}

function closeNav() {
  const sidenav = document.getElementById("mySidenav");
  sidenav.style.width = "0";
  document.body.style.overflow = "auto"; // Re-enable scrolling
}

// Cart functions
function openCart() {
  document.getElementById('cart-drawer').style.right = '0';
  document.getElementById('cart-backdrop').style.display = 'block';
  renderCart();
}

function closeCart() {
  document.getElementById('cart-drawer').style.right = '-100%';
  document.getElementById('cart-backdrop').style.display = 'none';
}

// Cart management
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  const item = { name, price };
  cart.push(item);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} has been added to your cart!`);
  updateCartCount();
}

function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    cartCountEl.textContent = cart.length;
  }
}

function renderCart() {
  const cartContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("total-price");
  cartContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach((item, index) => {
      total += item.price;
      cartContainer.innerHTML += `
        <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
          <span>${item.name} - $${item.price.toFixed(2)}</span>
          <button onclick="removeItem(${index})" style="background: none; border: none; color: red; cursor: pointer;">Remove</button>
        </div>
      `;
    });
  }
  totalEl.textContent = `Total: $${total.toFixed(2)}`;
}

function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    alert("Proceeding to checkout...");
  }
}

// Search functionality
function toggleSearch(event) {
  if (event) event.preventDefault();
  event.stopPropagation();
  const searchBar = document.getElementById("search-bar");
  const userModal = document.getElementById("user-modal");

  if (userModal) userModal.style.display = "none";

  if (searchBar) {
    searchBar.style.display = searchBar.style.display === "block" ? "none" : "block";
    if (searchBar.style.display === "block") {
      const searchInput = searchBar.querySelector("input");
      if (searchInput) searchInput.focus();
    }
  }
}

// User modal functionality
function toggleUserModal(event) {
  if (event) event.preventDefault();
  event.stopPropagation();
  const userModal = document.getElementById("user-modal");
  const searchBar = document.getElementById("search-bar");

  if (searchBar) searchBar.style.display = "none";

  if (userModal) {
    userModal.style.display = userModal.style.display === "block" ? "none" : "block";
  }
}

function closeUserModal() {
  const userModal = document.getElementById("user-modal");
  if (userModal) userModal.style.display = "none";
}

// Handle clicks outside modals
function handleClickOutside(event) {
  const searchBar = document.getElementById("search-bar");
  const userModal = document.getElementById("user-modal");

  if (searchBar && !searchBar.contains(event.target)) {
    if (!event.target.closest("a[href='#search']")) {
      searchBar.style.display = "none";
    }
  }

  if (userModal && !userModal.contains(event.target)) {
    if (!event.target.closest("a[href='#user']")) {
      userModal.style.display = "none";
    }
  }
}

// Auth functionality
let isLogin = true;

function toggleAuthMode() {
  isLogin = !isLogin;
  document.getElementById("form-title").textContent = isLogin ? "Login" : "Register";
  document.getElementById("toggle-auth").textContent = isLogin
    ? "Don't have an account? Register"
    : "Already have an account? Login";
}

function submitAuth() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password.");
    return;
  }

  const storedUsers = JSON.parse(localStorage.getItem("users") || "{}");

  if (isLogin) {
    if (storedUsers[username] && storedUsers[username] === password) {
      alert("Login successful!");
      closeUserModal();
    } else {
      alert("Invalid credentials!");
    }
  } else {
    if (storedUsers[username]) {
      alert("Username already exists!");
    } else {
      storedUsers[username] = password;
      localStorage.setItem("users", JSON.stringify(storedUsers));
      alert("Registered successfully! Now you can login.");
      toggleAuthMode();
    }
  }
}

// Mobile menu functionality
function toggleMobileMenu() {
  const mobileMenu = document.querySelector('.mobile_menu');
  if (mobileMenu) {
    mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
  }
}

function handleResize() {
  const menuIcon = document.querySelector('.menu_icon');
  const desktopIcons = document.querySelector('.desktop_icons');
  const mobileMenu = document.querySelector('.mobile_menu');

  if (window.innerWidth <= 768) {
    if (menuIcon) menuIcon.style.display = 'block';
    if (desktopIcons) desktopIcons.style.display = 'none';
  } else {
    if (menuIcon) menuIcon.style.display = 'none';
    if (desktopIcons) desktopIcons.style.display = 'flex';
    if (mobileMenu) mobileMenu.style.display = 'none';
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  handleResize();

  const searchBar = document.getElementById("search-bar");
  const userModal = document.getElementById("user-modal");
  if (searchBar) searchBar.style.display = "none";
  if (userModal) userModal.style.display = "none";

  // Desktop buttons
  const desktopSearchButtons = document.querySelectorAll(".desktop_icons a[href='#search']");
  const desktopUserButtons = document.querySelectorAll(".desktop_icons a[href='#user']");

  desktopSearchButtons.forEach(button => {
    button.addEventListener("click", toggleSearch);
  });

  desktopUserButtons.forEach(button => {
    button.addEventListener("click", toggleUserModal);
  });
  mobileUserButtons.forEach(button => {
    button.addEventListener("click", function(e) {
      toggleUserModal(e);
      toggleMobileMenu(); // Close mobile menu after click
    });
  });

  document.addEventListener("click", handleClickOutside);

  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }
});

window.addEventListener('scroll', function () {
  const button = document.getElementById('backToTop');
  if (button) {
    button.style.display = window.scrollY > 300 ? 'block' : 'none';
  }
});

window.addEventListener('resize', handleResize);
