class SocketClient
  constructor: () ->
    @socket = io.connect()

  setCart: (addedItem) ->
    @socket.emit("cart", addedItem)
  
window.SocketClient = SocketClient
