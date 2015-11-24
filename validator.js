var Validator = (function () {
  "use strict";

  var regex,
    def_className,
    collections;
  collections = {};
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

  def_className = 'validator';

  function getSelectorType($selector) {

    if ($selector) {
      if ((typeof $selector === 'object')) {
        //check if DOM object
        if ($selector.nodeName) {
          return $selector;
        } else {
          return null;
        }

      }

      if ((typeof $selector === 'string')) {

        return document.querySelectorAll($selector)[0];

      }
    } else {
      return null;
    }
  }

  function createErrorField($selector) {
    var err_target = document.createElement('div');
    err_target.className = 'validator-error';

    $selector.parentNode.insertBefore(err_target, $selector.nextSibling);

    return err_target;
  }

  function updateErrorField($selector, strMessage) {

    $selector.innerText = strMessage;

    return null;
  }

  function buildMessage(boolFlag, strMessage) {
    return {
      state: boolFlag,
      msg: strMessage
    };
  }

  function setElementErrorClass(boolFlag, $target, strErrClass) {
    /*
      @boolean boolFlag
      @DOM Element $target
      @string strErrClass
    */
    if (!boolFlag) {
      if ($target.className.indexOf(strErrClass) < 0) {
        $target.className += ' ' + strErrClass;
      }

    } else {
      if ($target.className.indexOf(strErrClass) > 0) {
        $target.className = $target.className.replace(strErrClass, '').trim();
      }
    }

    return $target;

  }

  function regexCheck(strVal, strType) {

    return regex[strType].test(strVal);

  }

  function userRegexCheck(strVal, strRegex) {

    return strRegex.test(strVal);

  }

  function evalRules(arrRules, strVal) {
    /*
      Evaluates a string value (strVal) against a set of rules (arrRules)
      see <function ValidatorField> for more information.

      PARAMETERS:

        @array arrRules:
            Array of objects containing rules for validation. Each object must,
            at the minimum, the structure below:
              { type: @string,
                msg: @string
              }
            where <type> is the validation type that can be found in
            Validator.regex and <msg> is the error message to be displayed if
            the rule fails the value passed.

            Custom rules can be used too but only with the ff. rule structure:
              {
                type: @string,
                msg: @string,
                regex: @JSRegEx
              }
            <regex> is required else, validation will return false w/ an error.
        @string strVal:
          Value to be tested.

      RETURN:
        @object buildMessage()
          Refer to <function buildMessage>


    */
    var len,
      rule,
      ret,
      msg;

    if (arrRules && arrRules.length) {
      len = arrRules.length;
      ret = true;
      //go to each rule, break the loop once the value is evaluated as invalid
      while (len--) {
        rule = arrRules[len];
        if (rule && rule.type && rule.msg) {
          if (regex[rule.type]) { //evaluate if type is in the regex library
            //testing is still needed on how to correctly apply rules.notStrict
            //rules.notStrict indicates if a rule should be applied to the overall
            //state as a logical OR. Indicating notStrict = true is like saying
            //that the said rule is a hard requirement for validation.

            //Personal comment: I don't know if I'm doing this right.
            if (rule.notStrict) {
              ret = regexCheck(strVal, rule.type) || true;
            } else {
              ret = regexCheck(strVal, rule.type) && true;
            }

          } else {
            if (rule.regex) { //if rule is not in regex lib, evaluate if cust regex is included

              ret = userRegexCheck(strVal, rule.regex);

            } else {

              return buildMessage(false, 'Rule type ' + rule.type + ' is not supported.');

            }
          }

          if (ret) {
            msg = ''; //if valid, clear message. Continue in loop.
          } else {
            //if input field value is invalid vs rule, get error message
            //and exit loop immediately.
            msg = rule.msg;
            return buildMessage(ret, msg);

          }

        } else {
          return buildMessage(false, 'ERROR: Invalid rule format. Please check your rules declaration.');
        }
      }
      //if this return statement is reached, it means that there are no errors;
      return buildMessage(ret, msg);

    } else {
      //No ruleset was defined. Return true anyway.
      return buildMessage(true, '');
    }

  }

  /*
      #VALIDATORFIELD
  */

  function ValidatorField(objSettings) {
    /*
      ValidatorField constructor
      Params:
        @object: objectSettings
          - Javascript object containing ValidatorField
        options. Options described below:

          @string/DOM object   : element
            DEFAULT: n/a
            Selector string or HTMLInput Object of the input field to be
            validated.
          @boolean             : isRequired
            DEFAULT: TRUE
            Flags the element if it is required. Used to add .required class
            to element. Defaults to TRUE.
          @array               : rules
            Array of objects containing rules for validation. Each object must,
            at the minimum, the structure below:
              { type: @string,
                msg: @string
              }
            where <type> is the validation type that can be found in
            Validator.regex and <msg> is the error message to be displayed if
            the rule fails the value passed.

            Custom rules can be used too but only with the ff. rule structure:
              {
                type: @string,
                msg: @string,
                regex: @JSRegEx
              }
            <regex> is required else, validation will return false w/ an error.

          @object              : compare
            DEFAULT: undefined
          @string              : errorClass
            DEFAULT: 'validator-input--error'
            Class given to fields w/ validation error.
          @string              : className
            DEFAULT: undefined
            Custom class name to enable custom styling.
          @ValidatorCollection : parent
            DEFAULT: n/a
            Object reference to parent ValidatorCollection.
            This option is REQUIRED
          @boolean             : onInput
            DEFAULT: TRUE
            Indicator if input field will use internal event listener for changes;
    */
    var settings = {};

    settings.elemSelector = objSettings.element;
    settings.isRequired = objSettings.isRequired;
    settings.rules = objSettings.rules;
    settings.compare = objSettings.compare;
    settings.errorClass = objSettings.errorClass;
    settings.className = objSettings.className;
    settings.parent = objSettings.parent;
    settings.onInput = objSettings.onInput;

    this.settings = settings;

    return this;
  }

  ValidatorField.prototype = {
    init: function () {
      var settings = this.settings;
      var context = this;

      this.element = getSelectorType(settings.elemSelector);
      this.element.className += ' ' + def_className;
      this.error_target = createErrorField(this.element);
      this.state = false;
      this.validationState = false;
      this.errorDelay = 600;

      if (this.settings.compare) {

        if (!this.settings.compare.msg) {
          return buildMessage(false, 'WARNING: No error message for compare was defined.');
        }

        this.compareTo = getSelectorType(settings.compare.selector);
      }


      if (this.settings.className) { //add user-defined class if supplied

        this.element.className += ' ' + settings.className;
      }

      if (!(this.settings.errorClass)) {
        this.settings.errorClass = 'validator-input--error';
      }

      if (typeof this.settings.isRequired !== 'undefined') {

        if (this.settings.isRequired) {
          this.element.className += ' ' + 'required';
        }

      } else {
        this.settings.isRequired = true; //set field as required by default;
      }

      if (typeof this.settings.onInput === 'undefined') {
        this.settings.onInput = true; //default to true if not explicitly defined
      }

      if (this.settings.onInput) {
        this.element.addEventListener('input', function () {
          context.evaluate();
          settings.parent.updateState(); //notify the parent collection to update state
        });
      }

      return this;
    },

    getElement: function () {
      return this.element;
    },

    getErrorTarget: function () {
      return this.error_target;
    },

    getElementValue: function () {
      return this.element.value;
    },

    getValidationState: function () {
      return this.validationState;
    },

    evaluate: function (quiet) {
      /*
        Evaluates the value held within this ValidatorField's element.
      */
      var result,
        msg;

      result = evalRules(this.settings.rules, this.getElementValue());
      if (!result.state) {
        //execute error handler if format validation fails.
        msg = result.msg;

      } else {

        msg = ''; //clear error message

      }
      /*
        Compare the value of this element to the element defined in
        settings.compare. This will override format validation.
      */
      if (this.compareTo) {
        this.validationState = (this.getElementValue() === this.compareTo.value) && result.state;

        if (!this.validationState) {

          msg = this.settings.compare.msg;
          result.msg = msg;
        }

      } else {

        this.validationState = result.state;

        console.log('VALIDATOR::VALIDATORFIELD::EVALUATE:' + this.element.id + '\'s state is ' + this.validationState);

      }
      /*
        Included a delay before visual feedback is triggered.
        Just so the validation doesn't appear too strict by saying the user is
        wrong ASAP.
      */
      if (!quiet) {
        setTimeout(function () {
          setElementErrorClass(this.validationState, this.element, this.settings.errorClass);
          updateErrorField(this.error_target, result.msg);
        }.bind(this), this.errorDelay);
      }

      return result.state;

    }
  };

  /*

    #VALIDATORCOLLECTION

  */

  function ValidatorCollection(strName) {
    this.name = strName;
    this.collection = [];
    this.state = false;

    return this;
  }

  ValidatorCollection.prototype = {
    add: function (objField) {
      var field,
        index;

      if (objField) {

        field = new ValidatorField(objField);

        this.collection.push(field);

      } else {
        return null;
      }

      return this;

    },

    addInit: function (objField) {
      var field,
        index;

      if (objField) {
        field = new ValidatorField(objField).init();

        this.collection.push(field);
        index = this.collection.indexOf(field);
        field.settings.index = index;


      } else {
        return null;
      }

      return this;
    },
    initAll: function () {
      var len = this.collection.length;

      while (len--) {
        this.collection[len].init();
      }

      return this;

    },

    remove: function (strID) {
      var el,
        len = this.collection.length;

      while (len--) {
        el = this.collection[len].getElement();
        if (el.getAttribute('id') === strID) {
          break;
        }
      }
      if (len > -1) {
        el.className = el.className.replace(def_className, '').trim();

        this.collection.splice(len, 1);
      }
      return this;
    },

    get: function (index) {
      if (index) {
        return this.collection[index];
      } else {
        return null;
      }
    },

    getElementByID: function (strID) {
      var el,
        len = this.collection.length;
      while (len--) {
        el = this.collection[len];
        if (el.getElement().getAttribute('id') === strID) {
          break;
        }
      }

      if (len > -1) {
        return el;
      } else {
        return null;
      }

    },

    getAll: function () {
      return this.collection;
    },

    getCurrentState: function () {
      return this.state;
    },

    updateCollection: function (quiet) {
      var el,
        len,
        c;
        
      console.log('Updating the ff items');
      console.log(this.collection);
      len = this.collection.length;

      for (c = 0; c < len; c++) {
        this.collection[c];
        this.collection[c].evaluate(quiet);
      }

    },

    updateState: function () {
      var el,
        len;

      len = this.collection.length;
      this.state = true;
      while (len--) {
        this.state = this.state && this.collection[len].getValidationState();
      }

      if (this.onUpdate && typeof this.onUpdate === 'function') {
        this.onUpdate();
      }

      return this.state;

    },

    onUpdate: function (callback) {

      if (typeof callback === 'function') {
        this.onUpdate = callback
      }

    }
  };

  /*PUBLIC FUNCTIONS*/

  function newValidatorCollection(strName) {

    var collection = new ValidatorCollection(strName);

    collections[strName] = collection;

    return collection;

  }

  function addRegEx(strName, strExpr) {
    regex[strName] = strExpr;

    return regex;
  }

  return {

    newCollection: newValidatorCollection,
    regex: regex,
    addRegEx: addRegEx,
    validate: regexCheck,
    collections: collections

  };

})();
