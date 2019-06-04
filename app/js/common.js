$(document).ready(function () {

//----------------------------preloader----------------------------


$('.preloader').delay(600).fadeOut('slow');


//-------------------------mask Input-------------------------


  $('[name = "phone"]').mask("+375(99)999-99-99");
  $('.first-phone').mask("(99)999-99-99");


});  


window.onload = function(){

var model = {
  getdata: function(url){
    return new Promise(function(resolve, reject){

      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.responseType = 'json';

      xhr.addEventListener('load', function(){ resolve(xhr.response) });
      xhr.addEventListener('error', function(){ reject(xhr.statusText) });
      xhr.send();

    });
  },
};


var view = {};

var controller = {};

model.getdata('../database.json').then(
  function(request){console.log(request)},
  function(err){console.log(err)}
)

}