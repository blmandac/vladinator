define(['config', 'utils', 'regexlib'], function (Config, Utils, RegExLib) {
  var config = Config,
      _this;


  function Vladinator (options) {
    this.selector = options.el;
    this.el = null; //initial value
    //default to {} if options.elements is falsy
    this.elements = options.elements || {};
    this.elementStates = {};

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
    return RegExLib.getRule(rule.type);

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
