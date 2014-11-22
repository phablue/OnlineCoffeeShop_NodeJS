(function () {
  var SocketClient = {
    socket: io.connect(),

    setCart: function (addedItem) {
      this.socket.emit("cart", addedItem);
    },

    setCoffee: function () {
      this.socket.emit("buy");
    }
  };

  window.SocketClient = SocketClient;
})();
