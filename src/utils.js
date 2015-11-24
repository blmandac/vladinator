define(['config'], function (Config) {

  function buildPlaceholder ($target) {
    $target.insertAdjacentHTML('afterend',
      '<div class="'+Config.placeholder_class+'" data-for="'+$target.id+'"></div>');
  }

  function updatePlaceholder ($target, errMessage) {
    var placeholder = document.querySelector('div[data-for="'+$target.id+'"]');
    placeholder.innerHTML = errMessage;
  }

  function getValue ($target) {
    return $target.value;
  }

  return {
    buildErrPlaceholder: function ($target) {
      buildPlaceholder($target);
    },
    getValue: function ($target) {
      return getValue($target);
    }
  };
});
