// Global Scoupe
var basedUrl = window.location.origin;
// Функция для инициализации range-sliders для фильтров
function rangeInit() {
  // если нужный элемент присутствует на странице
  if ($('.myarredo-slider').length > 0) {
    // проходимся по ним
    var allSlides = document.getElementsByClassName('myarredo-slider');
    $(allSlides).each(function (i, elem) {
      var minInput = $(elem)
          .next('.filter-slider-box')
          .children('.cur.min')
          .children('input[type="text"]');
      var maxInput = $(elem)
          .next('.filter-slider-box')
          .children('.cur.max')
          .children('input[type="text"]');
      if (minInput.val() == maxInput.val()) {
        maxInput.val(maxInput.val() + 1);
      }
      if (allSlides[i] != null) {
        noUiSlider.create(allSlides[i], {
          start: [
            Number($(allSlides[i]).attr('data-min')),
            Number($(allSlides[i]).attr('data-max')),
          ],
          connect: true,
          animate: true,
          animationDuration: 300,
          range: {
            min: Number(minInput.attr('data-default')),
            max: Number(maxInput.attr('data-default')),
          },
          format: wNumb({
            decimals: 0,
          }),
        });

        allSlides[i].noUiSlider.on('update', function () {
          var arrResult = allSlides[i].noUiSlider.get();
          minInput.val(arrResult[0]);
          maxInput.val(arrResult[1]);
        });

        minInput.change(function () {
          allSlides[i].noUiSlider.set([$(this).val(), maxInput.val()]);
        });

        maxInput.change(function () {
          allSlides[i].noUiSlider.set([minInput.val(), $(this).val()]);
        });
      }
    });
  }
}
// Функция для активации плагина Intl-input doc - https://github.com/jackocnr/intl-tel-input.git
// для форм в попапах
function interPhoneInit(ourSelector) {
  var selectorPhone = '.inter-phone',
      formSelector = '.form-inter-phone',
      codeSelector = '#cartcustomerform-country_code';
  if (ourSelector) {
    selectorPhone = ourSelector;
    formSelector = $(selectorPhone).parent('.form-group').parent('form');
    codeSelector = '#formfindproduct-country_code';
  }
  var btnSelector = $(formSelector).find('button[type=submit]');
  // if ($('.inter-phone').length > 0) {
  if ($(selectorPhone).length > 0) {
    // получаем язык сайта у пользователя
    var siteLang = $('html').attr('lang');
    // Получаем домен сайта
    var siteDomen = document.domain;

    // функционал переводов ошибок на языки сайта
    // для массива с текстами ошибок
    var errorMap = [];
    // для кода страны по дефолту при инициализации плагина
    var diCode = '';

    // Переключатель-котроллер (В зависимости какой язык выбран на сайте)
    switch (siteLang) {
      case 'it':
        // Массив ошибок для поля номер телефона для италянского языка
        errorMap = [
          'Numero non valido',
          'Codice paese non valido',
          'Troppo corto',
          'Troppo lungo',
          'Numero non valido',
        ];
        diCode = 'it';
        break;
      case 'en':
        // Массив ошибок для поля номер телефона в международном формате
        errorMap = [
          'Invalid number',
          'Invalid country code',
          'Too short',
          'Too long',
          'Invalid number',
        ];
        diCode = 'gb';
        break;
      case 'ru':
        // Массив ошибок для поля номер телефона для русского языка
        errorMap = [
          'Некорректный номер',
          'Некорректный код страны',
          'Номер короткий',
          'Номер длинный',
          'Некорректный номер',
        ];
        diCode = 'ru';
        break;
      case 'fr':
        // Массив ошибок для поля номер телефона для французского языка
        errorMap = [
          'Numéro invalide',
          'Code de pays invalide',
          'Numéro court',
          'Nombre long',
          'Numéro invalide',
        ];
        diCode = 'fr';
        break;
      case 'uk':
        // Массив ошибок для поля номер телефона для украинского языка
        errorMap = [
          'Некоректний номер',
          'Некоректний код країни',
          'Номер короткий',
          'Номер довгий',
          'Некоректний номер',
        ];
        diCode = 'ua';
        break;
      default:
        // Массив ошибок для поля номер телефона в международном формате
        errorMap = [
          'Invalid number',
          'Invalid country code',
          'Too short',
          'Too long',
          'Invalid number',
        ];
        diCode = 'it';
    }

    // поле - телефон из нашей формы
    // var intlInputEl = document.querySelector(".inter-phone");
    var intlInputEl = document.querySelector(selectorPhone);
    // div, обертка поля - телефон из нашей формы
    // var formGroupBox = $('.inter-phone').closest('.form-group');
    var formGroupBox = $(selectorPhone).closest('.form-group');
    // див help-block для показа сообщений об ошибке в поле телефон
    var errorMsg = formGroupBox.children('.help-block')[0];

    // инициализируем плагин международных телефонных номеров
    var iti = {};
    // если страна Германия то по дефолту маска De, если любая другая то - It
    if (siteLang == 'de') {
      diCode = 'de';
    } else {
      if (siteDomen == 'www.myarredofamily.com') {
        diCode = 'us';
      } else if (siteDomen == 'www.myarredo.kz') {
        diCode = 'kz';
      } else if (siteDomen == 'www.myarredo.ru') {
        diCode = 'ru';
      } else if (siteDomen == 'www.myarredo.fr') {
        diCode = 'fr';
      } else if (siteDomen == 'www.myarredo.uk') {
        diCode = 'gb';
      } else {
        diCode = 'it';
      }
    }
    iti = window.intlTelInput(intlInputEl, {
      separateDialCode: true,
      initialCountry: diCode,
      utilsScript: '/js/utils.js',
      formatOnDisplay: true,
    });

    // создаем функцию - сброса
    var reset = function () {
      intlInputEl.classList.remove('error');
      errorMsg.innerHTML = '';
      if (iti.isValidNumber()) {
        errorMsg.classList.add('hide');
        formGroupBox[0].classList.remove('has-error');
        formGroupBox[0].classList.add('has-success');
        btnSelector.attr('disabled', false);
      } else {
        errorMsg.classList.remove('hide');
        var errorCode = iti.getValidationError();
        errorMsg.innerHTML = errorMap[errorCode];
        formGroupBox[0].classList.remove('has-success');
        formGroupBox[0].classList.add('has-error');
        intlInputEl.setAttribute('aria-invalid', true);
        btnSelector.attr('disabled', true);
      }
    };

    // on blur: validate
    intlInputEl.addEventListener('blur', function () {
      reset();
      if (intlInputEl.value.trim()) {
        if (!iti.isValidNumber()) {
          setTimeout(function () {
            intlInputEl.classList.add('error');
            var errorCode = iti.getValidationError();
            errorMsg.innerHTML = errorMap[errorCode];
            errorMsg.classList.remove('hide');
            formGroupBox[0].classList.remove('has-success');
            formGroupBox[0].classList.add('has-error');
            intlInputEl.setAttribute('aria-invalid', true);
            btnSelector.attr('disabled', true);
          }, 500);
        } else {
          btnSelector.attr('disabled', false);
        }
      }
    });

    // on keyup / change flag: reset
    intlInputEl.addEventListener('change', reset);
    intlInputEl.addEventListener('keyup', reset);

    //   Валидация номера телефона при отправке формы
    // $('.form-inter-phone').on('beforeSubmit', function(ev) {
    $(formSelector).on('beforeSubmit', function (ev) {
      // если номер телефона не валидный
      if (!iti.isValidNumber()) {
        setTimeout(function () {
          intlInputEl.setAttribute('aria-invalid', true);
          var errorCode = iti.getValidationError();
          errorMsg.innerHTML = errorMap[errorCode];
          errorMsg.classList.remove('hide');
          formGroupBox[0].classList.remove('has-success');
          formGroupBox[0].classList.add('has-error');
          btnSelector.attr('disabled', true);
        }, 300);
        return false;
      } else {
        btnSelector.attr('disabled', false);
        // if ($(this).find('.inter-phone').val() != iti.getNumber()) {
        if ($(this).find(selectorPhone).val() != iti.getNumber()) {
          // $(this).find('.inter-phone').val(iti.getNumber());
          $(this).find(selectorPhone).val(iti.getNumber());
        }
        var countryData = iti.getSelectedCountryData();
        // $(this).find('#cartcustomerform-country_code').val(countryData.iso2);
        $(this).find(codeSelector).val(countryData.iso2);
      }
    });
  }
}

