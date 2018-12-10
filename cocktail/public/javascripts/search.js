$(function(){
    var arg  = new Object;
    url = location.search.substring(1).split('&');

    for(i=0; url[i]; i++) {
        var k = url[i].split('=');
        arg[k[0]] = k[1];
    }

    var type = arg.type;
    console.log(type);
    if(type){
        $('#type').val(type);
    }
});
