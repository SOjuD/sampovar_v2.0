window.onload = function(){


  var model = {
    getdata(url){
      return new Promise(function(resolve, reject){
  
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
  
        xhr.addEventListener('load', ()=>{ resolve(xhr.response) });
        xhr.addEventListener('error', ()=>{ reject(xhr.statusText) });
        xhr.send();
  
      });
    },
    buildSize(data){
      var dough = data.dough;
      var sizes = [];
  
      for(var i = 0; i < dough.length; i++){
       
       var flag = sizes.find((element)=>{
         if(element == dough[i].size)
         return element;
        })
        
        if(!flag){
          sizes.push(dough[i].size);
        }
      }
      view.displaySize(sizes);
    },
    buildDough(data){
      var dough = data.dough;
      var doughTypes = [];
  
      for(var i = 0; i < dough.length; i++){
       
       var flag = doughTypes.find((element)=>{
         if(element == dough[i].name)
         return element;
        })
        
        if(!flag){
          doughTypes.push(dough[i].name);
        }
      }
      view.displayDough(doughTypes);
    },
    buildBases(data){
      view.displayBases(data.base);
    },
    buildDips(data){
      var ingredients = data.ingredients;
      var dips = ingredients.filter(ingredient=>{
        return ingredient.category == 'Соусы';
      });
      view.displayDips(dips);
    },
    buildIngredients(data){
      var ingredients = data.ingredients;
      var ingredientsReady = ingredients.filter(ingredient=>{
        return ingredient.category == 'Мясные ингредиенты' || ingredient.category == 'Овощи и фрукты' || ingredient.category == 'Сыр';
      });
      view.displayIngredients(ingredientsReady);
    },
  };
  
  
  var view = {
    displayDate(){
      var date = new Date;
      var dateContainer = document.querySelector('.date');
      dateContainer.textContent = date.getDate()+'.'+date.getMonth()+'.'+date.getFullYear();
    },
    displaySize(sizes){
      var sizeCont = document.getElementById('step1');
      var sizeTemp = document.getElementById('select_size').content.querySelector('label');
      sizes.forEach(element => {
        var current = sizeTemp.cloneNode(true);
        var currentSpan = current.querySelector('span');
        var currentInput = current.querySelector('input');
        currentSpan.textContent = element;
        currentInput.value = element;
        sizeCont.append(current);
      });
    },
    displayDough(doughTypes){
      var doughCont = document.getElementById('step2');
      var doughTemp = document.getElementById('select_dough').content.querySelector('label');
      doughTypes.forEach(element => {
        var current = doughTemp.cloneNode(true);
        var currentSpan = current.querySelector('span');
        var currentInput = current.querySelector('input');
        currentSpan.textContent = element;
        currentInput.value = element;
        doughCont.append(current);
      });
    },
    displayBases(bases){
      var baseCont = document.getElementById('step3');
      var baseTemp = document.getElementById('select_base').content.querySelector('label');
      bases.forEach(element => {
        var current = baseTemp.cloneNode(true);
        var currentSpan = current.querySelector('span');
        var currentInput = current.querySelector('input');
        currentSpan.textContent = element;
        currentInput.value = element;
        baseCont.append(current);
      });
    },
    displayDips(dips){
      var dipCont = document.getElementById('dip');
      var dipTemp = document.getElementById('select_ingredients').content.querySelector('.ingredient_item');
      dips.forEach(element => {
        var current = dipTemp.cloneNode(true);
        var currentImg = current.querySelector('img');
        var currentPrice = current.querySelector('.price');
        var currentName = current.querySelector('.name');
  
        currentImg.setAttribute('src', element.icon);
        currentImg.setAttribute('alt', element.name);
        currentPrice.textContent = `${element.price} р.`;
        currentName.textContent = element.name;
  
        dipCont.append(current);
  
      });
    },
    displayIngredients(ingredients){
      var meatCont = document.getElementById('meat');
      var vegetableCont = document.getElementById('vegetable');
      var cheeseCont = document.getElementById('cheese');
      var ingredientsTemp = document.getElementById('select_ingredients').content.querySelector('.ingredient_item');
      ingredients.forEach(element => {
        var current = ingredientsTemp.cloneNode(true);
        var currentImg = current.querySelector('img');
        var currentPrice = current.querySelector('.price');
        var currentName = current.querySelector('.name');
  
        currentImg.setAttribute('src', element.icon);
        currentImg.setAttribute('alt', element.name);
        currentPrice.textContent = `${element.price} р.`;
        currentName.textContent = element.name;
  
  
        if(element.category == 'Мясные ингредиенты') meatCont.append(current);
        else if(element.category == 'Овощи и фрукты') vegetableCont.append(current);
        else if(element.category == 'Сыр') cheeseCont.append(current);
  
      });
    }
  };
  
  var controller = {};
  
  
  
  
  view.displayDate();
  
  model.getdata('../database.json').then(
    function(request){
      model.buildSize(request);
      model.buildDough(request);
      model.buildBases(request);
      model.buildIngredients(request);
      model.buildDips(request);

      jqueryFunctions();

    },
    function(err){console.log(err)}
  )



  function jqueryFunctions(){
    $('input[type=radio').change(function(){
      var name = $(this).attr('name');
      $('input[name='+ name +']').parent().removeClass('checked');
      if( $(this).prop('checked') )  $(this).parent().addClass('checked');
    });

    function drawActiveIngredientsGroup(){
      if( $('#step4 .ingredients_label').hasClass('active_label') ){
        var src = $('.active_label').find('img').data('active-src');
        var group = $('.active_label').data('group');
        $('#'+ group).css('display', 'flex');

        $('.active_label').find('img').attr('src', src);
      }
    }
    drawActiveIngredientsGroup();
    $('#step4 .ingredients_label').click(function(){
      var src = $('.active_label').find('img').data('src');
      $('.active_label').find('img').attr('src', src);
      $('.active_label').removeClass('active_label');
      $(this).addClass('active_label');
      $('#step4 .ingredients-wrap').css('display', 'none');
      drawActiveIngredientsGroup();
    });

  };
  
  }






  $(document).ready(function () {

    //----------------------------preloader----------------------------
    
    
    $('.preloader').delay(600).fadeOut('slow');
    
    //-------------------------mask Input-------------------------
    
    
      $('[name = "phone"]').mask("+375(99)999-99-99");
      $('.first-phone').mask("(99)999-99-99");
    
    
   
    
    }); 
 


