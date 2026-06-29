var baseUrl = $("base").attr("href");

/**
 * Кнопка запросить цену
 */
$('.ajax-request-price').on('click', function () {
    var product_id = $(this).data('id'),
        count = 1;

    $.post(
        baseUrl + 'shop/cart/add-to-cart/',
        {
            _csrf: $('#token').val(),
            id: product_id,
            count: count,
            flag: 'request-price'
        }
    ).done(function (data) {
        if (data == true) {
            refresh_full_cart();

            $.post(
                baseUrl + 'shop/widget/ajax-request-price-popup/',
                {
                    _csrf: $('#token').val(),
                    view: 'full_old'
                }
            ).done(function (data) {
                if (data.success) {
                    $('#myModal').html(data.view);
                    interPhoneInit();
                    $('#myModal').modal();
                }
            });
        }
    });

    return false;
});

/**
 * отложить в блокнот на странице товара
 */
$('.add-to-notepad-product').on('click', function () {
    var product_id = $(this).data('id');
    add_to_cart(product_id, 1);
});

/**
 * кнопка отложить в блокнот
 */
$('.add-to-notepad').on('click', function () {
    var product_id = $(this).data('id');
    var ourElem = $(this);
    var noteBok = $('.header').find('.my-notebook').find('.for-price').text();
    var donedText = ourElem.attr('data-doned');
    if (!$(this).hasClass('doned')) {
        add_to_popup(product_id);
        $(this).addClass('doned');
        ourElem.attr('title', donedText);
        setTimeout(function () {
            ourElem.removeAttr('data-toggle');
            $('.header').find('.my-notebook').find('.for-price').text(+noteBok + 1);
            $('.mobmenu-wishlistbox').find('.for-price').text(+noteBok + 1);
        }, 400);
    }
    else {
        return false;
    }
});

/**
 * добавление в попап корзину
 */
function add_to_popup(id, count) {
    count = count || 1;

    $.post(
        baseUrl + 'shop/cart/add-to-cart/',
        {
            _csrf: $('#token').val(),
            id: id,
            count: count
        }
    ).done(function (data) {
        if (data == true) {
            refresh_popup_cart();
        }
    });
}

/**
 * добавление в корзину
 */
function add_to_cart(id, count) {
    count = count || 1;

    $.post(
        baseUrl + 'shop/cart/add-to-cart/',
        {
            _csrf: $('#token').val(),
            id: id,
            count: count
        }
    ).done(function (data) {
        if (data == true) {
            refresh_full_cart();
        }
    });
}

/**
 * удаление елемента из попапа корзины
 */
function delete_from_popup(id, count) {
    count = count || 0;
    $.post(
        baseUrl + 'shop/cart/delete-from-cart/',
        {
            _csrf: $('#token').val(),
            product_id: id,
            count: count
        }
    ).done(function (data) {
        if (data) {
            refresh_popup_cart();
        }
    });
}

/**
 * удаление елемента из корзины
 */
function delete_from_cart(id, count) {
    count = count || 0;
    $.post(
        baseUrl + 'shop/cart/delete-from-cart/',
        {
            _csrf: $('#token').val(),
            product_id: id,
            count: count
        }
    ).done(function (data) {
        if (data) {
            refresh_full_cart();
        }
    });
}

/**
 * изменение количества елемента в корзины
 */
function change_count_cart_item(id, value, count) {
    if (isNumeric(value)) {
        var f_count = (count - value);

        if (f_count != 0 && f_count > 0) {
            delete_from_cart(id, f_count);
        } else if (f_count != 0 && f_count < 0) {
            add_to_cart(id, -f_count);
        }
    }
}

/**
 * изменение количества елемента в попапе корзины
 */
function change_count_cart_popup_item(id, value, count) {
    var value = +value;
    if (isNumeric(value)) {
        var f_count = (count - value);
        if (f_count != 0 && f_count > 0) {
            delete_from_popup(id, f_count);
        } else if (f_count != 0 && f_count < 0) {
            add_to_popup(id, -f_count);
        }
    }
}

/**
 * Refresh popup
 */
function refresh_popup_cart() {
    $.post(
        baseUrl + 'shop/widget/',
        {
            _csrf: $('#token').val(),
            view: 'full_popup_old'
        }
    ).done(function (data) {
        if (data.success) {
            $('#short_cart').html(data.views.short);
            $('#myModal').html(data.view);
            var obj = $('.prod-card-page').find('.add-to-notepad');
            obj.html(obj.data('message'));
            $('#myModal').modal();
        }
    });
}

/**
 * Refresh
 */
function refresh_full_cart() {
    $.post(
        baseUrl + 'shop/widget/',
        {
            _csrf: $('#token').val(),
            view: 'full_old'
        }
    ).done(function (data) {
        if (data.success) {
            $('#short_cart').html(data.views.short);
            $('.basket-items').html(data.view);
        }
    });
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// Ajax status switcher
$('.ajax-status-switcher').on('click', function () {

    var obj = this;

    jQuery.ajax({
        'url': $(obj).data('url'),
        'cache': false,
        'data': {
            id: $(obj).data('id'),
        },
        success: function (data) {
            var switches = $(obj).parent().find('.ajax-status-switcher');
            //console.log($(obj).parent(), switches);
            switches.each(function () {
                var style = $(this).css('display');
                //console.log(style);
                $(this).css('display', style == 'inline' ? 'none' : 'inline');
            });
        },
        error: function (err) {
            //console.log(err);
        }
    });
});
