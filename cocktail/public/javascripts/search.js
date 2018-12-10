$(function(){

  var arg  = new Object;
  url = location.search.substring(1).split('&');

  for(i=0; url[i]; i++) {
      var k = url[i].split('=');
      arg[k[0]] = k[1];
  }

  var type = arg.type;
  if(type){
    $('#type').val(type);
    formControl(type);
  }

  $('select').change(function() {
 
    var type = $(this).val();
    formControl(type);
  });
});

function formControl(type){
  var types = ['3', '4'];

  if($.inArray(type, types) === -1){
    $('.type').prop('disabled', false);
  }else{
    $('.type').prop('disabled', true);
    $('.type').val('');
  }

  $('.type').submit(function(){
    $($(this)).cleanQuery();
  });
}
