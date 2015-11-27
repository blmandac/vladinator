define([], function () {
  var   regex = {
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

    function getRule(type) {
      if ( regex.hasOwnProperty(type) ) {
        return regex[type];
      } else {
        return null;
      }
    }

    function setRule (type, regex) {
      regex[type] = regex;
    }

    return {
      getRule: getRule,
      setRule: setRule
    };

});
