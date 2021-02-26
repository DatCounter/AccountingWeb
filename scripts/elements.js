$(document).ready(function() {
    serviceSwithcer();
    var elements = $(".element");

    for (let i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', elementSwithcer);
    }
});

function sortLogicForServices() {
    var services = servicesSort();
    if ($(this).hasClass("left")) {
        $(services[0]).removeClass("item__left");
        $(services[1]).removeClass("item__center");
        $(services[2]).removeClass("item__right");
        
        $(services[0]).addClass("item__right");
        $(services[1]).addClass("item__left");
        $(services[2]).addClass("item__center");
    } else if ($(this).hasClass("right")) {
        $(services[0]).removeClass("item__left");
        $(services[1]).removeClass("item__center");
        $(services[2]).removeClass("item__right");

        $(services[0]).addClass("item__center");
        $(services[1]).addClass("item__right");
        $(services[2]).addClass("item__left");
    }
}

function serviceSwithcer() {
    var arrows = $(".arrow__ellipse");

    for (let i = 0; i < arrows.length; i++) {
        arrows[i].addEventListener('click', sortLogicForServices)
    }
}

//left to right
function servicesSort() {
    var services = $(".section__item");
    var sortedServices = [];

    for (let i = 0; i < services.length; i++) {
        if ($(services[i]).hasClass("item__left")) {
            sortedServices[0] = services[i];
        } else if ($(services[i]).hasClass("item__center")) {
            sortedServices[1] = services[i];
        } else if ($(services[i]).hasClass("item__right")) {
            sortedServices[2] = services[i];
        }
    }
    
    return sortedServices;
}

function elementSwithcer() {
    var elements = $(".element");

    if ($(this).hasClass("element-switched")) {
        $(this).removeClass("element-switched");
    } else {
        for (let i = 0; i < elements.length; i++) {
            $(elements[i]).removeClass("element-switched");
        }

        $(this).addClass("element-switched");
    }
}