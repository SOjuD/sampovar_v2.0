window.onload = function () {


  var model = {
    getdata(url) {
      return new Promise(function (resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';

        xhr.addEventListener('load', () => {
          resolve(xhr.response)
        });
        xhr.addEventListener('error', () => {
          reject(xhr.statusText)
        });
        xhr.send();

      });
    },
    buildSize(data) {
      var dough = data.dough;
      var sizes = [];

      for (var i = 0; i < dough.length; i++) {

        var flag = sizes.find((element) => {
          if (element == dough[i].size)
            return element;
        })

        if (!flag) {
          sizes.push(dough[i].size);
        }
      }
      view.displaySize(sizes);
    },
    buildDough(data) {
      var dough = data.dough;
      var doughTypes = [];

      for (var i = 0; i < dough.length; i++) {

        var flag = doughTypes.find((element) => {
          if (element == dough[i].name)
            return element;
        })

        if (!flag) {
          doughTypes.push(dough[i].name);
        }
      }
      view.displayDough(doughTypes);
    },
    buildBases(data) {
      view.displayBases(data.base);
    },
    buildDips(data) {
      var ingredients = data.ingredients;
      var dips = ingredients.filter(ingredient => {
        return ingredient.category == 'Соусы';
      });
      view.displayDips(dips);
    },
    buildIngredients(data) {
      var ingredients = data.ingredients;
      var ingredientsReady = ingredients.filter(ingredient => {
        return ingredient.category == 'Мясные ингредиенты' || ingredient.category == 'Овощи и фрукты' || ingredient.category == 'Сыр';
      });
      view.displayIngredients(ingredientsReady);
    },
  };


  var view = {
    displayDate() {
      var date = new Date;
      var dateContainer = document.querySelector('.date');
      dateContainer.textContent = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    },
    displaySize(sizes) {
      var sizeCont = document.querySelector('#step1 .step_wrap');
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
    displayDough(doughTypes) {
      var doughCont = document.querySelector('#step2 .step_wrap');
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
    displayBases(bases) {
      var baseCont = document.querySelector('#step3 .step_wrap');
      var baseTemp = document.getElementById('select_base').content.querySelector('label');
      bases.forEach(element => {
        var current = baseTemp.cloneNode(true);
        var currentSpan = current.querySelector('span');
        var currentInput = current.querySelector('input');
        currentSpan.textContent = element.name;
        currentInput.value = element.name;
        baseCont.append(current);
      });
    },
    displayDips(dips) {
      var dipCont = document.getElementById('dip');
      var dipTemp = document.getElementById('select_ingredients').content.querySelector('.ingredient_item');
      dips.forEach(element => {
        var current = dipTemp.cloneNode(true);
        var currentImg = current.querySelector('img');
        var currentPrice = current.querySelector('.price');
        var currentName = current.querySelector('.name');


        function buildWeight(elem){
          if( Array.isArray(elem.weight) ){
            return elem.weight.join(', ')
          }
        }
        function buildImgs(elem){
          if( Array.isArray(elem.imgs) ){
            return elem.imgs.join(', ')
          }
        }
        
        current.dataset.imgs = buildImgs(element);

        current.dataset.weight = buildWeight(element);
        current.dataset.price = element.price || 0;


        currentImg.setAttribute('src', element.icon);
        currentImg.setAttribute('alt', element.name);
        currentPrice.textContent = `${element.price} р.`;
        currentName.textContent = element.name;

        dipCont.append(current);

      });
    },
    displayIngredients(ingredients) {
      var meatCont = document.getElementById('meat');
      var vegetableCont = document.getElementById('vegetable');
      var cheeseCont = document.getElementById('cheese');
      var ingredientsTemp = document.getElementById('select_ingredients').content.querySelector('.ingredient_item');
      ingredients.forEach(element => {
        var current = ingredientsTemp.cloneNode(true);
        var currentImg = current.querySelector('img');
        var currentPrice = current.querySelector('.price');
        var currentName = current.querySelector('.name');

        current.dataset.max = element.maximum || 1;
        current.dataset.price = element.price || 0;



        function buildWeight(elem){
          if( Array.isArray(elem.weight) ){
            return elem.weight.join(', ')
          }
        }
        function buildImgs(elem){
          if( Array.isArray(elem.imgs) ){
            return elem.imgs.join(', ')
          }
        }
        
        current.dataset.imgs = buildImgs(element);
        current.dataset.weight = buildWeight(element);


        currentImg.setAttribute('src', element.icon);
        currentImg.setAttribute('alt', element.name);
        currentPrice.textContent = `${element.price} р.`;
        currentName.textContent = element.name;


        if (element.category == 'Мясные ингредиенты') meatCont.append(current);
        else if (element.category == 'Овощи и фрукты') vegetableCont.append(current);
        else if (element.category == 'Сыр') cheeseCont.append(current);

      });
    },
    viewCountIngredient(that, ingredient, currentPizza) {


      if(that && ingredient){
        var countCont = that.closest('.control').getElementsByClassName('current_count')[0];
        countCont.textContent = ingredient.count || 0;
      }else{

        var ingredientsNode = document.querySelectorAll('.ingredient_item');


        for(elemNode of ingredientsNode){

          var name = elemNode.querySelector('.name').textContent;
          if( Array.isArray(currentPizza.ingredients) ){
            for(elem of currentPizza.ingredients){
              if(elem.name == name){
                elemNode.querySelector('.current_count').textContent = elem.count;
                continue;
              }
            };
          }
         
        
        }


      }


    },
    viewCheckList(currentPizza) {
      var listTemp = document.querySelector('#paycheckLi').content.querySelector('li');
      var listCont = document.getElementById('paycheckContainer');
      var priceCont = document.querySelector('.price-container');
      var weightCont = document.querySelector('.weight-container');
      var ingredients = currentPizza.ingredients;

      listCont.textContent = '';

      priceCont.textContent = currentPizza.totalPrice || currentPizza.basePrice || 0;
      weightCont.textContent = currentPizza.totalWeight || currentPizza.baseWeight || 0;

      if(currentPizza.size){
        var size = listTemp.cloneNode(true);
        size.querySelector('.product-name').textContent = currentPizza.size.name;
        size.querySelector('.product-price').remove();
        size.querySelector('.product-count').remove();
        size.querySelector('.product-remove').remove();
        listCont.appendChild(size);
  
      }
      if(currentPizza.dough){
        var dough = listTemp.cloneNode(true);
        dough.querySelector('.product-name').textContent = currentPizza.dough.name;
        dough.querySelector('.product-price').remove();
        dough.querySelector('.product-count').remove();
        dough.querySelector('.product-remove').remove();
        listCont.appendChild(dough);
  
      }
      if(currentPizza.base){
        var base = listTemp.cloneNode(true);
        base.querySelector('.product-name').textContent = currentPizza.base.name;
        base.querySelector('.product-price').remove();
        base.querySelector('.product-count').remove();
        base.querySelector('.product-remove').remove();
        listCont.appendChild(base);
  
      }

      
      for(item in ingredients){
        var current = listTemp.cloneNode(true);
        current.querySelector('.product-name').textContent = ingredients[item].name;
        current.querySelector('.product-price span').textContent = ingredients[item].totalPrice;
        current.querySelector('.product-count').textContent = ingredients[item].count;
        listCont.appendChild(current);
      }
    },
    viewBase(){
      var currentPizza = controller.loadPizza();
      var container = document.querySelector('.pizza-img');
      var doughImg;
      var baseImg;

      for(img of container.childNodes){
        if(img.alt.indexOf('тесто') >= 0){
          doughImg = img;
          continue;
        }else if(img.alt.indexOf('основа') >= 0){
          baseImg = img;
          continue;
        }
      }
      if(doughImg && currentPizza.hasOwnProperty('dough')){
        doughImg.src = currentPizza.dough.img;
        doughImg.alt = currentPizza.dough.name;
      }else if( currentPizza.hasOwnProperty('dough') ){
          doughImg = document.createElement('img');
          doughImg.src = currentPizza.dough.img;
          doughImg.alt = currentPizza.dough.name;
          doughImg.style.zIndex = 1;
          container.appendChild(doughImg);
      }
        
      if(baseImg && currentPizza.hasOwnProperty('base')){
        baseImg.src = currentPizza.base.img;
        baseImg.alt = currentPizza.base.name;
      }else if( currentPizza.hasOwnProperty('base') ){
          baseImg = document.createElement('img');
          baseImg.src = currentPizza.base.img;
          baseImg.alt = currentPizza.base.name;
          baseImg.style.zIndex = 2;
          container.appendChild(baseImg);
      }
    },
    viewIngredients(){
      var currentPizza = controller.loadPizza();

      if( currentPizza.hasOwnProperty('ingredients') ){
        var ingredients = currentPizza.ingredients;
        var container = document.querySelector('.pizza-img');
        
        ingredients.forEach((ingredient, index)=>{
          var zindex = index + 3;
          var imgPath = ingredient.imgs;
          var imgName = ingredient.name;
          var trigger = true;

          [].forEach.call(container.childNodes, (image)=>{
            if(image.alt == imgName){
              if(image.src == imgPath){
              }else{
                image.src = imgPath;
              }
              trigger = false;
              
            }
          })

          if(trigger){
            var img  = document.createElement('img');
            img.src = imgPath;
            img.alt = imgName;
            img.style.zIndex = zindex;
            container.appendChild(img);
          }
        });

      }

    },
    hiddenIngredients(name){
      var container = document.querySelector('.pizza-img');
      var ingredientList = container.childNodes;
      if(name){
        for(img of ingredientList){
          if(img.alt == name){
            img.remove();
          }
        }
      }else{
        while(ingredientList.length > 1){
          container.removeChild(container.lastChild);
        }
      }
    },
    viewCartListLength(){
      var total = document.getElementById('total');
      total.textContent = controller.getCartListLength();
    },
  };

  var controller = {
    loadPizza(){
      var currentPizza = JSON.parse(window.localStorage.currentPizza);
      return currentPizza;
    },
    uploadPizza(currentPizza){
      currentPizza = JSON.stringify(currentPizza);
      window.localStorage.currentPizza = currentPizza;
    },
    loadCartList(){
      if(window.localStorage.hasOwnProperty('cartList')){
        var cartList = JSON.parse(window.localStorage.cartList);
        return cartList;
      }
    },
    getCartListLength(){
      var cartList = controller.loadCartList();
      if(cartList){
        controller.appendLink();
        return cartList.length;
      }else 
      return 0;
    },
    uploadCartList(cartList){
      cartList = JSON.stringify(cartList);
      window.localStorage.cartList = cartList;
    },
    preparationElems(request) {
      model.buildSize(request);
      model.buildDough(request);
      model.buildBases(request);
      model.buildIngredients(request);
      model.buildDips(request);
      controller.createOrLoadCurrentPizza();
    },
    createOrLoadCurrentPizza() {


      if (!window.localStorage.currentPizza) {
        controller.restartPizza();
      } else { // прорисовываем выбранные параметры пиццы


        var currentPizza = controller.loadPizza();
        for (key in currentPizza) {
          var param = document.getElementsByName(key);
          param.forEach((elem) => {
            if (elem.value == currentPizza[key].name) {
              elem.parentElement.classList.add('checked');
            }
          });
        };

        view.viewBase();
        view.viewIngredients();
        view.viewCheckList(currentPizza);
        view.viewCountIngredient(false, false, currentPizza)
      }
    },
    selectParams(e, request) {

      var currentPizza = controller.loadPizza();
      var paramName = e.target.name;
      var paramVal = e.target.value;
      var dough = request.dough;
      
      
      var param = currentPizza[paramName] = {};
      param.type = paramName;
      param.name = paramVal;



      if(paramName == 'base'){
        for(base of request[paramName]){
          if(base.name == paramVal){
            param.img = base.img || '';
          }
        }
      }else{
        if( currentPizza.hasOwnProperty('dough') ){
          for (item of dough) {
            param.img = item.img || '';
            if (currentPizza.hasOwnProperty('size') && item.name == currentPizza.dough.name && item.size == currentPizza.size.name) {
              currentPizza.basePrice = item.price;
              currentPizza.baseWeight = item.weight;
              controller.calcWeight(currentPizza);
            }
          }
        }
        
      }

      
      view.viewCheckList(currentPizza);
      controller.uploadPizza(currentPizza);
      
      view.viewBase();

    },
    removeIngredient(ingredient, imgs, currentPizzaIngredients, ingredientPos, removeElem){
      if( ingredient && imgs && currentPizzaIngredients && ingredientPos){
        if (ingredient.count > 0) {
          ingredient.count -= 1;
          ingredient.totalPrice = +((ingredient.price * ingredient.count).toFixed(1));
          ingredient.totalWeight = +ingredient.weight[ingredient.count-1];
          ingredient.imgs = imgs[ingredient.count-1];
        } 
        if(ingredient.count == 0) {
          view.hiddenIngredients(ingredient.name);
          currentPizzaIngredients.splice(ingredientPos, 1);
        }
      }else{
        var currentPizza = controller.loadPizza();
        var name = removeElem.textContent;
        var ingredientList = document.querySelectorAll('.ingredient_item');

        if(currentPizza.hasOwnProperty('ingredients')){
          currentPizza.ingredients.forEach((elem, index)=>{
            if(elem.name == name){
              currentPizza.ingredients.splice(index, 1);
              controller.calcPrice(currentPizza);
              controller.calcWeight(currentPizza);
              view.hiddenIngredients(name);
              view.viewCheckList(currentPizza);
            }
          });

          for(ingredient of ingredientList){
            if(ingredient.querySelector('.name').textContent == name){
              ingredient.querySelector('.current_count').textContent = 0
              break;
            }
          }
        }

        controller.uploadPizza(currentPizza);
      }
    },
    addIngredient(e) {
      var currentPizza = controller.loadPizza();
      var currentPizzaIngredients = currentPizza.ingredients || [];
      var that = e.target;
      var ingredient = that.closest('.ingredient_item');
      var ingredientName = ingredient.querySelector('.name').textContent;
      var max = ingredient.dataset.max || 1;
      var price = ingredient.dataset.price || 0;
      var weight = ingredient.dataset.weight || '';
          weight = weight.split(', ');
      var imgs = ingredient.dataset.imgs || '';
          imgs = imgs.split(', ');
      function findIngredient() {
        for (ingredient in currentPizzaIngredients) {
          
          if (currentPizzaIngredients[ingredient].name == ingredientName) {
            var coincidence = {};
            coincidence.pos = ingredient;
            coincidence.val = currentPizzaIngredients[ingredient]
            
            return coincidence;
          }
        };
      };
      var coincidence = findIngredient();
      if (coincidence) {
        var ingredient = coincidence.val;
        var ingredientPos = coincidence.pos;
        if (e.target.classList.contains('add')) {
          if (ingredient.count < ingredient.max) {
            ingredient.count += 1;
            ingredient.totalPrice = +((ingredient.price * ingredient.count).toFixed(1));
            ingredient.totalWeight = +ingredient.weight[ingredient.count-1];
            ingredient.imgs = imgs[ingredient.count-1];
          } else {
            alert('Извините, это мамсимум для данного ингредиента!');
          }
        } else if (e.target.classList.contains('remove')) {
          controller.removeIngredient(ingredient, imgs, currentPizzaIngredients, ingredientPos);
        }

      } else {
        if (e.target.classList.contains('add')) {
          var ingredient = {};
          ingredient.name = ingredientName;
          ingredient.max = max;
          ingredient.price = price;
          ingredient.weight = weight;
          ingredient.count = 1;
          ingredient.totalPrice = +((ingredient.price * ingredient.count).toFixed(1));
          ingredient.totalWeight = +ingredient.weight[ingredient.count-1];
          ingredient.imgs = imgs[ingredient.count-1];
          currentPizzaIngredients.push(ingredient);
        }
      }
      
      view.viewCountIngredient(that, ingredient);

      currentPizza.ingredients = currentPizzaIngredients;

      currentPizza = controller.calcPrice(currentPizza);
      currentPizza = controller.calcWeight(currentPizza);

      view.viewCheckList(currentPizza);

      controller.uploadPizza(currentPizza);

      view.viewIngredients();
    },
    calcPrice(currentPizza) {
      var basePrice = currentPizza.basePrice || 0;
      var ingredients = currentPizza.ingredients;


      for(elem of ingredients){
        basePrice += elem.totalPrice || 0;
      }


      currentPizza.totalPrice = +basePrice.toFixed(1);
      return currentPizza;
    },
    calcWeight(currentPizza) {
      var baseWeight = currentPizza.baseWeight || 0;
      var ingredientsWeight = 0;
      if(currentPizza.hasOwnProperty('ingredients')){

        var ingredients = currentPizza.ingredients;

        for(elem of ingredients){
          ingredientsWeight += elem.totalWeight || 0;
        }
      }
      currentPizza.totalWeight = baseWeight + ingredientsWeight;


      return currentPizza;
    },
    restartPizza(){
      window.localStorage.currentPizza = JSON.stringify({});
      view.viewCheckList({});
      view.viewBase();
      view.hiddenIngredients();

      var checkeds = document.querySelectorAll('.checked');
      for(checked of checkeds){
        checked.classList.remove('checked');
        checked.getElementsByTagName('input')[0].checked = false;
      }
      var counts = document.getElementsByClassName('current_count');
      for(count of counts){
        count.textContent = 0;
      }

    },
    addToCart(){
      var currentPizza = controller.loadPizza();
      if(currentPizza.hasOwnProperty('base') &&
         currentPizza.hasOwnProperty('dough') &&
         currentPizza.hasOwnProperty('size')){
          var cartList = controller.loadCartList() || [];
          cartList.push(currentPizza);
          controller.uploadCartList(cartList);
          controller.restartPizza();
          view.viewCartListLength();
         }else{
           alert('Не выбрана основа, тесто или размер Вашей пиццы!')
         }
    },
    appendLink(){
      var link = document.createElement('a');
      link.href = 'cart.html';
      link.classList.add('toCart');
      link.textContent = 'Перейти к корзине';
      var container = document.querySelector('.paycheck-wrap');
      container.appendChild(link);
    }
  };




  view.displayDate();

  model.getdata('../database.json').then(
    function (request) {
      controller.preparationElems(request);

      jqueryFunctions();

      var params = document.getElementsByClassName('ingredients')[0];
      params.addEventListener('change', () => {
        controller.selectParams(event, request);
      });
      params.addEventListener('click', (e) => {
        if (e.target.classList.contains('add') || e.target.classList.contains('remove')) {
          controller.addIngredient(e);
        }
      });
      var rest = document.getElementById('restart');
      rest.addEventListener('click', ()=>{
        controller.restartPizza();
      });
      var paycheck = document.querySelector('.paycheck');
      paycheck.addEventListener('click', (e)=>{
        if(e.target.classList.contains('product-remove')){
          var removeElem = e.target.parentElement.getElementsByClassName('product-name')[0]
          controller.removeIngredient(false, false, false, false, removeElem);
        }
      })
      var sendToCart = document.getElementById('send-to-cart');
      sendToCart.addEventListener('click', ()=>{
        controller.addToCart();
      });

      view.viewCartListLength();

    },
    function (err) {
      console.log(err)
    }
  )



  function jqueryFunctions() {
    $('input[type=radio').change(function () {
      var name = $(this).attr('name');
      $('input[name=' + name + ']').parent().removeClass('checked');
      if ($(this).prop('checked')) $(this).parent().addClass('checked');
    });

    function drawActiveIngredientsGroup() {
      if ($('#step4 .ingredients_label').hasClass('active_label')) {
        var src = $('.active_label').find('img').data('active-src');
        var group = $('.active_label').data('group');
        $('#' + group).css('display', 'flex');

        $('.active_label').find('img').attr('src', src);
      }
    }
    drawActiveIngredientsGroup();
    $('#step4 .ingredients_label').click(function () {
      var src = $('.active_label').find('img').data('src');
      $('.active_label').find('img').attr('src', src);
      $('.active_label').removeClass('active_label');
      $(this).addClass('active_label');
      $('#step4 .ingredients-wrap').css('display', 'none');
      drawActiveIngredientsGroup();
    });

    if ($(window).width() <= 1024) {
      $('.step:first').addClass('active_step').find('.step_wrap').css('display', 'block');


      $('.step').click(function () {
        if (!$(this).hasClass('active_step')) {
          var active = $(this).parents('.ingredients').find('.active_step');
          active.find('.step_wrap').slideUp(300);
          active.removeClass('active_step');
          $(this).addClass('active_step');
          $(this).find('.step_wrap').slideDown(300);
        }
      });
    }

  };



}






$(document).ready(function () {

  //----------------------------preloader----------------------------


  $('.preloader').delay(600).fadeOut('slow');

  //-------------------------mask Input-------------------------


  $('[name = "phone"]').mask("+375(99)999-99-99");
  $('.first-phone').mask("(99)999-99-99");




});