(function () {
  var UI = {
    url: "http://localhost:3000/cart/",

    coffeeAddBag: function () {
      $('[data-id="addBag"]').click(function () {
        var addedItem = eval("(" + $(event.target).data("info") + ")");
        SocketClient.setCart(addedItem);
      });
    },

    changeItemQtyInCart: function () {
      $('[data-id="update"]').click(function (e) {
        $.post(UI.url + $(e.target).data("name") + "/update",
          { count: $(e.target).siblings("input").val(),
            origin : $(e.target).siblings("input").data("qty")});
        e.preventDefault();
      });
    }
  };
  window.UI = UI
})();
