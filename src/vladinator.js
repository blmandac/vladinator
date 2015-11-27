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
  },
  _this;


  function Vladinator (options) {
    this.selector = options.el;
    this.el = null; //initial value
    //default to {} if options.elements is falsy
    this.elements = options.elements || {};

    //Describes the overall state of input fields in options.el
    this.formState = false; //default
    _this = this;
  }

  //static functions
  function getRegExp(rule) {

    if ( rule.hasOwnProperty('regex')) {
      // User-defined regex exists
      return rule.regex;
    }
    return regex[rule.type];
  }

  /**
   * 'rule' is a user-defined object that specifies the rules for a given input element. it can follow 2 forms:
   *    1. an object with properties 'type', 'message', and optionally 'regex'
   *    2. an object with properties 'mustMatch' and 'message'
   */
  function checkIfValid(inputValue, rule) {
    var otherElement,
        otherElementValue,
        regExp;

    if (rule.hasOwnProperty('mustMatch') && typeof rule.mustMatch === 'string') {
      // Check if value actually matches
      otherElement = _this.el.querySelector('#' + rule.mustMatch);
      otherElementValue = Utils.getValue(otherElement);

      return (inputValue === otherElementValue);

    }

    regExp = getRegExp(rule);

    if (typeof regExp === 'undefined') {
      return false;
    }

    return regExp.test(inputValue);
  }

  Vladinator.prototype = {
    initialize: function () {

      _this.el = document.getElementById(this.selector);
      _this.el.addEventListener('input', this.handleEvent, true);

      //add error msg placeholders to each input element within el
      Utils.turnToArray(_this.el.querySelectorAll('input'))
        .forEach(function (input) {
          console.log(input);
            Utils.buildErrPlaceholder(input);
        });


    },

    handleEvent: function (event) {
      console.log(event);
      var $element,
          rules,
          inputValue,
          isValid;

      // Only process events from <input> elements
      if (event.srcElement.nodeName !== 'INPUT' || event.type !== 'input') {
        console.log('Invalid event');
        return;
      }

      // $element is the <input> element responsible for firing the input event
      $element = event.srcElement;
      rules = _this.elements[Utils.getID($element)];

      // Do nothing if there are no rules defined for the input element
      if (!Array.isArray(rules)) {
        console.log('No rules defined for this input element');
        return;
      }

      inputValue = Utils.getValue($element);
      // Validate against all the rules
      rules.forEach(function (rule) {
        isValid = checkIfValid(inputValue, rule);
        if (isValid) {
          console.log('Valid!');
        }
        else {
          console.log('Invalid with message: ' + rule.message);
        }
      });

    },

    remove: function () {
      console.log(this);
      this.el.removeEventListener('input', this.handleEvent, true);
    }

  };

  return Vladinator;

});
