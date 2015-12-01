define(['vlad_config'], function (Config) {
  /**
    @param {HTMLInput Element} $target - input field

    Attaches div next to $target to hold validation error messages

  */
  function buildPlaceholder ($target) {
    console.log('building placeholder for ' + $target.id);
    $target.insertAdjacentHTML('afterend',
      '<div class="'+Config.placeholder_class+'" data-for="'+$target.id+'"></div>');
  }

  function updatePlaceholder ($target, errMessage) {
    var placeholder = document.querySelector('[data-for="'+$target+'"]');
    console.log($target);
    placeholder.innerHTML = errMessage;
  }

  function clearPlaceholder ($target) {
    var placeholder = document.querySelector('[data-for="'+$target+'"]');
    placeholder.innerHTML = '';
  }

  function getID($element) {
    return $element.id;
  }

  function getValue ($target) {
    return $target.value;
  }

  function turnToArray (nodeList) {
    return Array.prototype.slice.call(nodeList);
  }

  return {
    buildErrPlaceholder: function ($target) {
      buildPlaceholder($target);
    },
    updatePlaceholder: function ($target, errMessage) {
      updatePlaceholder($target, errMessage);
    },
    getValue: function ($target) {
      return getValue($target);
    },
    getID: function ($element) {
      return getID($element);
    },
    turnToArray: function (nodeList) {
      return turnToArray(nodeList);
    }
  };
});
