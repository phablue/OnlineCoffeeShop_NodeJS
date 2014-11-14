class UI
  constructor: ->

  coffeeAddBag: ->
    $('[data-id="addBag"]').click =>
      SocketClient.setCart($(event.target).data("info"));

window.UI = UI
