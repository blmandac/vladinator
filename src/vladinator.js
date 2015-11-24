define(['config', 'utils'], function (Config, Utils) {
  var config = Config;

  function Vladinator (options) {
    this.selector = options.el;
    this.el = null;

    this.elements = {};

    this.formState = false; //default


  }


  Vladinator.prototype = {
    initialize: function () {

      this.el = document.getElementById(this.selector);
      this.el.addEventListener('input', this.handleEvent.bind(this), true);

      //add error msg placeholders to each input element within el
      Array.prototype.slice.call(this.el.querySelectorAll('input'))
        .forEach(function (input) {
          console.log(input);
            Utils.buildErrPlaceholder(input);
        });


    },

    handleEvent: function (event) {
      console.log(event);
      var $element;
      /*
        Only process events from <input> elements
      */
      if (event.srcElement.nodeName === 'INPUT') {
        //process event
        console.log('Valid event');
        $element = event.srcElement;
        console.log(Utils.getValue($element));

      } else {
        console.log('Invalid event');
        return;
      }
    },

    remove: function () {
      console.log(this);
      this.el.removeEventListener('input', this.handleEvent.bind(this), true);
    }


  };

  return Vladinator;

});
