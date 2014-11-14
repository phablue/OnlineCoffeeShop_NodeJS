(function (argument) {
  var UI = {
    coffeeAddBag: function () {
      $('[data-id="addBag"]').click(function () {
        var addedItem = eval("(" + $(event.target).data("info") + ")");
        SocketClient.setCart(addedItem);
      });
    }
  };
  window.UI = UI
})();