// Функция для активации плагина с заданой страной  (Intl-input doc - https://github.com/jackocnr/intl-tel-input.git)
// el - Node Element, поле для номера телефона (должно быть получено с помощью querySelector)
// code - String, код страны
function initTelInputCountry(el, code) {
  // Массив ошибок для поля номер телефона для русского языка
  var errorMap = [
    'Некорректный номер',
    'Некорректный код страны',
    'Номер короткий',
    'Номер длинный',
    'Некорректный номер',
  ];
  // поле - телефон из нашей формы
  var intlInputEl = el;
  // div, обертка поля - телефон из нашей формы
  var formGroupBox = $(el).closest('.form-group');
  // див help-block для показа сообщений об ошибке в поле телефон
  var errorMsg = formGroupBox.children('.help-block')[0];
  // Инициализируем плагин
  var itiEl = window.intlTelInput(intlInputEl, {
    separateDialCode: true,
    initialCountry: code,
    utilsScript: '/js/utils.js',
    formatOnDisplay: true,
  });

  // создаем функцию - сброса

  var reset = function () {
    intlInputEl.classList.remove('error');
    errorMsg.innerHTML = '';
    if (itiEl.isValidNumber()) {
      errorMsg.classList.add('hide');
      formGroupBox[0].classList.remove('has-error');
      formGroupBox[0].classList.add('has-success');
    } else {
      errorMsg.classList.remove('hide');
      var errorCode = itiEl.getValidationError();
      errorMsg.innerHTML = errorMap[errorCode];
      formGroupBox[0].classList.remove('has-success');
      formGroupBox[0].classList.add('has-error');
      intlInputEl.setAttribute('aria-invalid', true);
    }
  };

  // on blur: validate
  intlInputEl.addEventListener('blur', function () {
    reset();
    if (intlInputEl.value.trim()) {
      if (!iti.isValidNumber()) {
        setTimeout(function () {
          intlInputEl.classList.add('error');
          var errorCode = iti.getValidationError();
          errorMsg.innerHTML = errorMap[errorCode];
          errorMsg.classList.remove('hide');
          formGroupBox[0].classList.remove('has-success');
          formGroupBox[0].classList.add('has-error');
          intlInputEl.setAttribute('aria-invalid', true);
        }, 500);
      }
    }
  });

  // on keyup / change flag: reset
  intlInputEl.addEventListener('change', reset);
  intlInputEl.addEventListener('keyup', reset);

  return itiEl;
}

// Функция для отслеживания и открития элементов фильтров в которых выбран хоть один элемент
function runDesctop() {
  setTimeout(function () {
    // Запускаем цыкл по всем элементам всех фильтров
    $('.filters')
        .find('.one-filter')
        .find('.list-item')
        .children('a')
        .each(function (i, elem) {
          // Если обнаруживаем выбраный элемент в фильтре
          if ($(elem).hasClass('selected')) {
            // оставляем фильтр открытым
            $(elem).closest('.one-filter').addClass('open');
          }
        });
  }, 500);

  if ($('.js-numbers').hasClass('slick-slider')) {
    $('.js-numbers').slick('unslick');
  }
  if ($('.best-price .right-part').hasClass('slick-slider')) {
    $('.best-price .right-part').slick('unslick');
  }
}

// Функция для открития первого элемента по умолчанию в модалке - показать фабрики
function selectFirstFEl() {
  if ($('.alphabet-tab a').length > 0) {
    $('.alphabet-tab a').eq(0).trigger('click'); //показываем первый элемент по умолчанию
  }
}

function productDescriptionShow() {
  let container = $('[data-product-description]');
  let start_height = container.outerHeight();
  container.addClass('active-clamp');

  if (start_height > container.outerHeight()) {
    $('[data-read-description]').show();
  } else {
    $('[data-read-description]').hide();
  }
}

