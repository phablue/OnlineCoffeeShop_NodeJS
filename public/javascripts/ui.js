(function (argument) {
  var UI = {
    coffeeAddBag: function () {
      $('[data-id="addBag"]').click(function () {
        SocketClient.setCart($(event.target).data("info"));
      });
    }
  };

  window.UI = UI
})();
