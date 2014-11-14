(function () {
  var SocketClient = {
    socket: io.connect(),

    setCart: function (addedItem) {
      console.log(addedItem)
      this.socket.emit("cart", addedItem);
    }
  };

  window.SocketClient = SocketClient;
})();
