var display = (function() {

  function bind() {
    _bind_fab();
  };

  function _bind_fab() {
    var fabButton = helper.e(".js-fab-button");
    fabButton.addEventListener("click", function() {
      totalBlock.render();
      clear();
      render();
      toggle();
      themeColor.update();
    }, false);
  };

  function update() {
    _update_displayState();
    _update_displayPlaceholder();
  };

  function _update_displayState() {
    var quickNav = helper.e(".js-quick-nav");
    var fab = helper.e(".js-fab");
    var fabButton = helper.e(".js-fab-button");
    var fabIcon = helper.e(".js-fab-icon");
    var all_section = helper.eA(".js-section");
    var anySectionDisplay = false;
    var allSectionDisplay = 0;
    var _displayOn = function() {
      helper.addClass(fabIcon, "icon-edit");
      helper.removeClass(fabIcon, "icon-reader-mode");
      helper.removeClass(fabButton, "button-primary");
      helper.addClass(fabButton, "button-secondary");
      helper.addClass(quickNav, "is-display-mode");
    };
    var _displayOff = function() {
      helper.removeClass(fabIcon, "icon-edit");
      helper.addClass(fabIcon, "icon-reader-mode");
      helper.addClass(fabButton, "button-primary");
      helper.removeClass(fabButton, "button-secondary");
      helper.removeClass(quickNav, "is-display-mode");
    };
    for (var i = 0; i < all_section.length; i++) {
      if (all_section[i].dataset.displayMode == "true") {
        anySectionDisplay = true;
        allSectionDisplay++;
      };
    };
    if (anySectionDisplay) {
      if (allSectionDisplay == all_section.length) {
        fab.dataset.displayMode = true;
        fab.dataset.displayModeAll = true;
        _displayOn();
      } else {
        fab.dataset.displayMode = true;
        fab.dataset.displayModeAll = false;
        _displayOff();
      };
    } else {
      fab.dataset.displayMode = false;
      fab.dataset.displayModeAll = false;
      _displayOff();
    };
  };

  function _toggle_section(element, forceToggle) {
    var icon = element.querySelector(".js-card-toggle-icon");
    var section = helper.getClosest(element, ".js-section");
    var minimise = (section.dataset.minimise == "true");
    var edit = section.querySelector(".js-edit");
    var cardTabs = section.querySelector(".js-card-tabs");
    var all_display = section.querySelectorAll(".js-display");

    var _displayOn = function() {
      section.dataset.displayMode = "true";
      helper.addClass(section, "is-display-mode");
      helper.addClass(edit, "is-hidden");
      if (cardTabs && !minimise) {
        helper.addClass(cardTabs, "is-hidden");
      };
      for (var i = 0; i < all_display.length; i++) {
        helper.removeClass(all_display[i], "is-hidden");
      };
      helper.addClass(icon, "icon-edit");
      helper.removeClass(icon, "icon-reader-mode");
    };

    var _displayOff = function() {
      section.dataset.displayMode = "false";
      helper.removeClass(section, "is-display-mode");
      helper.removeClass(edit, "is-hidden");
      if (cardTabs && !minimise) {
        helper.removeClass(cardTabs, "is-hidden");
      };
      for (var i = 0; i < all_display.length; i++) {
        helper.addClass(all_display[i], "is-hidden");
      };
      helper.removeClass(icon, "icon-edit");
      helper.addClass(icon, "icon-reader-mode");
    };

    if (forceToggle == true) {
      _displayOn();
    } else if (forceToggle == false) {
      _displayOff();
    } else {
      if (section.dataset.displayMode == "true") {
        _displayOff();
      } else if (section.dataset.displayMode == "false" || !section.dataset.displayMode) {
        _displayOn();
      };
    };

  };

  function _toggle_all_section() {
    var fab = helper.e(".js-fab");
    var all_section = helper.eA(".js-section");
    if (fab.dataset.displayMode == "true") {
      fab.dataset.displayMode = "false";
      for (var i = 0; i < all_section.length; i++) {
        _toggle_section(all_section[i], false);
      };
    } else if (fab.dataset.displayMode == "false" || !fab.dataset.displayMode) {
      fab.dataset.displayMode = "true";
      for (var i = 0; i < all_section.length; i++) {
        _toggle_section(all_section[i], true);
      };
    };
    update();
  };

  function toggle(section, boolean) {
    if (section) {
      _toggle_section(section, boolean);
    } else {
      _toggle_all_section();
    };
  };

  function clear(section) {
    var _removeAllChildren = function(parent) {
      while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
      };
    };
    if (section) {
      var all_target = section.querySelectorAll(".js-display-block-target");
    } else {
      var all_target = helper.eA(".js-display-block-target");
    };
    for (var i = 0; i < all_target.length; i++) {
      var displayBlock = helper.getClosest(all_target[i], ".js-display-block");
      displayBlock.dataset.displayContent = false;
      _removeAllChildren(all_target[i]);
    };
  };

  function _get_all_spell(all_displayPath) {
    var all_node = [];
    for (var i = 0; i < all_displayPath.length; i++) {
      var bookPath = all_displayPath[i].split(".");
      var all_spells = sheet.getCharacter()[bookPath[0]][bookPath[1]][bookPath[2]]["level_" + bookPath[2]];
      if (all_spells.length == 0) {
        all_node.push(false);
      } else {
        for (var j = 0; j < all_spells.length; j++) {
          var spell = all_spells[j];
          all_node.push(_get_spell(spell, bookPath[2], j));
        };
      };
    };
    return all_node;
  };

  function _get_spell(spell, level, index) {
    var displayListItem = document.createElement("li");
    displayListItem.setAttribute("class", "m-display-list-item m-display-list-item-spell");
    var displayListItemPrefix = document.createElement("span");
    displayListItemPrefix.setAttribute("class", "m-display-list-item-spell-name");
    var spellName = document.createElement("span");
    spellName.textContent = spell.name;
    var displayListItemValue = document.createElement("span");
    displayListItemValue.setAttribute("class", "m-display-list-item-spell-count");
    displayListItemPrefix.appendChild(spellName);
    displayListItem.appendChild(displayListItemPrefix);
    displayListItem.appendChild(displayListItemValue);
    displayListItem.setAttribute("data-spell-level", level);
    displayListItem.setAttribute("data-spell-count", index);
    // prepared
    if (spell.prepared > 0) {
      // var marks = document.createElement("span");
      for (var j = 0; j < spell.prepared; j++) {
        var preparedIcon = document.createElement("span");
        preparedIcon.setAttribute("class", "icon-radio-button-checked");
        displayListItemValue.insertBefore(preparedIcon, displayListItemValue.firstChild);
      };
    };
    // cast
    if (spell.cast > 0) {
      var all_check = displayListItemValue.querySelectorAll(".icon-radio-button-checked");
      for (var j = 0; j < spell.cast; j++) {
        if (all_check[j]) {
          helper.toggleClass(all_check[j], "icon-radio-button-checked");
          helper.toggleClass(all_check[j], "icon-radio-button-unchecked");
        };
      };
    };
    // active
    if (spell.active) {
      var spellActive = document.createElement("span");
      spellActive.setAttribute("class", "m-display-list-item-spell-active");
      var activeIcon = document.createElement("span");
      activeIcon.setAttribute("class", "icon-play-arrow");
      spellActive.appendChild(activeIcon);
      spellName.insertBefore(spellActive, spellName.firstChild);
    };
    displayListItem.addEventListener("click", function() {
      spells.update(helper.e(".js-spell-book-known-level-" + level).querySelectorAll(".js-spell-col")[index].querySelector(".js-spell"), true);
    }, false);
    return displayListItem;
  };

  function _get_all_skill(all_displayPath, displayPrefix) {
    var all_node = [];
    for (var i = 0; i < all_displayPath.length; i++) {
      var path = all_displayPath[i];
      var prefix = displayPrefix[i];
      all_node.push(_get_skill(path, prefix));
    };
    return all_node;
  };

  function _get_skill(path, prefix) {
    var object = helper.getObject(sheet.getCharacter(), path);
    var displayListItem;
    if (typeof object != "undefined" && object != "") {

      if (object.ranks != "undefined" && object.ranks != "") {
        displayListItem = document.createElement("li");
        displayListItem.setAttribute("class", "m-display-list-item");
        var value = document.createElement("span");
        value.setAttribute("class", "m-display-list-item-value");
        value.textContent = "+" + object.current;
        if (prefix || object["name"] || object["variant_name"]) {
          var displayListItemPrefix = document.createElement("span");
          displayListItemPrefix.setAttribute("class", "m-display-list-item-prefix");
          if (object["name"]) {
            displayListItemPrefix.textContent = object["name"] + " ";
          } else if (object["variant_name"]) {
            displayListItemPrefix.textContent = object["variant_name"] + " ";
          } else {
            displayListItemPrefix.textContent = prefix;
          };
          displayListItem.appendChild(displayListItemPrefix);
        };
        displayListItem.appendChild(value);
      } else {
        displayListItem = false;
      };

    };
    return displayListItem;
  };

  function _get_all_clone(all_displayPath) {
    var all_node = [];

    for (var i = 0; i < all_displayPath.length; i++) {
      var all_clones = helper.getObject(sheet.getCharacter(), all_displayPath[i]);
      if (all_clones.length == 0) {
        all_node.push(false);
      } else {
        for (var j = 0; j < all_clones.length; j++) {
          var cloneType;
          if (all_displayPath[i] == "basics.classes") {
            cloneType = "class";
          };
          if (all_displayPath[i] == "equipment.consumable") {
            cloneType = "consumable";
          };
          if (all_displayPath[i] == "equipment.item") {
            cloneType = "item";
          };
          if (all_displayPath[i] == "skills.custom") {
            cloneType = "skill";
          };
          if (all_displayPath[i] == "offense.attack.melee") {
            cloneType = "attack-melee";
          };
          if (all_displayPath[i] == "offense.attack.ranged") {
            cloneType = "attack-ranged";
          };
          if (all_displayPath[i] == "notes.character") {
            cloneType = "note-character";
          };
          if (all_displayPath[i] == "notes.story") {
            cloneType = "note-story";
          };
          all_node.push(_get_clone(all_clones[j], cloneType));
        };
      };
    };
    return all_node;
  };

  function _get_clone(object, cloneType) {
    var _get_cloneItem = function(object, cloneType) {
      var displayListItem;

      if (cloneType == "class") {
        displayListItem = document.createElement("span");
        displayListItem.setAttribute("class", "m-display-item-text-snippet");
        for (var i in object) {
          if (i == "classname") {
            var data = object[i];
            if (typeof data != "undefined" && data != "") {
              var displayListItemPrefix = document.createElement("span");
              displayListItemPrefix.setAttribute("class", "m-display-item-text-snippet-prefix");
              displayListItemPrefix.textContent = data;
              displayListItem.appendChild(displayListItemPrefix);
            };
          } else if (i == "level") {
            var data = object[i];
            if (typeof data != "undefined" && data != "" || data == 0) {
              var displayListItemValue = document.createElement("span");
              displayListItemValue.setAttribute("class", "m-display-item-text-snippet-value");
              displayListItemValue.textContent = data;
              displayListItem.appendChild(displayListItemValue);
            };
          };
        };
      };

      if (cloneType == "consumable") {
        displayListItem = document.createElement("li");
        displayListItem.setAttribute("class", "m-display-list-item");
        for (var i in object) {
          if (i == "item") {
            var data = object[i];
            if (typeof data != "undefined" && data != "") {
              var displayListItemPrefix = document.createElement("span");
              displayListItemPrefix.setAttribute("class", "m-display-list-item-prefix");
              displayListItemPrefix.textContent = data;
              displayListItem.appendChild(displayListItemPrefix);
            };
          } else if (i == "current") {
            var data = object[i];
            if (typeof data != "undefined" && data != "" || data == 0) {
              var displayListItemValue = document.createElement("span");
              displayListItemValue.setAttribute("class", "m-display-list-item-value");
              if (typeof object.total != "undefined" && object.total != "") {
                data = data + "/" + object.total;
              };
              displayListItemValue.textContent = data;
              displayListItem.appendChild(displayListItemValue);
            };
          };
        };
        var percentage = parseFloat(((object.total - object.used) / object.total) * 100).toFixed(2);
        if (percentage < 0) {
          percentage = 0;
        };
        var percentageBar = document.createElement("span");
        percentageBar.setAttribute("class", "m-display-list-item-percentage");
        percentageBar.setAttribute("style", "width: " + percentage + "%;");
        displayListItem.appendChild(percentageBar);
        // console.log(object.item, object.total, object.used, percentage);
      };

      if (cloneType == "item") {
        displayListItem = document.createElement("li");
        displayListItem.setAttribute("class", "m-display-list-item");
        for (var i in object) {
          if (i == "name") {
            var data = object[i];
            if (typeof data != "undefined" && data != "") {
              var displayListItemPrefix = document.createElement("span");
              displayListItemPrefix.setAttribute("class", "m-display-list-item-prefix");
              displayListItemPrefix.textContent = data;
              displayListItem.appendChild(displayListItemPrefix);
            };
          } else if (i == "quantity") {
            var data = object[i];
            if (typeof data != "undefined" && data != "" || data == 0) {
              var displayListItemValue = document.createElement("span");
              displayListItemValue.setAttribute("class", "m-display-list-item-value");
              displayListItemValue.textContent = data;
              displayListItem.appendChild(displayListItemValue);
            };
          };
        };
      };

      if (cloneType == "skill") {
        if (object.ranks != "undefined" && object.ranks != "") {
          displayListItem = document.createElement("li");
          displayListItem.setAttribute("class", "m-display-list-item");
          var displayListItemValue = document.createElement("span");
          displayListItemValue.setAttribute("class", "m-display-list-item-value");
          displayListItemValue.textContent = "+" + object.current;
          if (object["name"]) {
            var displayListItemPrefix = document.createElement("span");
            displayListItemPrefix.setAttribute("class", "m-display-list-item-prefix");
            displayListItemPrefix.textContent = object["name"];
          } else {
            displayListItemPrefix.textContent = "Custom Skill";
          };
          displayListItem.appendChild(displayListItemPrefix);
          displayListItem.appendChild(displayListItemValue);
        } else {
          displayListItem = false;
        };
      };

      if (cloneType == "attack-melee" || cloneType == "attack-ranged") {
        displayListItem = document.createElement("li");
        displayListItem.setAttribute("class", "m-display-list-item-" + cloneType);
        for (var i in object) {
          if (i == "weapon" || i == "damage" || i == "critical" || i == "range" || i == "ammo") {
            var data = object[i];
            if (typeof data != "undefined" && data != "") {
              var displayListItemPrefix = document.createElement("span");
              displayListItemPrefix.setAttribute("class", "m-display-list-item-" + cloneType + "-" + i);
              displayListItemPrefix.textContent = data;
              displayListItem.appendChild(displayListItemPrefix);
            };
          } else if (i == "attack") {
            var data = object[i];
            if (typeof data != "undefined" && data != "") {
              var displayListItemValue = document.createElement("h2");
              displayListItemValue.setAttribute("class", "m-display-list-item-" + cloneType + "-" + i);
              displayListItemValue.textContent = data;
              displayListItem.appendChild(displayListItemValue);
            };
          };
        };
      };

      if (cloneType == "note-character" || cloneType == "note-story") {
        displayListItem = document.createElement("li");
        displayListItem.setAttribute("class", "m-display-list-item");
        for (var i in object) {
          var data = object[i];
          if (typeof data != "undefined" && data != "") {
            displayListItem.innerHTML = data;
          };
        };
      };

      return displayListItem;
    };

    for (var i in object) {
      var testForValues = false;
      for (var j in object[i]) {
        if (typeof object[i][j] != "undefined" && object[i][j] != "") {
          testForValues = true;
        };
      };
      if (testForValues) {
        return _get_cloneItem(object, cloneType);
      } else {
        return false;
      };
    };

  };

  function _get_all_list(all_displayPath, all_displayPrefix, all_displaySuffix, displayValueType) {
    var all_node = [];
    for (var i = 0; i < all_displayPath.length; i++) {
      var path = all_displayPath[i];
      var prefix = false;
      var suffix = false;
      var valueType = false;
      if (all_displayPrefix[i]) {
        prefix = all_displayPrefix[i];
      };
      if (all_displaySuffix[i]) {
        suffix = all_displaySuffix[i];
      };
      if (displayValueType[i]) {
        valueType = displayValueType[i];
      };
      all_node.push(_get_list(path, prefix, suffix, valueType));
    };
    return all_node;
  };

  function _get_list(path, prefix, suffix, valueType) {
    var data = helper.getObject(sheet.getCharacter(), path);
    var displayListItem;
    if (typeof data != "undefined" && data != "") {
      if (valueType == "bonus" && data > 0) {
        data = "+" + data;
      };
      displayListItem = document.createElement("li");
      displayListItem.setAttribute("class", "m-display-list-item");
      var displayListItemvalue = document.createElement("span");
      displayListItemvalue.setAttribute("class", "m-display-list-item-value");
      displayListItemvalue.textContent = data;
      if (prefix) {
        var displayListItemPrefix = document.createElement("span");
        displayListItemPrefix.setAttribute("class", "m-display-list-item-prefix");
        displayListItemPrefix.textContent = prefix;
        displayListItem.appendChild(displayListItemPrefix);
      };
      displayListItem.appendChild(displayListItemvalue);
      if (suffix) {
        var displayListItemSuffix = document.createElement("span");
        displayListItemSuffix.setAttribute("class", "m-display-list-item-suffix");
        displayListItemSuffix.textContent = prefix;
        displayListItem.appendChild(displayListItemSuffix);
      };
    } else {
      displayListItem = false;
    };
    return displayListItem;
  };

  function _get_all_modifier(all_displayPath, displayValueType) {
    var all_node = [];
    for (var i = 0; i < all_displayPath.length; i++) {
      var path = all_displayPath[i];
      all_node.push(_get_modifier(path, displayValueType));
    };
    return all_node;
  };

  function _get_modifier(path, displayValueType) {
    var displayItem;
    var data;
    var modifierPath = path.split(".");
    if (sheet.getCharacter()[modifierPath[0]][modifierPath[1]][modifierPath[2]].temp_modifier) {
      data = sheet.getCharacter()[modifierPath[0]][modifierPath[1]][modifierPath[2]].temp_modifier;
    } else {
      data = helper.getObject(sheet.getCharacter(), path);
    };
    if (typeof data != "undefined" && data != "") {
      displayItem = document.createElement("span");
      if (displayValueType) {
        if (displayValueType == "bonus" && data > 0) {
          data = "+" + data;
        };
      };
      displayItem.textContent = data;
    } else if (typeof data == "number" && data == 0) {
      displayItem = document.createElement("span");
      displayItem.textContent = data;
    } else {
      displayItem = false;
    };
    return displayItem;
  };

  function _get_all_stat(all_displayPath) {
    var all_node = [];
    for (var i = 0; i < all_displayPath.length; i++) {
      var path = all_displayPath[i];
      all_node.push(_get_stat(path));
    };
    return all_node;
  };

  function _get_stat(path) {
    var displayItem;
    var data;
    var statPath = path.split(".");
    if (sheet.getCharacter()[statPath[0]][statPath[1]][statPath[2]].temp_score) {
      data = sheet.getCharacter()[statPath[0]][statPath[1]][statPath[2]].temp_score
    } else {
      data = helper.getObject(sheet.getCharacter(), path);
    };
    if (typeof data != "undefined" && data != "") {
      displayItem = document.createElement("span");
      displayItem.textContent = data;
    } else if (typeof data == "number" && data == 0) {
      var displayItem = document.createElement("span");
      displayItem.textContent = data;
    } else {
      displayItem = false;
    };
    return displayItem;
  };

  function _get_all_textBlock(all_displayPath) {
    var all_node = [];
    for (var i = 0; i < all_displayPath.length; i++) {
      var path = all_displayPath[i];
      all_node.push(_get_textBlock(path));
    };
    return all_node;
  };

  function _get_textBlock(path, target) {
    var data = helper.getObject(sheet.getCharacter(), path);
    var displayItem;
    if (typeof data != "undefined" && data != "") {
      displayItem = document.createElement("span");
      displayItem.setAttribute("class", "m-display-item-text-block");
      var value = document.createElement("span");
      value.setAttribute("class", "m-display-item-text-block-value");
      value.innerHTML = data;
      displayItem.appendChild(value);
    } else {
      displayItem = false;
    };
    return displayItem;
  };

  function _get_all_textSnippet(all_displayPath, all_displayPrefix, all_displaySuffix, displayValueType) {
    var all_node = [];
    for (var i = 0; i < all_displayPath.length; i++) {
      var path = all_displayPath[i];
      var prefix = false;
      var suffix = false;
      var valueType = false;
      if (all_displayPrefix[i]) {
        prefix = all_displayPrefix[i];
      };
      if (all_displaySuffix[i]) {
        suffix = all_displaySuffix[i];
      };
      if (displayValueType[i]) {
        valueType = displayValueType[i];
      };
      all_node.push(_get_textSnippet(path, prefix, suffix, valueType));
    };
    // console.log("all_node", all_node);
    return all_node;
  };

  function _get_textSnippet(path, prefix, suffix, valueType) {
    var data = helper.getObject(sheet.getCharacter(), path);
    var displayItem;
    if (typeof data != "undefined" && data != "") {
      displayItem = document.createElement("span");
      displayItem.setAttribute("class", "m-display-item-text-snippet");
      var value = document.createElement("span");
      value.setAttribute("class", "m-display-item-text-snippet-value");
      if (valueType == "bonus" && data > 0) {
        data = "+" + data;
      } else if (valueType == "currency" && data > 0) {
        data = parseFloat(data).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      };
      value.innerHTML = data;
      if (prefix) {
        var spanPrefix = document.createElement("span");
        spanPrefix.setAttribute("class", "m-display-item-text-snippet-prefix");
        spanPrefix.textContent = prefix;
        displayItem.appendChild(spanPrefix);
      };
      displayItem.appendChild(value);
      if (suffix) {
        var spanSuffix = document.createElement("span");
        spanSuffix.setAttribute("class", "m-display-item-text-snippet-suffix");
        spanSuffix.textContent = suffix;
        displayItem.appendChild(spanSuffix);
      };
    } else {
      displayItem = false;
    };
    // console.log(path, displayItem);
    return displayItem;
  };

  function _render_displayBlock(section) {
    // find all display blocks
    var all_displayBlock;
    if (section) {
      all_displayBlock = section.querySelectorAll(".js-display-block");
    } else {
      all_displayBlock = helper.eA(".js-display-block");
    };
    // loop all display blocks
    for (var i = 0; i < all_displayBlock.length; i++) {
      // find all targets in this display blocks
      var all_displayBlockTarget = all_displayBlock[i].querySelectorAll(".js-display-block-target");
      // start a "no data found at path" count
      var dataNotFoundAtPath = 0;
      var totalNodeLength = 0;
      var all_node = [];

      // loop over each target in this display blocks
      for (var j = 0; j < all_displayBlockTarget.length; j++) {

        // get all data from display blocks target
        var target = all_displayBlockTarget[j];
        // var display = helper.getClosest(all_displayBlockTarget[j], ".js-display");
        var displayType = all_displayBlockTarget[j].dataset.displayType;
        var all_displayPath;
        var all_displayPrefix = false;
        var all_displaySuffix = false;
        var displayValueType = false;

        if (all_displayBlockTarget[j].dataset.displayPath) {
          all_displayPath = all_displayBlockTarget[j].dataset.displayPath.split(",");
        };
        if (all_displayBlockTarget[j].dataset.displayPrefix) {
          all_displayPrefix = all_displayBlockTarget[j].dataset.displayPrefix.split(",");
        };
        if (all_displayBlockTarget[j].dataset.displaySuffix) {
          all_displaySuffix = all_displayBlockTarget[j].dataset.displaySuffix.split(",");
        };
        if (all_displayBlockTarget[j].dataset.displayValueType) {
          displayValueType = all_displayBlockTarget[j].dataset.displayValueType.split(",");
        };

        // get an array of nodes using the array of paths
        if (displayType == "stat") {
          all_node = _get_all_stat(all_displayPath);
        } else if (displayType == "modifier") {
          all_node = _get_all_modifier(all_displayPath, displayValueType);
        } else if (displayType == "text-snippet") {
          all_node = _get_all_textSnippet(all_displayPath, all_displayPrefix, all_displaySuffix, displayValueType);
        } else if (displayType == "text-block") {
          all_node = _get_all_textBlock(all_displayPath);
        } else if (displayType == "list") {
          all_node = _get_all_list(all_displayPath, all_displayPrefix, all_displaySuffix, displayValueType);
        } else if (displayType == "clone") {
          all_node = _get_all_clone(all_displayPath);
        } else if (displayType == "skill") {
          all_node = _get_all_skill(all_displayPath, all_displayPrefix);
        } else if (displayType == "spell") {
          all_node = _get_all_spell(all_displayPath);
        };

        // function for later use to check the element from node array for false or data
        var _appendToTarget = function(element) {
          if (element != false) {
            // append to target
            target.appendChild(element);
          } else {
            // or increment the "no data found at path" count
            dataNotFoundAtPath++;
          };
        };

        // loop over each node in array and append to target
        all_node.forEach(_appendToTarget);
        totalNodeLength = totalNodeLength + all_node.length;
      };
      // if the "no data found at path" count == total "path count" this display blocks target is empty so add a data vale to reflect this
      if (totalNodeLength > dataNotFoundAtPath) {
        all_displayBlock[i].dataset.displayContent = true;
      } else {
        all_displayBlock[i].dataset.displayContent = false;
      };

    };

  };

  function _update_displayPlaceholder(section) {
    var all_display
    if (section) {
      all_display = [section];
    } else {
      all_display = helper.eA(".js-display");
    };
    for (var i = 0; i < all_display.length; i++) {
      var placeholderDisplay = all_display[i].querySelector(".js-placeholder-display");
      var all_displayBlock = all_display[i].querySelectorAll(".js-display-block");
      var contentFound = false;
      var lastActiveDisplayBlock;

      for (var j = 0; j < all_displayBlock.length; j++) {
        if (all_displayBlock[j].dataset.displayContent == "true") {
          lastActiveDisplayBlock = all_displayBlock[j];
          contentFound = true;
          helper.removeClass(all_displayBlock[j], "is-hidden");
        } else {
          helper.addClass(all_displayBlock[j], "is-hidden");
        };
      };
      for (var j = 0; j < all_displayBlock.length; j++) {
        helper.removeClass(all_displayBlock[j], "m-display-block-last");
      };
      if (lastActiveDisplayBlock) {
        helper.addClass(lastActiveDisplayBlock, "m-display-block-last");
      };
      if (contentFound) {
        helper.addClass(placeholderDisplay, "is-hidden")
      } else {
        helper.removeClass(placeholderDisplay, "is-hidden")
      };
    };
  };

  function render(section) {
    _render_displayBlock(section);
    _update_displayPlaceholder(section);
  };

  function _get_displayState(anyOrSingle) {
    var fab = helper.e(".js-fab");
    if (anyOrSingle == "all") {
      return (fab.dataset.displayModeAll == "true");
    } else if (anyOrSingle == "any" || !anyOrSingle) {
      return (fab.dataset.displayMode == "true");
    };
  };

  // exposed methods
  return {
    toggle: toggle,
    bind: bind,
    update: update,
    render: render,
    clear: clear,
    state: _get_displayState
  };

})();
