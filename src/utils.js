define(['config'], function (Config) {

  function buildPlaceholder ($target) {
    $target.insertAdjacentHTML('afterend',
      '<div class="'+Config.placeholder_class+'" data-for="'+$target.id+'"></div>');
  }

  function updatePlaceholder ($target, errMessage) {
    var placeholder = document.querySelector('div[data-for="'+$target.id+'"]');
    placeholder.innerHTML = errMessage;
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
