//Author: Jake Schellhorn
//Description: Script file to update cart count and make Add to Bag buttons functional on menu page

async function fetchUserData() {
  try {
    const response = await fetch("/api/user", {
      credentials: "include",
    });

    if (!response.ok) throw new Error("Failed to fetch user data");

    const user = await response.json();

    document.getElementById("name").value = user.name || "";
    document.getElementById("email").value = user.email || "";
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("Could not fetch user information.");
  }
}



$(document).ready(function () {
  console.log("document is ready");
  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.length || 0;
    $("#cart-count").html("CART " + totalItems);
  }

  document.body.addEventListener("click", function (event) {
    console.log("button pressed");
    if (event.target && event.target.classList.contains("add-to-bag")) {
      const button = event.target;
      const id = button.getAttribute("data-id");
      const name = button.getAttribute("data-name");
      const price = button.getAttribute("data-price");
      console.log(`Added to bag: ${name}, Price: $${price}, ID: ${id}`);

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      let existingItem = cart.find((item) => item.id === id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id,
          name,
          price,
          quantity: 1,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    updateCartCount();
  });

  // Update cart count on page load
  updateCartCount();

  function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let cartItemsContainer = $("#cart-items");
    let totalPrice = 0;

    cartItemsContainer.empty(); // Clear existing items before appending new ones

    if (cart.length === 0) {
      $("#empty-cart-message").show();
      $("#cart-total").text("0.00");
      return;
    }

    $("#empty-cart-message").hide();

    cart.forEach((item, index) => {
      let itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      let cartItemHtml = `
        <div class="cart-item">
          <h2 id="item">${item.name}</h2>
          <h2 id="quantity">Price: $${item.price}</h2>
          <h2>Quantity: <button class="decrease" data-index="${index}">-</button> ${
        item.quantity
      } <button class="increase" data-index="${index}">+</button>
          <h2>Total: $${itemTotal.toFixed(2)}
          <button class="remove-item" data-index="${index}">Remove</button>
        </div>
        <hr>
      `;
      cartItemsContainer.append(cartItemHtml);
    });

    $("#cart-total").text("Total:" + totalPrice.toFixed(2));
  }

// Event Listener for Purchasing Cart
$("#purchase-cart").click(async function () {
  event.preventDefault();
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
  }

  try {
      const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Ensures session cookies are sent
          body: JSON.stringify({ cart }) // Send cart array
      });

      const data = await response.json();

      if (response.ok) {
          alert("Order successfully placed!");
          localStorage.removeItem("cart"); // Clear cart after order
          loadCart();
          updateCartCount();
      } else {
          alert("Error placing order: " + data.error);
      }
  } catch (error) {
      console.error("Purchase Error:", error);
      alert("An error occurred while purchasing.");
  }
});


  // Event Listener for Clearing Cart
  $("#clear-cart").click(function () {
    localStorage.removeItem("cart");
    loadCart();
    updateCartCount();
  });


  // Event Listeners for Updating Quantity
  $(document).on("click", ".increase", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let index = $(this).data("index");
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
  });

  $(document).on("click", ".decrease", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let index = $(this).data("index");
    if (cart[index].quantity > 1) {
      cart[index].quantity -= 1;
    } else {
      cart.splice(index, 1); // Remove item if quantity is 0
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
  });

  // Event Listener for Removing Items
  $(document).on("click", ".remove-item", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let index = $(this).data("index");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
  });

  // Load cart on page load
  loadCart();
});
