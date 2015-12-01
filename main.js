require.config({
  baseUrl: 'src/'
});

define(['vladinator'], function (Vlad) {

  var vlad = new Vlad({
    el: 'form1',
    onUpdate: function () {
      console.log('State updated.');
    },
    elements: {
      phoneNumber: [
        {
          type: 'phone',
          message: 'Enter a valid phone number'
        }
      ],
      email1: [
        {
          type: 'email',
          message: 'Enter a valid email address'
        }
      ],
      email2: [
        {
          type: 'email',
          message: 'Enter a valid email address'
        },
        {
          // Listener gets added only to 'email2' and not to 'email1' for this rule
          mustMatch: 'email1',
          message: 'Must match the other email address field'
        }
      ],
      cellphone: [
        {
          type: 'philippinePhoneNumber',
          message: 'Enter a valid Philippine cellphone number',
          regex: /((\+63)|0)\d{10}/
        }
      ],
    }

  });

  vlad.initialize();

  document.getElementById('remove').addEventListener('click', function (event){
    console.log('Removing vladinator');
    vlad.remove();
  });


});
