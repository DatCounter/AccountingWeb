$(document).ready(function () {
  //scrolling enable
  scrollingEnable();
  //modal window enable
  modalWindowEnable();
  modalWindowRequering();
  //services enable
  serviceSwithcer();
  //mask enable for phone
  $('#phone').inputmask('+7(999)999-99-99', {
    placeholder: '+7(___)___-__-__',
    translation: {
      r: {
        pattern: /[^\d+$]/,
        fallback: '/',
      },
    },
  });
  var elements = $('.element');

  for (let i = 0; i < elements.length; i++) {
    elements[i].addEventListener('click', elementSwithcer);
  }
});

function modalWindowEnable() {
  var buttons = $('.button__base');
  var modalWindow = $('.modal__contact');

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      if ($(modalWindow).css('display') === 'none') {
        $(modalWindow).css('display', 'block');
        setTimeout(function () {
          $(modalWindow).css('opacity', '1');
        }, 50);
      }
    });
  }
  window.onclick = function (event) {
    if (event.target == modalWindow[0]) {
      $(modalWindow).css('opacity', '0');
      setTimeout(function () {
        $(modalWindow).css('display', 'none');
      }, 500);
    }
  };
}

function modalWindowRequering() {
  $('#typePhone').prop('checked', true);
  var items = [];
  items[0] = $('.email input');
  items[1] = $('.phone input');
  var button = $('.submit__button');

  button[0].addEventListener('click', function () {
    for (let i = 0; i < items.length; i++) {
      $(items[i]).removeAttr('required');
    }
    if ($('#typeEmail').prop('checked')) {
      $(items[0]).attr('required', true);
    } else {
      items[1].attr('required', true);
    }
  });
}

function scrollingEnable() {
  var items = $('.options__item');

  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener('click', function (e) {
      e.preventDefault();

      var anchor = $(this).attr('data');
      var item = $(anchor);
      $('html, body')
        .stop()
        .animate(
          {
            scrollTop: $(item).offset().top,
          },
          1000
        );
    });
  }

  $(window).scroll(function (e) {
    $(window).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function (event) {
      offsetWindow = $(window).scrollTop() + 5;
      items[0] = $('header');
      items[1] = $('#services');
      items[2] = $('#about_us');
      delta = parseInt(event.originalEvent.wheelDelta || -event.originalEvent.detail);

      e.preventDefault();
      if ($(items[0]).offset().top <= offsetWindow && offsetWindow <= items[1].offset().top) {
        if (delta < 0) {
          $('html, body')
            .stop()
            .animate(
              {
                scrollTop: $(items[1]).offset().top,
              },
              300
            );
        }
      } else if (
        $(items[1]).offset().top <= offsetWindow &&
        offsetWindow <= items[2].offset().top
      ) {
        if (delta >= 0) {
          $('html, body')
            .stop()
            .animate(
              {
                scrollTop: $(items[0]).offset().top,
              },
              400
            );
        } else {
          $('html, body')
            .stop()
            .animate(
              {
                scrollTop: $(items[2]).offset().top,
              },
              300
            );
        }
      } else if ($(items[2]).offset().top < offsetWindow) {
        if (delta >= 0) {
          $('html, body')
            .stop()
            .animate(
              {
                scrollTop: $(items[1]).offset().top,
              },
              400
            );
        }
      }
    });
  });
}

function sortLogicForServices() {
  var services = servicesSort();
  if ($(this).hasClass('left')) {
    $(services[0]).removeClass('item__left');
    $(services[1]).removeClass('item__center');
    $(services[2]).removeClass('item__right');

    $(services[0]).addClass('item__right');
    $(services[1]).addClass('item__left');
    $(services[2]).addClass('item__center');
  } else if ($(this).hasClass('right')) {
    $(services[0]).removeClass('item__left');
    $(services[1]).removeClass('item__center');
    $(services[2]).removeClass('item__right');

    $(services[0]).addClass('item__center');
    $(services[1]).addClass('item__right');
    $(services[2]).addClass('item__left');
  }
}

function serviceSwithcer() {
  var arrows = $('.arrow__ellipse');

  for (let i = 0; i < arrows.length; i++) {
    arrows[i].addEventListener('click', sortLogicForServices);
  }
}

//left to right
function servicesSort() {
  var services = $('.section__item');
  var sortedServices = [];

  for (let i = 0; i < services.length; i++) {
    if ($(services[i]).hasClass('item__left')) {
      sortedServices[0] = services[i];
    } else if ($(services[i]).hasClass('item__center')) {
      sortedServices[1] = services[i];
    } else if ($(services[i]).hasClass('item__right')) {
      sortedServices[2] = services[i];
    }
  }

  return sortedServices;
}

function elementSwithcer() {
  var elements = $('.element');

  if ($(this).hasClass('element-switched')) {
    $(this).removeClass('element-switched');
  } else {
    for (let i = 0; i < elements.length; i++) {
      $(elements[i]).removeClass('element-switched');
    }

    $(this).addClass('element-switched');
  }
}
