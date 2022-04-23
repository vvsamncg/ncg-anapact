const DynamicFieldType = {
    CHECK_BOX: 'checkbox',
    DATE: 'date',
    TEXT: 'textboxField',
    TEXT_AREA: 'textareaField',
    RADIO_BTN: 'rb',
    BUTTON_FIELD: 'buttonField',
    HYPERLINK: 'hyperLinkField'
}

const MetaFieldType = {
    TEXT: 'Text',
    TEXT_AREA: 'Text Area',
    DATE: 'Date',
    DATE_TIME: 'Date/Time',
    DECIMAL: 'Decimal',
    EMAIL: 'Email Address',
    PHONE: 'Phone Number',
    CHECK_BOX: 'Checkbox (Boolean)',
    PERCENT: 'Percent',
    INTEGER: 'Integer',
    LIST: 'List Record'
}

const isValidEmailAddress = (email) => {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
const isValidAlphanumericWithoutSpace = (value)  =>{
    var regex = /^[0-9a-zA-Z]+$/;
    return regex.test(value);
}
const isValidString=(value)  =>{
    var regex = /^[ A-Za-z0-9+@#_$%()&:.!^*?,<>-]*$/;
    return regex.test(value);
}

const isDecimal=(value)  =>{
    var regex = /^(\d*)?\.\d+$/;
    return regex.test(value);
}
const isInteger=(value)  =>{
    var regex = /^[-+]?\d+$/;
    return regex.test(value);
}
const isPercentage=(value)  =>{
    var regex = /^[1-9][0-9]?$|^100$/;
    return regex.test(value);
}
const isDate=(value)  =>{
    var regex = /^((((([13578])|(1[0-2]))[\-\/\s]?(([1-9])|([1-2][0-9])|(3[01])))|((([469])|(11))[\-\/\s]?(([1-9])|([1-2][0-9])|(30)))|(2[\-\/\s]?(([1-9])|([1-2][0-9]))))[\-\/\s]?\d{4})$/;
    return regex.test(value);
}
const isDateTime=(value) => {
    //var regex = /^((((([13578])|(1[0-2]))[\-\/\s]?(([1-9])|([1-2][0-9])|(3[01])))|((([469])|(11))[\-\/\s]?(([1-9])|([1-2][0-9])|(30)))|(2[\-\/\s]?(([1-9])|([1-2][0-9]))))[\-\/\s]?\d{4})(\s((([1-9])|(1[02]))\:([0-5][0-9])((\s)|(\:([0-5][0-9])\s))([AM|PM|am|pm]{2,2})))?$/; ///^(\d{4})-(\d{2})-(\d{2})$/;
    var regex = /^((((([13578])|(1[0-2]))[\-\/\s]?(([1-9])|([1-2][0-9])|(3[01])))|((([469])|(11))[\-\/\s]?(([1-9])|([1-2][0-9])|(30)))|(2[\-\/\s]?(([1-9])|([1-2][0-9]))))[\-\/\s]?\d{4}\s((([1-9])|(1[02]))\:([0-5][0-9])((\s)|(\:([0-5][0-9])\s))([AM|PM|am|pm]{2,2})))?$/;
    return regex.test(value);
}
const isPhoneNumber=(value)  =>{
    var regex = /^([0-9]( |-)?)?(\(?[0-9]{3}\)?|[0-9]{3})( |-)?([0-9]{3}( |-)?[0-9]{4}|[0-9]{7})$/;
    return regex.test(value);
}
const formatPhoneNumber = (str) => {
    var result = "";
    for (i = 0; i < str.length; i++) {
        var input = str.charAt(i);
        if (i == 0) {
            input = "(" + input;
        }
        if (i == 3) {
            input = ") " + input;
        }
        if (i == 6) {
            input = "-" + input;
        }
        result = result + input
    }
    if (result == "") {
        result = str;
    }
    return result;
}

const validateField = (fieldType, fieldValue, fieldTagging) => {
    if(fieldTagging == "dynamicfield") {
        switch (fieldType) {
            case DynamicFieldType.DATE:
                return isDate(fieldValue)
                break;
            case DynamicFieldType.TEXT:
                return true;
                break;
            case DynamicFieldType.TEXT_AREA:
                return true;
                break;
            default:
                return true;
        }
    } else {
        switch (fieldType) {
            case MetaFieldType.TEXT:
                return true;
                break;
            case MetaFieldType.TEXT_AREA:
                return true;
                break;
            case MetaFieldType.DATE:
                return isDate(fieldValue);
                break;
            case MetaFieldType.DECIMAL:
                return isDecimal(fieldValue);
                break;
            case MetaFieldType.DATE_TIME:
                return isDateTime(fieldValue);
                break;
            case MetaFieldType.EMAIL:
                return isValidEmailAddress(fieldValue);
                break;
            case MetaFieldType.PHONE:
                return isPhoneNumber(fieldValue);
                break;
            case MetaFieldType.PERCENT:
                return isPercentage(fieldValue);
                break;
            case MetaFieldType.INTEGER:
                return isInteger(fieldValue);
                break;
            case MetaFieldType.PHONE:
                return isInteger(fieldValue);
                break;
            default:
                return true;
        }
    }
}

const setValue = (fieldType, fieldName, fieldValue) => {
    var fl = '#'+fieldName;

    switch (fieldType) {
        case DynamicFieldType.DATE:
        case DynamicFieldType.TEXT:
            jQuery(fl).val(fieldValue)
            break;
        case DynamicFieldType.TEXT_AREA:
            return true;
            break;

        case DynamicFieldType.CHECK_BOX:
            jQuery(fl).prop("checked", fieldValue);
            break;

        case DynamicFieldType.HYPERLINK:
            jQuery(fl).attr("href", fieldValue)
            break;
        default:
            return true;
    }
}


