jQuery.validator.addMethod("phone", function(phone_number, element) {
    if (phone_number == '')
        return true;
    return !!phone_number.match(/^\+[0-9\s]{8,20}$/);
}, 'Неверный номер телефона');

jQuery.validator.addMethod("float", function(number, element) {
    if (number == '')
        return true;
    return !!number.match(/^[0-9]{1,20}(\.[0-9]{1,2})?$/);
}, 'Неверное число');