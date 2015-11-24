require.config({
  baseUrl: 'src/'
});

define(['vladinator'], function (Vlad) {

  var vlad = new Vlad({
    el: 'form1',
    elements: {
      phoneNumber: [
        {type: 'phone', message: 'Enter a valid phone number'}
      ],
      email: [
        {type: 'email', message: 'Enter a valid email address'}
      ]
    }

  });

  vlad.initialize();

  document.getElementById('remove').addEventListener('click', function (event){
    console.log('Removing vladinator');
    vlad.remove();
  });


});
