"use strict";

/// View for starting a game.
class InitView {
  constructor(viewController) {
    this.viewController = viewController;

    var sessionPickerInput = $('.session-picker input[type=text');
    var sessionPickerButton = $('.session-picker button');

    sessionPickerButton.click(function() {
      var sessionName = sessionPickerInput.val();
      socket.emit('join session name', sessionName);
      history.pushState(null, null, '?session=' + sessionName);
      viewController.showGameView(sessionName);
    });

    sessionPickerInput.keyup(function() {
      var sessionName = sessionPickerInput.val();
      $.get('/game-session-exists', {
        'sessionName': sessionName
      }, function(response) {
        if (response.exists) sessionPickerButton.text('join session');
        else sessionPickerButton.text('create session');
      });
    });
  }
}
