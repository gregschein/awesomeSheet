var activeEffects = (function() {

  function render() {
    var activeEffectsToRender;
    if (sheet.getCharacter().statistics.active_effects) {
      for (var i in sheet.getCharacter().statistics.active_effects) {
        var activeEffectsToRender = sheet.getCharacter().statistics.active_effects[i];
        _render_activeEffect(activeEffectsToRender);
      };
    };
  };

  function _render_activeEffect(activeEffect) {
    var activeEffects = helper.e(".js-active-effects");

    var list = document.createElement("ul");
    list.setAttribute("class", "m-active-effect-list");

    var listItem = document.createElement("li");
    listItem.setAttribute("class", "m-active-effect-item");

    var button = document.createElement("li");
    button.setAttribute("class", "m-active-effect-item");
    button.textContent = activeEffect.name;

    listItem.appendChild(button);
    list.appendChild(listItem);
    activeEffects.appendChild(list);
  };

  function clear() {
    // console.log(sheet.getCharacter().statistics.active_effects);
  };

  // exposed methods
  return {
    render: render,
    clear: clear
  };

})();
