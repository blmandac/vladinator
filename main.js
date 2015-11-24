require.config({
  baseUrl: 'src/'
});

define(['vladinator'], function (Vlad) {

  var vlad = new Vlad({
    el: 'form1'

  });

  vlad.initialize();

  document.getElementById('remove').addEventListener('click', function (event){
    console.log('Removing vladinator');
    vlad.remove();
  });


});
