//Author: Jake Schellhorn
//Description: Script file to update cart count and make Add to Bag buttons functional on menu page

$(document).ready(function () {
  function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    $("#cart-count").html("CART ", totalItems);
  }

  $(".add-to-bag").click(function () {
    let productId = $(this).data("id");
    let productName = $(this).data("name");
    let productPrice = $(this).data("price");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
  });

  // Update cart count on page load
  updateCartCount();
});
