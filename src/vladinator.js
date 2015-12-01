define(['config', 'utils', 'regexlib'], function (Config, Utils, RegExLib) {
  var config = Config,
      _this;


  function Vladinator (options) {

    this.selector = options.el;
    this.el = null; //initial value
    //default to {} if options.elements is falsy
    this.elements = options.elements || {};
    this.elementStates = {};

    //callbacks for form state changes
    this.onFormValid = options.onFormValid || undefined;
    this.onFormInvalid = options.onFormInvalid || undefined;

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
      otherElement      = _this.el.querySelector('#' + rule.mustMatch);
      otherElementValue = Utils.getValue(otherElement);

      return (inputValue === otherElementValue);

    }

    regExp = getRegExp(rule);

    if (typeof regExp === 'undefined') {
      return false;
    }

    return regExp.test(inputValue);

  }

  function writeMessages ($elementID, arrMessages) {
    var tmpStr = '';

    arrMessages.forEach(function (msg) {
      tmpStr+= msg+'\n';
    });

    Utils.updatePlaceholder($elementID, tmpStr);

  }

  function updateUI ($element, arrMessages) {
    var state = $element.dataset.vstate;

    writeMessages(Utils.getID($element), arrMessages);

  }

  Vladinator.prototype = {
    initialize: function () {
      var id,
          ruleTest;

      _this.el = document.getElementById(this.selector);
      _this.el.addEventListener('input', this.handleEvent, true);
      _this.el.dataset.formState = false;

      //add error msg placeholders to each input element within el
      Utils.turnToArray(_this.el.querySelectorAll('input'))
        .forEach(function (input) {
          id = Utils.getID(input);

          //only initialize elements declared in intialization object
          if (_this.elements.hasOwnProperty(id)) {

            input.className += ' '+config.input_class;
            input.dataset.vstate = false;
            _this.elementStates[id] = false;
            Utils.buildErrPlaceholder(input);

            //if element has a mustMatch rule (element must match the value of element idetified by)
            //mustMatch value, set a property to target element to tell that it's a mustMatch target
            //so that a two-way binding can be established between elements
            ruleTest = _this.elements[id].filter(function (val){
              return val.hasOwnProperty('mustMatch');
            }).shift();

            if (typeof ruleTest !== 'undefined') {
              //console.log(ruleTest.mustMatch);
              document.getElementById(ruleTest.mustMatch).dataset.matchTarget = id;
            }
          }

        });

    },

    validate: function ($element) {
      var  rules,
           id = Utils.getID($element),
           inputValue,
           states = [],
           isValid,
           messages = [];

      //check if element is defined in lookup hash
      if (_this.elements.hasOwnProperty(id)) {
        rules = _this.elements[id];

        // Do nothing if there are no rules defined for the input element
        if (!Array.isArray(rules)) {
          console.log('No rules defined for this input element');
          return;
        }

        inputValue = Utils.getValue($element);

        rules.forEach(function (rule) {
          isValid = checkIfValid(inputValue, rule);
          states.push(isValid);
          $element.dataset.vstate = isValid;
          if (!isValid) {
            messages.push(rule.message);
          }
        });

        updateUI($element, messages);
        this.validateForm();

        if($element.dataset.hasOwnProperty('matchTarget')) {
          _this.validate(document.getElementById($element.dataset.matchTarget));
        }

      }

    },
    /**
      @function
      Evaluates the overall state of the form based on their individual vstates
    */
    validateForm: function () {
      var inputs = _this.el.getElementsByClassName(config.input_class);
      var states = Utils.turnToArray(inputs).map(function (input) {
        return input.dataset.vstate === 'false' ? false : true;
      });

      _this.formState = states.every(function (state) {
        return state;
      });

      _this.el.dataset.formState = _this.formState;

      if (_this.formState) {
        if (typeof _this.onFormValid === 'function') {
          _this.onFormValid.call(this);
        }
      } else {
        if (typeof _this.onFormInvalid === 'function') {
          _this.onFormInvalid.call(this);
        }
      }

    },

    handleEvent: function (event) {
      var $element;
      // Only process events from <input> elements
      if (event.srcElement.nodeName !== 'INPUT' || event.type !== 'input') {
        console.log('Invalid event');
        return;
      }

      // $element is the <input> element responsible for firing the input event
      $element = event.srcElement;
      _this.validate($element);

    },

    remove: function () {
      console.log(this);
      this.el.removeEventListener('input', this.handleEvent, true);
    }

  };

  return Vladinator;

});
