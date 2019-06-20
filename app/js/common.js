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
        currentSpan.textContent = element;
        currentInput.value = element;
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

        current.dataset.weight = buildWeight(element);


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

  };

  var controller = {
    preparationElems(request) {
      model.buildSize(request);
      model.buildDough(request);
      model.buildBases(request);
      model.buildIngredients(request);
      model.buildDips(request);
      controller.createOrLoadCurrentPizza();
    },
    // создаём новую пиццу или прорисовываем параметры существующей пиццы
    createOrLoadCurrentPizza() {
      if (!window.localStorage.currentPizza) {
        window.localStorage.currentPizza = JSON.stringify({});
      } else { // прорисовываем выбранные параметры пиццы
        var currentPizza = JSON.parse(window.localStorage.currentPizza);
        for (key in currentPizza) {
          var param = document.getElementsByName(key);
          param.forEach((elem) => {
            if (elem.value == currentPizza[key]) {
              elem.parentElement.classList.add('checked');
            }
          });
        };
      }
    },
    // добавляем парраметры пиццы
    selectParams(e, request) {

      var currentPizza = JSON.parse(window.localStorage.currentPizza);
      var paramName = e.target.name;
      var paramVal = e.target.value;
      var dough = request.dough;


      currentPizza[paramName] = paramVal;


      for (item of dough) {
        if (item.name == currentPizza.doughType && item.size == currentPizza.size) {
          currentPizza.basePrice = item.price;
          currentPizza.baseWeight = item.weight;
        }
      }


      currentPizza = JSON.stringify(currentPizza);
      window.localStorage.currentPizza = currentPizza;

      // view.writeParam();

    },
    addIngredient(e) {
      var currentPizza = JSON.parse(window.localStorage.currentPizza);
      var currentPizzaIngredients = currentPizza.ingredients || [];
      var that = e.target;
      var ingredient = that.closest('.ingredient_item');
      var ingredientName = ingredient.querySelector('.name').textContent;
      var max = ingredient.dataset.max || 1;
      var price = ingredient.dataset.price || 0;
      var weight = ingredient.dataset.weight || '';
      weight = weight.split(', ');
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
      if (findIngredient()) {
        var ingredient = findIngredient().val;
        var ingredientPos = findIngredient.pos;
        if (e.target.classList.contains('add')) {
          if (ingredient.count < ingredient.max) {
            ingredient.count += 1;
            ingredient.totalPrice = +((ingredient.price * ingredient.count).toFixed(1));
            ingredient.totalWeight = +ingredient.weight[ingredient.count-1];
          } else {
            alert('Извините, это мамсимум для данного ингредиента!');
          }
        } else if (e.target.classList.contains('remove')) {
          if (ingredient.count > 1) {
            ingredient.count -= 1;
            ingredient.totalPrice = +((ingredient.price * ingredient.count).toFixed(1));
            ingredient.totalWeight = +ingredient.weight[ingredient.count-1];
          } else {
            currentPizzaIngredients.splice(ingredientPos, 1);
          }
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
          currentPizzaIngredients.push(ingredient);
        }
      }


      currentPizza.ingredients = currentPizzaIngredients;

      currentPizza = controller.calcPrice(currentPizza);
      currentPizza = controller.calcWeight(currentPizza);

      currentPizza = JSON.stringify(currentPizza);
      window.localStorage.currentPizza = currentPizza;
    },
    calcPrice(currentPizza) {
      var basePrice = currentPizza.basePrice;
      var ingredients = currentPizza.ingredients;


      for(elem of ingredients){
        basePrice += elem.totalPrice || 0;
      }


      currentPizza.totalPrice = +basePrice.toFixed(1);
      return currentPizza;
    },
    calcWeight(currentPizza) {
      var baseWeight = currentPizza.baseWeight || 0;
      var ingredients = currentPizza.ingredients;
      var ingredientsWeight = 0;

      for(elem of ingredients){
        ingredientsWeight += elem.totalWeight;
      }
      currentPizza.totalWeight = baseWeight + ingredientsWeight;


      return currentPizza;
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