// Функция для инициализации слайдеров - Варианты отделки и Композиции
function slickInit() {
  if ($('.reviews-items-slider').length > 0) {
    $('.reviews-items-slider').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 540,
          settings: {
            dots:true,
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }
  if ($('#panel2 .row').length > 0) {
    $('#panel2 .row').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      nextArrow: "<a href=javascript:void(0) class='fa fa-angle-left'></a>",
      prevArrow: "<a href=javascript:void(0) class='fa fa-angle-right'></a>",
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 540,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }
  if ($('#comp-slider').length > 0) {
    $('#comp-slider').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: false,
      // autoplay: true,
      prevArrow:
          '<a href=javascript:void(0) class="slick-prev fa fa-angle-left"></a>',
      nextArrow:
          '<a href=javascript:void(0) class="slick-next fa fa-angle-right"></a>',
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 540,
          arrows: false,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }
}

// Инициализация элементов формы обратной связи
// info - https://github.com/Dimox/jQueryFormStyler
function feedbackFormElInit() {
  if ($('.selectpicker1').length > 0) {
    $('.selectpicker1').styler();
  }
  if ($('.selectpicker1-search').length > 0) {
    $('.selectpicker1-search').styler({
      selectSearch: true,
    });
  }
}

// Ready 1
$(document).ready(function () {
  slickInit();

  // удаляем прелоадер
  setTimeout(function () {$('#preload_box').hide();},500);

  var state = {
    _device: '',
    _mobInit: function () {
      runMobile();
    },
    _tabletInit: function () {
      runTablet();
    },
    _descInit: function () {
      runDesctop();
    },
    _preWindowWidth: $(window).width(),
    _windowIncreases: function () {
      if (state._preWindowWidth > $(window).width()) {
        state._preWindowWidth = $(window).width();
        return false;
      } else if (state._preWindowWidth < $(window).width()) {
        state._preWindowWidth = $(window).width();
        return true;
      }
    },
  };

  (function ($) {
    $.fn.getDevice = function (braikPointMob, braikPointTablet) {
      Object.defineProperty(state, 'device', {
        get: function () {
          return this._device;
        },

        set: function (value) {
          this._device = value;
          if (value == 'desctop') {
            state._descInit();
          } else if (value == 'tablet') {
            state._tabletInit();
          } else if (value == 'mobile') {
            state._mobInit();
          }
        },
      });

      $(this).on('resize load', function () {
        if ($(this).width() < braikPointMob && state.device != 'mobile') {
          state.device = 'mobile';
        } else if (
            $(this).width() > braikPointMob &&
            $(this).width() < braikPointTablet &&
            state.device != 'tablet'
        ) {
          state.device = 'tablet';
        } else if (
            $(this).width() > braikPointTablet &&
            state.device != 'desctop'
        ) {
          state.device = 'desctop';
        }
      });
    };
    // инициализация LazyLoad
    var lazyLoadInstance = new LazyLoad({
      elements_selector: '.lazy',
    });

    // footer custom-lazy init
    if ($('.custom-lazy').length > 0) {
      setTimeout(function () {
        var custlazyUrl = $('.custom-lazy').attr('data-background');
        $('.custom-lazy').css('background-image', 'url(' + custlazyUrl + ')');
      }, 1000);
    }

    // for hide h1 for about page
    (function () {
      if (
          $('.about-container').length > 0 &&
          $('.about-presents-titlebox').length > 0
      ) {
        $('.about-container').find('.about-title').slideUp();
      }
    })();

    // js для подсветки активных ссылок основного меню в шапке сайте
    if ($('.headermenu').length > 0) {
      $('.headermenu')
          .children('li')
          .each(function (i, elem) {
            if ($(elem).children('a').attr('href') == window.location.pathname) {
              $(elem).addClass('has-list');
            } else {
              $(elem).removeClass('has-list');
            }
          });
    }

    // Smooth scrols (W3C recomended)
    // Функционал плавного скрола по рекомендациям W3C
    // можно добавлять новые ссылки через запятую
    $('.totopbox a').on('click', function (event) {
      // Make sure this.hash has a value before overriding default behavior
      if (this.hash !== '') {
        // Prevent default anchor click behavior
        event.preventDefault();

        // Store hash
        var hash = this.hash;

        // Using jQuery's animate() method to add smooth page scroll
        // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
        $('html, body').animate(
            {
              scrollTop: $(hash).offset().top,
            },
            900,
            function () {
              // Add hash (#) to URL when done scrolling (default click behavior)
              window.location.hash = hash;
            }
        );
      } // End if
    });
    var pagePos = 0;
    var jsBtnPos = 0;
    var endBtnPos = 0;
    // Если фильтр существует на странице
    if ($('.scroll-marker').length > 0) {
      jsBtnPos = $('.scroll-marker').offset().top - 15;
      endBtnPos = jsBtnPos + $('.scroll-marker').find('.cat-prod').height();
    }
    $(window).scroll(function (ev) {
      // add to top button
      if ($(this).scrollTop() > 500) {
        $('.totopbox').show();
      } else {
        $('.totopbox').hide();
      }
      // Авто скролл для блока с кастомным просмотрщиком галереи
      if ($('.custom-image-gallery.open').length > 0) {
        var posVal = $(this).scrollTop() - pagePos;
        var currentPos = $('.scrollwrap').scrollTop();
        $('.scrollwrap').scrollTop(currentPos + posVal);
        pagePos = $(this).scrollTop();
      }
      // *Для фиксации фильтра на мобильном
      // Если фильтр существует на странице
      if ($('.scroll-marker').length > 0) {
        if ($(this).scrollTop() >= jsBtnPos && $(this).scrollTop() <= endBtnPos) {
          $('.js-filter-btn').addClass('filter-btn-fixed');
          $('.ajax-get-filter').addClass('filter-panel-fixed');
        } else {
          $('.js-filter-btn').removeClass('filter-btn-fixed');
          $('.ajax-get-filter').removeClass('filter-panel-fixed');
        }
      }
      // *Для фиксации формы подачи заявки на странице товара
      // Если данная форма существует на странице
      if ($('.scrolled').length > 0) {
        if ($('.ecotime').length > 0) {
          if ($('.ecotime').offset().top < 1000) {
            return false;
          }
          var ecotimePos = $('.ecotime').offset().top - 750;
          if ($(this).scrollTop() > 50) {
            $('.scrolled').addClass('fixed');
            if ($(this).scrollTop() < ecotimePos) {
              $('.scrolled').removeClass('hidetop');
              $('.scrolled').css('top', '56px');
            } else {
              $('.scrolled').addClass('hidetop');
              $('.scrolled').css('top', ecotimePos - 80 + 'px');
            }
          } else {
            $('.scrolled').removeClass('fixed');
          }
        }
      }
    });
  })(jQuery);

  $(window).getDevice(540, 768);

  //console.log(state.device);

  function runMobile() {
    //console.log('mobile');
    //Слайдер с номерками
    $('.js-numbers').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
    });
    $('.best-price .right-part').slick({
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      dots: true,
    });
    /*--конец Главная--*/
  }

  function runTablet() {
    //console.log('tablet');
    //$('.filters .one-filter').removeClass('open');
    if ($('.js-numbers').hasClass('slick-slider')) {
      $('.js-numbers').slick('unslick');
    }
    if ($('.best-price .right-part').hasClass('slick-slider')) {
      $('.best-price .right-part').slick('unslick');
    }
  }

  (function () {
    // Запускаем цыкл по всем элементам всех фильтров
    $('.filters')
        .find('.one-filter')
        .find('.list-item')
        .children('a')
        .each(function (i, elem) {
          // Если обнаруживаем выбраный элемент в фильтре
          if ($(elem).hasClass('selected')) {
            // оставляем фильтр открытым
            $(elem).closest('.one-filter').addClass('open');
          }
        });
  })();

  /*--Конец определения девайса--*/

  /*--Открыть/закрыть города--*/
  (function () {
    $('#select-city,#close-top').click(function () {
      $('.city-select-cont').slideToggle(500);
    });
  })();
  /*--конец Открыть закрыть города--*/

  /*--Слайдер Главная--*/
  $('#home-slider').carousel({});
  /*--конец Слайдер Главная--*/

  /*--Слайдер новинки--*/
  $('#novelties-slider').carousel({});
  /*--конец Слайдер новинки--*/

  /*--Слайдер новинки--*/
  $('#sale-slider').carousel({});
  /*--конец Слайдер новинки--*/

  /*--Слайдер новинки--*/
  $('#reviews-slider').carousel({});
  /*--конец Слайдер новинки--*/

  // Instantiate the Bootstrap carousel
  $('.multi-item-carousel').carousel({
    interval: false,
  });

  // for every slide in carousel, copy the next slide's item in the slide.
  // Do the same for the next, next item.
  $('.multi-item-carousel .item').each(function () {
    var next = $(this).next();
    if (!next.length) {
      next = $(this).siblings(':first');
      //console.log(next);
    }

    next.children(':first-child').clone().appendTo($(this));
    next.next().children(':first-child').clone().appendTo($(this));
    if (next.next().length > 0) {
      next.next().next().children(':first-child').clone().appendTo($(this));
    } else {
      $(this)
          .siblings(':first')
          .children(':first-child')
          .clone()
          .appendTo($(this));
    }
  });

  $('#rec-prod-slider').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    prevArrow:
        '<a href=javascript:void(0) class="slick-prev fa fa-angle-left"></a>',
    nextArrow:
        '<a href=javascript:void(0) class="slick-next fa fa-angle-right"></a>',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 540,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });

  /*--Изменение вида в каталоге--*/
  (function () {
    $('.location-buts > a').click(function () {
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      if ($(this).attr('data-style') == 'large') {
        $(this).closest('.cont-area').addClass('large-tiles');
      } else {
        $(this).closest('.cont-area').removeClass('large-tiles');
      }
    });
  })();
  /*--конец Изменение вида в каталоге--*/

  /*--Ползунок каталог--*/
  rangeInit();
  /*--конец ползунок--*/

  /*--Открыть\закрыть категорию в каталоге--*/
  $(document).on('click', '.filt-but', function () {
    var parent = $(this).parent('.one-filter');
    if (parent.hasClass('open')) {
      parent.removeClass('open');
      parent.find('.list-item').slideUp();
    } else {
      parent.addClass('open');
      parent.find('.list-item').slideDown();
    }
    //parent.find('.list-item').slideToggle();
  });

  /*--конец Открыть\закрыть категорию в каталоге--*/

  // js for default close filters for mobile and tablets
  function closeFilter() {
    if ($(window).width() < 992) {
      setTimeout(function () {
        $('#catalog_filter').children('.one-filter').removeClass('open');
      }, 1000);
    }
  }

  closeFilter();

  $('.factory-page .view-all').click(function () {
    $(this).parent('.all-list').find('.post-list').slideToggle();
  });

  /*--Блокнот--*/
  $('.notebook-page .basket-item-info').each(function (i, item) {
    if (i > 2) {
      $(item).hide();
    }
  });
  $('.notebook-page .show-all').click(function () {
    $('.basket-item-info').show();
    $(this).remove();
  });

  $('.notebook-page')
      .find('.basket-item-info')
      .on('mouseenter', '.read-more', function (e) {
        var item = $(this).closest('.basket-item-info');
        var itemHeight = item.outerHeight();
        item.addClass('read-more');
        item.css('min-height', itemHeight + 'px');
      });
  $('.notebook-page')
      .find('.basket-item-info')
      .on('mouseleave', function (e) {
        var item = $(this);
        var cartbutton = $('.notebook-page')
            .find('.basket-item-info')
            .find('.read-more');
        if (!cartbutton.is(e.target)) {
          item.removeClass('read-more');
        }
      });

  /*--конец Блокнот--*/

  /*--открыть/закрыть заказ (кабинет фабрики)--*/
  $('.manager-history-list .orders-title-block').click(function () {
    var item = $(this).closest('.item');
    item.toggleClass('open');
    item.siblings().removeClass('open');
    item.siblings().find('.hidden-order-info').slideUp();
    item.find('.hidden-order-info').slideToggle();
    if (typeof item.attr('data-hash') !== 'undefined') {
      var hash = item.attr('data-hash');
      window.location.hash = hash;
    }
  });

  (function () {
    if (window.location !== '') {
      var hash = window.location.hash.replace('#', '');
      var el = $('[data-hash="' + String(hash) + '"]');
      if (el.length > 0) {
        var top = el.offset().top;
        setTimeout(function () {
          $('html,body').animate({ scrollTop: top }, 100);
          el.find('.orders-title-block').click();
        }, 200);
      }
    }
    if (window.location.search) {
      // если мы находимся именно на странице заказов
      if (window.location.pathname.indexOf('orders') != -1) {
        var checkedSearch = window.location.search.replace('?', '');
        var searchVal = window.location.search.replace('?', '#');
        // Если запрос являеться числом (значит это именно запрос на переход к заказу а не какой то другой)
        if (!isNaN(checkedSearch)) {
          var link = window.location.pathname + searchVal;
          window.location = link;
        }
      }
    }
  })();

  /*--конец открыть/зыкрыть заказ (кабинет фабрики)--*/

  /*--поиск по списку (кабинет фабрики)--*/
  $('.drop-down-find .find').on('input', function () {
    var In = $(this).val();
    var dropDown = $(this).closest('.drop-down-find').find('li a');
    dropDown.each(function (i, item) {
      if ($(item).text().indexOf(In) !== 0) {
        $(item).parent().hide();
      } else {
        $(item).parent().show();
      }
    });
  });
  $('.drop-down-find li a').click(function () {
    var parent = $(this).closest('.arr-drop');
    var text = $(this).text();
    parent.find('.dropdown-toggle').text(text);
  });
  $('.arr-drop .dropdown-toggle').click(function () {
    var parent = $(this).closest('.arr-drop');
    parent.find('.find').val('');
    parent.find('.drop-down-find li').show();
  });
  /*--конец поиск по списку (кабинет фабрики)--*/

  /*--Активация табов в карточке--*/
  $('.prod-card-page .nav-tabs li a').eq(0).click();
  /*--конец Активация табов в карточке--*/

  $('.list-cities label').click(function () {
    $(this).parent().find('input[type="checkbox"]').click();
  });

  $('.categoty-page .one-item-check').click(function () {
    location.href = $(this).attr('href');
  });

  $('.dropdown-menu a').click(function () {
    var href = $(this).attr('href');
    window.location.href = href;
  });

  $('.show-all-sub').click(function () {
    var list = $(this).siblings('.list-item');
    var variant = $(this).attr('data-variant');
    var textCont = $(this).find('.btn-text');

    if (list.hasClass('show')) {
      list.removeClass('show');
      $(this).attr('data-variant', textCont.text());
      $(this).addClass('show-class');
      textCont.text(variant);
    } else {
      list.addClass('show');
      $(this).attr('data-variant', textCont.text());
      $(this).removeClass('show-class');
      textCont.text(variant);
    }
  });

  (function () {
    var selItemIn = $('.list-item > .one-item-check.selected');

    selItemIn.each(function (i, item) {
      var parent = $(item).closest('.list-item');
      parent.prepend($(item));
    });
  })();

  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $('#panel2 .row').slick('unslick');
    $('#comp-slider').slick('unslick');
    slickInit();
  });

  /*--Галерея Карточка товара--*/
  (function () {
    $('a.fancyimage').fancybox();
  })();
  /*--конец Галерея Карточка товара --*/

  if ($('.std-slider').length > 0) {
    // если ширина экрана меньше 540px (это мобильный)
    if (window.screen.width <= 540) {
      // показываем слайдер с одним кадром
      $('.std-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false,
        prevArrow:
            '<a href=javascript:void(0) class="slick-prev fa fa-angle-left"></a>',
        nextArrow:
            '<a href=javascript:void(0) class="slick-next fa fa-angle-right"></a>',
      });
    } else {
      $('.std-slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        dots: false,
        prevArrow:
            '<a href=javascript:void(0) class="slick-prev fa fa-angle-left"></a>',
        nextArrow:
            '<a href=javascript:void(0) class="slick-next fa fa-angle-right"></a>',
        responsive: [
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            },
          },
          {
            breakpoint: 540,
            arrows: false,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      });
    }
  }

  /*--модалка варианты отделки*/
  $(document).on('click', '.composition .show-modal', function (e) {
    e.preventDefault();
    var img = $(this).clone();
    $('#decoration-modal .image-container').html('').append(img);
    $('#decoration-modal').modal();
  });
  /*--конец модалка варианты отделки*/

  /*--больше фабрик модалка--*/
  $(document).on('click', '.alphabet-tab a', function () {
    $(this).siblings().removeClass('active');
    $(this).addClass('active');

    var actTab = $(this).text();
    var actShow = $('[data-show=' + actTab + ']').show();
    actShow.siblings().hide();
    actShow.css({
      display: 'flex',
    });
  });
  /*--конец Больше фабрик модалка--*/

  $('.img-zoom').click(function () {
    $('#prod-slider .item.active .fancyimage').click();
  });

  if ($('.carousel-indicators li').length == 1) {
    //Скрываем стрелки если только одна картинка в слайдере
    $('.nav-contr').hide();
  }

  // $("#novelties-slider .item img").each(function (i, item) {
  //     var src = $(item).attr("src");
  //     $(item).css({"opacity": "0"});
  //     $(item).parent().css({"background-image": "url(" + src + ")"});
  // });

  if ($('.text-col').text().trim() == '') {
    $('.text-col').closest('.text-description').remove();
  }

  $("[data-toggle='tooltip']").tooltip({ html: true });

  $(document).on('click', '.link-composition', function () {
    if ($('#comp-slider').length > 0) {
      $('#comp-slider').addClass('mw-item');

      // Ожидаем инициализацию слайдера и перемотываем на один слайд вперед чтобы убрать баг который возникает из за табов на телефонах
      var count = 0;
      var runSliderComp = setInterval(function () {
        if (count > 120) {
          clearInterval(runSliderComp);
        }
        try {
          $('#comp-slider').slick('slickNext');
          clearInterval(runSliderComp);
        } catch (e) {
          count++;
          return false;
        }
      }, 100);
    }
  });

  $('.btn-toform').click(function () {
    var bestPriceBox = $('.best-price-form');
    var topPos = bestPriceBox.offset().top;
    $('html, body').animate(
        {
          scrollTop: topPos,
        },
        300
    );
  });

  // изменение цвета "колокольчика"
  var rightPartAuth = $('.right-part.autorized');
  // если авторизированы
  if (rightPartAuth.length > 0) {
    //получаем значение
    var countWishlist = $('.for-price-bell').text();
    // элемент "колокольчик"
    var iconBell = $('.right-part.autorized .fa-bell');
    // если больше нуля меняем цвет на красный
    if (+countWishlist > 0) {
      iconBell.css({ color: '#C4252F' });
    } else {
      iconBell.css({ color: '#bdbcb3' });
    }
  }
});
// end ready

