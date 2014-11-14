(function () {
  var SocketClient = {
    socket: io.connect(),

    setCart: function (addedItem) {
      this.socket.emit("cart", addedItem);
    }
  };

  window.SocketClient = SocketClient;
})();
