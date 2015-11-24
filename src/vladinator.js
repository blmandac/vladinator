define(['config', 'utils'], function (Config, Utils) {
  var config = Config,
  regex = {
    date: /^([\d]|1[0,1,2])\/([0-9]|[0,1,2][0-9]|3[0,1])\/\d{4}$/,
    number: /^\d*[0-9](\.\d*[0-9])?$/,
    email: /(?:[a-z0-9!#$%&'*+\=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    postal: /^([A-Z][0-9]){3}$/,
    url: /^(http[s]?:\/\/|ftp:\/\/)?(www\.)?[a-zA-Z0-9-\.]+\.(com|org|net|mil|edu|ca|co.uk|com.au|gov)$/,
    phone: /^(([0-9]{1})*[- .(]*([0-9a-zA-Z]{3})*[- .)]*[0-9a-zA-Z]{3}[- .]*[0-9a-zA-Z]{4})+$/,
    empty: /^(?!\s*$)/,
    text: /^.*$/,
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    smartmoney: /^(557751|529967)[0-9]{10}$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    lettersonly: /^[a-zA-Z ]+$/,
    password: /(([A-Z]+)|[0-9])/ //change this.
  };


  function Vladinator (options) {
    this.selector = options.el;
    this.el = null; //initial value
    //default to {} if options.elements is falsy
    this.elements = options.elements || {};

    //Describes the overall state of input fields in options.el
    this.formState = false; //default

  }


  Vladinator.prototype = {
    initialize: function () {

      this.el = document.getElementById(this.selector);
      this.el.addEventListener('input', this.handleEvent.bind(this), true);

      //add error msg placeholders to each input element within el
      Utils.turnToArray(this.el.querySelectorAll('input'))
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
      if (event.srcElement.nodeName === 'INPUT' && event.type === 'input') {
        //process event
        //from event, get the <input> element responsible for firing the input
        //event
        $element = event.srcElement;
        console.log('Event fired by ' + Utils.getID($element));
        console.log(Utils.getValue($element));

        //perform validation here
        //using Utils.getID(), perform lookup on this.elements for validation
        //rules to be checked

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