(function () {
  var loaderTemplate =
      '<div class="loader" style="display: none;">' +
      '<div id="floatingCirclesG">' +
      '<div class="f_circleG" id="frotateG_01"></div>' +
      '<div class="f_circleG" id="frotateG_02"></div>' +
      '<div class="f_circleG" id="frotateG_03"></div>' +
      '<div class="f_circleG" id="frotateG_04"></div>' +
      '<div class="f_circleG" id="frotateG_05"></div>' +
      '<div class="f_circleG" id="frotateG_06"></div>' +
      '<div class="f_circleG" id="frotateG_07"></div>' +
      '<div class="f_circleG" id="frotateG_08"></div>' +
      '</div>' +
      '</div>';

  if ($('#checkout-form').length) {
    var btn = $('#checkout-form button[type=submit]');

    $('body').append(loaderTemplate);

    $('#checkout-form').on('submit', function (e) {
      btn.addClass('disabled');
      $('.loader').show();
    });
    document
        .getElementById('checkout-form')
        .addEventListener('DOMSubtreeModified', function () {
          $('.loader').hide();
          btn.removeClass('disabled');
        });
  }
})();

// Ready 2
$(document).ready(function () {
  if (window.screen.width >= 769) {
    $('.js-has-list').hover(
        function () {
          $(this).find('.list-level-wrap').fadeIn(100);
        },
        function () {
          $(this).find('.list-level-wrap').fadeOut(80);
        }
    );
  } else if (window.screen.width <= 768) {
    $('.js-has-list')
        .children('a')
        .on('click', function (e) {
          e.preventDefault();
          if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $(this).siblings('.list-level-wrap').slideUp();
          } else {
            $(this).addClass('open');
            $(this).siblings('.list-level-wrap').slideDown();
          }
        });
  }

  $('.js-select-lang').on('click', function () {
    if ($(this).hasClass('opened')) {
      $(this).parent().find('.lang-drop-down').fadeOut(80);
      $(this).parent().removeClass('opened');
    } else {
      $(this).parent().find('.lang-drop-down').fadeIn(100);
      $(this).parent().addClass('opened');
    }
  });

  $(document).mouseup(function (e) {
    var container = $('.lang-selector');
    if (container.has(e.target).length === 0) {
      $('.lang-drop-down').fadeOut(100);
      $('.lang-selector').removeClass('opened');
    }
  });

  $('.btn-morepartners').on('click', function () {
    $(this)
        .parent('.show-more-partners')
        .siblings('.mobile-dropbox')
        .slideToggle(1200);
  });
});
/*--------------------------------------------------------*/
// Ready 3
$(document).ready(function () {
  /*--Главная--*/
  $('[data-styler]').styler();

  $('.js-read-more').on('click', function () {
    var variant = $(this).attr('data-variant');
    $(this).attr('data-variant', $(this).text());
    $(this).text(variant);
    $(this).closest('.post-content').toggleClass('opened');
  });

  // Открыть/Закрыть мобильное меню
  $('.js-menu-btn').on('click', function () {
    // $('.js-mobile-menu').fadeIn(120);
    var mobHeader = $(this).closest('.mobile-header');
    if (mobHeader.hasClass('open')) {
      mobHeader.removeClass('open');
      $('body').removeClass('stop-scrolling');
    } else {
      mobHeader.addClass('open');
      $('body').addClass('stop-scrolling');
    }
  });

  // Закрыть мобильное меню
  $('.js-close-mobile-menu').on('click', function () {
    // $('.js-mobile-menu').fadeOut(120);
    var mobHeader = $(this).closest('.mobile-header');
    mobHeader.removeClass('open');
    $('body').removeClass('stop-scrolling');
  });

  $('.js-toggle-list').on('click', function () {
    $(this).toggleClass('opened');
    $(this).parent().find('.js-list-container').toggle();
  });

  $('.js-select-city').on('click', function () {
    if ($(this).hasClass('opened')) {
      $(this).parent().find('.city-list-cont').fadeOut(80);
      $(this).removeClass('opened');
    } else {
      $(this).parent().find('.city-list-cont').fadeIn(100);
      $(this).addClass('opened');
    }
  });

  $(document).mouseup(function (e) {
    var container = $('.select-city');
    if (container.has(e.target).length === 0) {
      container.find('.city-list-cont').fadeOut(80);
      $('.js-select-city').removeClass('opened');
    }
  });

  // $('[data-dominant-color]').each(function (i, item) {
  //     var imgSrc = $(item).find('img').attr('src');
  //     $(item).find('.background').css({
  //         'background-image': "url( " + imgSrc + " )"
  //     });
  //     var img = $(item).find('img').get(0);
  // });

  $('.js-filter-btn').on('click', function () {
    $('.js-filter-modal').slideToggle(200);
  });

  function checkMenuDisplay() {
    var winWidth = $(document).width();
    if (winWidth > 992) {
      $('.js-filter-modal').show();
    }
  }

  $(window).on('resize', checkMenuDisplay);

  $('#prod-slider .carousel-inner').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '#prod-slider .carousel-indicators',
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: true,
          prevArrow:
              "<a class='arrow prev'><i class='fa fa-angle-left'></i></a>",
          nextArrow:
              "<a class='arrow next'><i class='fa fa-angle-right'></i></a>",
        },
      },
    ],
  });
  $('#prod-slider .carousel-indicators').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: '#prod-slider .carousel-inner',
    focusOnSelect: true,
    arrows: true,
    prevArrow: "<a class='arrow prev'><i class='fa fa-angle-left'></i></a>",
    nextArrow: "<a class='arrow next'><i class='fa fa-angle-right'></i></a>",
    dots: false,
    variableWidth: true,
  });

  $('#cartcustomerform-user_agreement').styler();
  $('input[type="checkbox"]').styler();

  /*--Фиксированный хедер--*/
  if ($('.js-fixed-header').length) {
    $(window).on('scroll', function () {
      if (window.screen.width >= 769) {
        var headerHeight = $('.js-fixed-header').outerHeight();
        if ($(window).scrollTop() > headerHeight) {
          $('body').addClass('fixed-header');
          $('.js-main').css({
            'padding-top': headerHeight + 'px',
          });
        } else {
          $('body').removeClass('fixed-header');
          $('.js-main').css({
            'padding-top': 0 + 'px',
          });
        }
      }
    });
  }

  $(window).resize(function () {
    $(window).scroll();
  });

  $(window).scroll();
  /*--конец Фиксированый хедер--*/

  $('.home-main .categories-sect .one-cat').on('click', function () {
    $(this).toggleClass('opened');
  });
  $('.mobcat').on('click', '.one-cat', function () {
    $(this).toggleClass('opened');
  });

  productDescriptionShow();
  $('[data-read-description]').on('click', function() {
    $(this).hide();
    $(this).siblings('[data-product-description]').removeClass('active-clamp')
  })

  // for open/close mobile search
  if ($('.mobile-header').length > 0) {
    $('.mobile-header')
        .find('.search-btn')
        .on('click', function () {
          $('.mobsearch-box').slideToggle();
        });
  }

  // Инициализация главного верхнего слайдера на домашней странице
  // (function () {
  //     setTimeout(function () {
  //         if ($('.home-top-slider').length > 0) {
  //             $('.home-top-slider').slick({
  //                 autoplay: true,
  //                 dots: true,
  //                 arrows: true,
  //                 fade: true,
  //                 cssEase: 'linear',
  //                 autoplaySpeed: 3000
  //             });
  //         }
  //     }, 400);
  // })();

  // Инициализация слайдера фото партнеров на странице партнеров
  (function () {
    setTimeout(function () {
      if ($('.contact-partner-slider').length > 0) {
        $('.contact-partner-slider').slick({
          autoplay: true,
          dots: false,
          arrows: true,
          fade: true,
          cssEase: 'linear',
          autoplaySpeed: 3000,
        });
      }
    }, 400);
  })();

  // Инициализация слайдера на странице фабрики
  (function () {
    setTimeout(function () {
      if ($('.fact-slider').length) {
        $('.fact-slider').slick({
          autoplay: true,
          dots: true,
          arrows: false,
          fade: true,
          cssEase: 'linear',
          autoplaySpeed: 3000,
        });
      }
    }, 400);
  })();

  (function () {
    setTimeout(function () {
      $('.selectpicker').selectpicker();
    }, 1000);
  })();

  // Функция для валидации ввода в поля фильтров на главной странице
  // отлавливаем ввод данных в полях фильтра
  $(document).on(
      'input',
      '.filter-bot .filter-price input[type="text"]',
      function (ev) {
        // если значение поля не пустое и если введенный символ не являеться числом
        if (isNaN(ev.originalEvent.data) && ev.target.value != '') {
          // и если значение поля не являеться числом
          if (!isNaN(parseFloat(ev.target.value))) {
            // и если это число больше 0
            if (parseFloat(ev.target.value) > 0) {
              ev.target.value = parseFloat(ev.target.value);
            }
            // иначе присваиваем полю 0
            else {
              ev.target.value = 0;
            }
          }
          // иначе очищаем поле
          else {
            ev.target.value = '';
          }
        }
      }
  );

  $(document).on('click', '.click-on-factory-file', function () {
    $.post(baseUrl + 'catalog/factory/click-on-file/', {
      _csrf: $('#token').val(),
      id: $(this).data('id'),
    });
  });

  $(document).on('click', '.click-on-become-partner', function () {
    $.post(baseUrl + 'forms/click-on-become-partner/', {
      _csrf: $('#token').val(),
    });
  });

  // Инициализация виджета - Intl-input doc - https://github.com/jackocnr/intl-tel-input.git
  // получаем язык сайта у пользователя
  var siteLang = $('html').attr('lang');
  // Получаем домен сайта
  var siteDomen = document.domain;
  // функционал переводов ошибок на языки сайта
  // для массива с текстами ошибок
  var errorMap = [];
  // для кода страны по дефолту при инициализации плагина
  var diCode = '';

  // Переключатель-котроллер (В зависимости какой язык выбран на сайте)
  switch (siteLang) {
    case 'it':
      // Массив ошибок для поля номер телефона для италянского языка
      errorMap = [
        'Numero non valido',
        'Codice paese non valido',
        'Troppo corto',
        'Troppo lungo',
        'Numero non valido',
      ];
      diCode = 'it';
      break;
    case 'fr':
      // Массив ошибок для поля номер телефона для французского языка
      errorMap = [
        'Numéro invalide',
        'Code de pays invalide',
        'Numéro court',
        'Nombre long',
        'Numéro invalide',
      ];
      diCode = 'fr';
      break;
    case 'en':
      // Массив ошибок для поля номер телефона в международном формате
      errorMap = [
        'Invalid number',
        'Invalid country code',
        'Too short',
        'Too long',
        'Invalid number',
      ];
      diCode = 'gb';
      break;
    case 'ru':
      // Массив ошибок для поля номер телефона для русского языка
      errorMap = [
        'Некорректный номер',
        'Некорректный код страны',
        'Номер короткий',
        'Номер длинный',
        'Некорректный номер',
      ];
      diCode = 'ru';
      break;
    case 'uk':
      // Массив ошибок для поля номер телефона для украинского языка
      errorMap = [
        'Некоректний номер',
        'Некоректний код країни',
        'Номер короткий',
        'Номер довгий',
        'Некоректний номер',
      ];
      diCode = 'ua';
      break;
    case 'he':
      // Массив ошибок для поля номер телефона для иврита
      errorMap = [
        'מספר שגוי',
        'קוד מדינה לא חוקי',
        'מספר קצר',
        'מספר ארוך',
        'מספר שגוי',
      ];
      diCode = 'il';
      break;
    default:
      // Массив ошибок для поля номер телефона в международном формате
      errorMap = [
        'Invalid number',
        'Invalid country code',
        'Too short',
        'Too long',
        'Invalid number',
      ];
      diCode = 'it';
  }
  // если данное поле существует на странице
  if ($('.intlinput-field').length > 0) {
    // поле - телефон из нашей формы
    var intlInputEl = document.querySelector('.intlinput-field');
    // div, обертка поля - телефон из нашей формы
    var formGroupBox = $('.intlinput-field').closest('.form-group');
    // див help-block для показа сообщений об ошибке в поле телефон
    var errorMsg = formGroupBox.children('.help-block')[0];

    // инициализируем плагин международных телефонных номеров
    var iti = {};
    // если по условию нужна только определенная страна
    if ($(intlInputEl).attr('data-conly') == 'yes') {
      iti = window.intlTelInput(intlInputEl, {
        separateDialCode: true,
        onlyCountries: [diCode],
        initialCountry: diCode,
        utilsScript: '/js/utils.js',
        formatOnDisplay: true,
      });
    }
    // иначе инициализируем со всемя странами
    else {
      // если страна Германия то по дефолту маска De
      if (siteLang == 'de') {
        diCode = 'de';
      } else {
        if (siteDomen == 'www.myarredofamily.com') {
          diCode = 'us';
        } else if (siteDomen == 'www.myarredo.kz') {
          diCode = 'kz';
        } else if (siteDomen == 'www.myarredo.fr') {
          diCode = 'fr';
        } else if (siteDomen == 'www.myarredo.uk') {
          diCode = 'gb';
        } else {
          diCode = 'it';
        }
      }
      iti = window.intlTelInput(intlInputEl, {
        separateDialCode: true,
        initialCountry: diCode,
        utilsScript: '/js/utils.js',
        formatOnDisplay: true,
      });
    }
    var btnSubmit = $('#checkout-form button[type=submit]');
    // создаем функцию - сброса
    var reset = function () {
      intlInputEl.classList.remove('error');
      errorMsg.innerHTML = '';
      if (iti.isValidNumber()) {
        errorMsg.classList.add('hide');
        formGroupBox[0].classList.remove('has-error');
        formGroupBox[0].classList.add('has-success');
        btnSubmit.attr('disabled', false);
      } else {
        errorMsg.classList.remove('hide');
        var errorCode = iti.getValidationError();
        errorMsg.innerHTML = errorMap[errorCode];
        formGroupBox[0].classList.remove('has-success');
        formGroupBox[0].classList.add('has-error');
        intlInputEl.setAttribute('aria-invalid', true);
        btnSubmit.attr('disabled', true);
      }
    };

    // on blur: validate
    intlInputEl.addEventListener('blur', function () {
      reset();
      if (intlInputEl.value.trim()) {
        if (!iti.isValidNumber()) {
          btnSubmit.attr('disabled', true);
          setTimeout(function () {
            intlInputEl.classList.add('error');
            var errorCode = iti.getValidationError();
            errorMsg.innerHTML = errorMap[errorCode];
            errorMsg.classList.remove('hide');
            formGroupBox[0].classList.remove('has-success');
            formGroupBox[0].classList.add('has-error');
            intlInputEl.setAttribute('aria-invalid', true);
          }, 500);
        } else {
          btnSubmit.attr('disabled', false);
        }
      }
    });

    // on keyup / change flag: reset
    intlInputEl.addEventListener('change', reset);
    intlInputEl.addEventListener('keyup', reset);

    //   Валидация номера телефона при работе с формой
    $('.form-iti-validate').on('afterValidate', function (ev) {
      // Если номер телефона уже введен и номер телефона не валидный
      if (iti.getNumber() && !iti.isValidNumber()) {
        btnSubmit.attr('disabled', true);
        setTimeout(function () {
          intlInputEl.setAttribute('aria-invalid', true);
          var errorCode = iti.getValidationError();
          errorMsg.innerHTML = errorMap[errorCode];
          errorMsg.classList.remove('hide');
          formGroupBox[0].classList.remove('has-success');
          formGroupBox[0].classList.add('has-error');
        }, 300);
        return false;
      } else {
        btnSubmit.attr('disabled', false);
      }
    });
    $('.form-iti-validate').on('beforeSubmit', function () {
      // если номер телефона валидный
      if (iti.isValidNumber()) {
        if ($(this).find('.intlinput-field').val() != iti.getNumber()) {
          $(this).find('.intlinput-field').val(iti.getNumber());
        }
        var countryData = iti.getSelectedCountryData();
        $(this).find('#cartcustomerform-country_code').val(countryData.iso2);
      }
    });

    // Привязка виджета к выбору страны в выпадающем списке
    var changeIndicator = false;
    var changeCCode = '';
    // Если пользователь изменил страну
    $('select.rcountry-sct').on('change', function () {
      // Control change country
      switch ($(this).val()) {
        case '1':
          changeIndicator = true;
          changeCCode = 'ua';
          break;
        case '2':
          changeIndicator = true;
          changeCCode = 'ru';
          break;
        case '3':
          changeIndicator = true;
          changeCCode = 'by';
          break;
        case '4':
          changeIndicator = true;
          changeCCode = 'it';
          break;
        case '85':
          changeIndicator = true;
          changeCCode = 'de';
          break;
        case '114':
          changeIndicator = true;
          changeCCode = 'kz';
          break;
        default:
          changeIndicator = false;
      }

      // Если индикатор разрешает изменить код страны
      if (changeIndicator) {
        // Убиваем старую инициализацию
        iti.destroy();
        // Переинициализируем виджет с выбраной нужной страной по дефолту
        iti = window.intlTelInput(intlInputEl, {
          separateDialCode: true,
          onlyCountries: [changeCCode],
          initialCountry: changeCCode,
          utilsScript: '/js/utils.js',
          formatOnDisplay: true,
        });
      }
    });
  }
  // if ($('.intlinput-field2').length > 0) {

  //     // поле - телефон из нашей формы
  //     var intlInputEl2 = document.querySelector(".intlinput-field2");
  //     // div, обертка поля - телефон из нашей формы
  //     var formGroupBox2 = $('.intlinput-field2').closest('.form-group');
  //     // див help-block для показа сообщений об ошибке в поле телефон
  //     var errorMsg2 = formGroupBox2.children('.help-block')[0];

  //     // инициализируем плагин международных телефонных номеров
  //     var iti2 = {};
  //     // если по условию нужна только определенная страна
  //     if ($(intlInputEl2).attr('data-conly') == 'yes') {

  //         iti2 = window.intlTelInput(intlInputEl2, {
  //             separateDialCode: true,
  //             onlyCountries: [diCode],
  //             initialCountry: diCode,
  //             utilsScript: "/js/utils.js",
  //             formatOnDisplay: true
  //         });
  //     }
  //     // иначе инициализируем со всемя странами
  //     else {
  //         // если страна Германия то по дефолту маска De, если любая другая то - It
  //         if (siteLang == 'de') {
  //             diCode = 'de';
  //         }
  //         else {
  //             if (siteDomen == 'www.myarredofamily.com') {
  //                 diCode = 'us';
  //             }
  //             else if (siteDomen == 'www.myarredo.kz') {
  //                 diCode = 'kz';
  //             }
  //             else {
  //                 diCode = 'it';
  //             }
  //         }
  //         iti2 = window.intlTelInput(intlInputEl2, {
  //             separateDialCode: true,
  //             initialCountry: diCode,
  //             utilsScript: "/js/utils.js",
  //             formatOnDisplay: true
  //         });
  //     }

  //     // создаем функцию - сброса
  //     var reset2 = function() {

  //         intlInputEl2.classList.remove("error");
  //         errorMsg2.innerHTML = "";
  //         if (iti2.isValidNumber()) {
  //             errorMsg2.classList.add("hide");
  //             formGroupBox2[0].classList.remove("has-error");
  //             formGroupBox2[0].classList.add("has-success");
  //         }
  //         else {
  //             errorMsg2.classList.remove("hide");
  //             var errorCode = iti2.getValidationError();
  //             errorMsg2.innerHTML = errorMap[errorCode];
  //             formGroupBox2[0].classList.remove("has-success");
  //             formGroupBox2[0].classList.add("has-error");
  //             intlInputEl2.setAttribute('aria-invalid', true);
  //         }
  //       };

  //       // on blur: validate
  //       intlInputEl2.addEventListener('blur', function() {
  //         reset2();
  //         if (intlInputEl2.value.trim()) {
  //           if (!iti2.isValidNumber()) {
  //               setTimeout(function() {
  //                 intlInputEl2.classList.add("error");
  //                 var errorCode = iti2.getValidationError();
  //                 errorMsg2.innerHTML = errorMap[errorCode];
  //                 errorMsg2.classList.remove("hide");
  //                 formGroupBox2[0].classList.remove("has-success");
  //                 formGroupBox2[0].classList.add("has-error");
  //                 intlInputEl2.setAttribute('aria-invalid', true);
  //               }, 500);
  //           }
  //         }
  //       });

  //       // on keyup / change flag: reset
  //       intlInputEl2.addEventListener('change', reset2);
  //       intlInputEl2.addEventListener('keyup', reset2);

  //     //   Валидация номера телефона при отправке формы
  //     $(intlInputEl2).closest('form').on('beforeSubmit', function(ev) {
  //         // если номер телефона не валидный
  //         if (!iti2.isValidNumber()) {
  //             setTimeout(function() {
  //                 intlInputEl2.setAttribute('aria-invalid', true);
  //                 var errorCode = iti2.getValidationError();
  //                 errorMsg2.innerHTML = errorMap[errorCode];
  //                 errorMsg2.classList.remove("hide");
  //                 formGroupBox2[0].classList.remove("has-success");
  //                 formGroupBox2[0].classList.add("has-error");
  //             },300);
  //             return false;
  //         }
  //         else {
  //             if ($(this).find('.intlinput-field2').val() != iti2.getNumber()) {
  //                 $(this).find('.intlinput-field2').val(iti2.getNumber());
  //             }
  //             var countryData = iti2.getSelectedCountryData();
  //             $(this).find('name="CartCustomerForm[country_code]"').val(countryData.iso2);
  //         }
  //     });
  // }

  // Функционал для открития фильтров по дефолту
  (function () {
    setTimeout(function () {
      if ($('.filters').length > 0) {
        // Запускаем цыкл по всем элементам всех фильтров
        $('.filters')
            .find('.one-filter')
            .find('.list-item')
            .children('a')
            .each(function (i, elem) {
              // Если обнаруживаем выбраный элемент в фильтре
              if ($(elem).hasClass('selected')) {
                // оставляем фильтр открытым
                $(elem).closest('.one-filter').addClass('open');
              }
            });
      }
    }, 800);
  })();

  // ===Custom Galery Image Viewer - кастомный просмотрщик фото для страницы товара
  // Закрыть просмотрщик
  $('.btn-igalery-close').click(function () {
    $(this)
        .parent('.igalery-close')
        .siblings('.igallery-images')
        .children('.scrollwrap')
        .children()
        .remove();
    $(this).closest('.custom-image-gallery').removeClass('open');
    $('main').removeClass('thispos');
  });
  // *Открыть просмотрщик
  // По клике на основное изображение
  $('.igalery')
      .find('.carousel-inner')
      .find('.fancyimage')
      .click(function () {
        // Только для экранов 1080 и больше
        if (window.screen.width >= 1080) {
          // Закрываем fancybox
          $.fancybox.close();
          // Получаем ссылку на активную картинку
          var thisHref = $(this).attr('href');
          // Собираем картинки для просмотрщика
          var images = [];
          $('#prod-slider')
              .children('.carousel-inner')
              .find('.fancyimage')
              .each(function (i, elem) {
                var imgPath = $(elem).attr('href');
                var imgAlt = $(elem).attr('data-alt');
                images.push({
                  path: imgPath,
                  alt: imgAlt,
                  active: thisHref == imgPath ? 1 : 0,
                });
              });
          // Рендерим верстку блока с изображениями
          var layout = '';
          for (var i = 0; i < images.length; i++) {
            var activeClas = images[i].active ? 'active' : '';
            layout +=
                '' +
                '<div class="igalery-item ' +
                activeClas +
                '">' +
                '<a href="' +
                images[i].path +
                '" target="_blank"><img src="' +
                images[i].path +
                '" alt="' +
                images[i].alt +
                '"></a>' +
                '</div>';
          }
          // Добавляем верстку в блок
          $('.scrollwrap').html(layout);
          // Добавляем класс для фикса z-index для этого проэкта
          $('main').addClass('thispos');
          // Открываем просмотрщик
          $('.custom-image-gallery').addClass('open');
          // Прокручиваем блок до активной картинки (по которой кликнули)
          var ofsetActivePos = $('.scrollwrap').children(
              '.igalery-item.active'
          )[0].offsetTop;
          $('.scrollwrap').animate(
              {
                scrollTop: ofsetActivePos - 20,
              },
              300
          );
        }
      });
  // По клику на изображение превью
  $('.igalery')
      .find('.carousel-indicators')
      .find('.thumb-item')
      .children('img')
      .click(function () {
        // Только для экранов 1080 и больше
        if (window.screen.width >= 1080) {
          // Получаем ссылку на активную картинку
          var thisHref = $(this).attr('src');
          // Собираем картинки для просмотрщика
          var images = [];
          $('#prod-slider')
              .children('.carousel-inner')
              .find('.fancyimage')
              .each(function (i, elem) {
                var imgPath = $(elem).attr('href');
                var imgAlt = $(elem).attr('data-alt');
                images.push({
                  path: imgPath,
                  alt: imgAlt,
                  active: thisHref == imgPath ? 1 : 0,
                });
              });
          // Рендерим верстку блока с изображениями
          var layout = '';
          for (var i = 0; i < images.length; i++) {
            var activeClas = images[i].active ? 'active' : '';
            layout +=
                '' +
                '<div class="igalery-item ' +
                activeClas +
                '">' +
                '<a href="' +
                images[i].path +
                '" target="_blank"><img src="' +
                images[i].path +
                '" alt="' +
                images[i].alt +
                '"></a>' +
                '</div>';
          }
          // Добавляем верстку в блок
          $('.scrollwrap').html(layout);
          // Добавляем класс для фикса z-index для этого проэкта
          $('main').addClass('thispos');
          // Открываем просмотрщик
          $('.custom-image-gallery').addClass('open');
          // Прокручиваем блок до активной картинки (по которой кликнули)
          var ofsetActivePos = $('.scrollwrap').children(
              '.igalery-item.active'
          )[0].offsetTop;
          $('.scrollwrap').animate(
              {
                scrollTop: ofsetActivePos - 20,
              },
              300
          );
        }
      });
  // ===end Custom Galery Image Viewer

  // Форма обратной связи
  $(document).on(
      'click',
      '.btn-feedback, .feedback-container, .block-rightbox-text>a',
      function () {
        var thisUrl = $('.jsftr').attr('data-url');
        $.ajax({
          type: 'POST',
          url: thisUrl,
          data: {
            _csrf: $('#token').val(),
          },
          success: function (resp) {
            $('#ajaxFormFeedbackModal').html(resp.html);
            interPhoneInit();
            $('#ajaxFormFeedbackModal').modal();
            setTimeout(function () {
              feedbackFormElInit();
            }, 100);
          },
          error: function (err) {
            console.log(err.statusText);
          },
        });
      }
  );

  // Ajax Форма
  $(document).on('click', '.btn-request-find-product', function () {
    var thisUrl = $(this).attr('data-url');
    $.ajax({
      type: 'POST',
      url: thisUrl,
      data: {
        _csrf: $('#token').val(),
      },
      success: function (resp) {
        $('#myModal').html(resp.html);
        interPhoneInit('#formfindproduct-phone');
        $('#myModal').modal();
      },
      error: function (err) {
        console.log(err.statusText);
      },
    });
  });
});


// Vue js Code
// Код Vue js для мобильного меню (желательно его держать в конце файла)
// console.time('speed mobile menu vue js');
Vue.component('mob-menu-list', {
  data: function () {
    return {
      mobdata: mobMenuData,
    };
  },
  methods: {
    openTwolevel: function (item) {
      item = !item;
      if (item) {
        if (window.pageYOffset > 120) {
          // window.scrollTo(pageXOffset, 0);
          var el = document.getElementsByClassName('mobile-header');
          setTimeout(function () {
            el[0].scrollIntoView({ behavior: 'smooth' });
          }, 550);
        }
      }

      return item;
    },
  },
  template: `<ul class="menu-list navigation">
        <li v-for="oneItem in mobdata.menulist" v-if="oneItem.show" v-bind:class="{jshaslist : oneItem.levelisset}">
            <a v-on:click="oneItem.levelopen = !oneItem.levelopen"
            v-bind:class="{open: oneItem.levelopen}"
            v-if="oneItem.levelisset"
            href="javascript:void(0);">
                {{ oneItem.text }}
            </a>
            <a v-else v-bind:href=oneItem.link>{{ oneItem.text }}</a>

            <div v-if="oneItem.levelisset" class="list-levelbox">

                <ul v-show="oneItem.levelopen" class="list-level">
                    <li v-for="twoLevel in oneItem.levelData" v-bind:class="{open: twoLevel.lopen}">
                        <a v-bind:href=twoLevel.llink 
                        v-on:click="twoLevel.lopen = openTwolevel(twoLevel.lopen)">

                            <div class="img-cont">
                                <img v-bind:src=twoLevel.limglink alt="" width="26px" height="20px">
                            </div>
                            <span class="for-mobm-text">{{ twoLevel.ltext }}</span>
                            <span class="count">{{ twoLevel.lcount }}</span>
                        </a>
                        <transition name="slidemenu">
                            `+/*<ul class="three-llist" v-show="twoLevel.lopen">
                                <li class="tl-panel">
                                    <button v-on:click="twoLevel.lopen = !twoLevel.lopen" class="btn-mobitem-close">
                                        <i class="fa fa-angle-left" aria-hidden="true"></i>
                                        <span class="for-onelevel-text">
                                            {{ oneItem.text }}
                                        </span>
                                        <span class="for-twolevel-text">
                                            {{ twoLevel.ltext }}
                                        </span>
                                    </button>
                                </li>
                                <li v-for="threelev in twoLevel.ldata">
                                    <a v-bind:href=threelev.link>{{ threelev.text }}</a>
                                </li>
                                <li>
                                    <a v-bind:href=twoLevel.llink class="viewall-link">{{ mobdata.transtexts.allwiewText }}</a>
                                </li>
                            </ul>*/
                        +`</transition>
                    </li>
                </ul>

            </div>

        </li>
    </ul>`,
});

// Vue init
new Vue({
  el: '#mob_menu_list',
});
// console.timeEnd('speed mobile menu vue js');
// end Vue js code
