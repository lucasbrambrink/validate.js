/*
    Easy Form validation
*/

var EzForms = (function ($) {
    var STATES = Utils.STATES;
    var ERROR_LABEL = 'label.error';

    var setValidity = function(selector, isValid) {
        isValid
            ? $(selector)
                .removeClass(STATES.INVALID)
                .addClass(STATES.VALID)
            : $(selector)
                .removeClass(STATES.VALID)
                .addClass(STATES.INVALID);
    };

    var setNeutral = function (selector) {
        selector = selector || this;
        $(selector)
            .removeClass(STATES.VALID)
            .removeClass(STATES.INVALID)
            .siblings(ERROR_LABEL).remove();
    };

    var setInvalid = function (selector, msg) {
        var $element = $(selector);
        var $label = $element.siblings(ERROR_LABEL);
        if ($label.length === 0) {
            $label = $('<label class="error"></label>');
            $element.after($label);
        }
        var message = $element.data('error-message') || msg;
        $label.text(message);
        $element
            .removeClass(STATES.VALID)
            .addClass(STATES.INVALID)
            .on('change', function() {
                setNeutral(selector);
            });
    };

    var setValid = function(selector) {
        setNeutral(selector);
        $(selector).addClass(STATES.VALID);
    };

    var validateInput = function (element) {
        var $element = $(element);
        if (typeof $element.data('validate') === 'undefined') return;

        var value = $element.val();
        var keys = $element.data('validate').split(",");

        var validator, key, isValid;
        for (var i = 0; i < keys.length; i++) {
            key = keys[i].trim();
            validator = Utils.VALIDATORS[key];
            if (typeof validator === 'undefined' || validator === null) continue;

            switch (key) {
                case 'mustBeOlderThan':
                    isValid = validator.fn(value, $element.data('older-than'));
                    break;
                case 'matches':
                    isValid = validator.fn(value, $element.data('match-to'));
                    break;
                default:
                    isValid = validator.fn(value);
                    break;
            }
            isValid ? setValid(element)
                    : setInvalid(element, validator.message);
            if (!isValid) break;
        }
    };

    var formIsValid = function (form) {
        $(form)
            .find('[data-validate]')
            .map(function() {
                validateInput(this);
            });
        var formIsValid = $(form).find('.' + STATES.INVALID).length === 0;
        setValidity(form, formIsValid);
        return formIsValid;
    };

    var formIsComplete = function (form) {
        var requiredInputs = $(form)
            .find('[data-validate]')
            .filter(function() {
                return $(this).data('validate').indexOf('required') > -1;
            });
        for (var i = 0; i < requiredInputs.length; i++) {
            if (Utils.stringIsNullOrEmpty($(requiredInputs[i]).val())) {
                return false;
            }
        }
        return true;
    };

    var setSubmittable = function() {
        var isValid = formIsComplete(this) && formIsValid(this);
        setState(this, isValid);
        var $submit = $(this).find('[type=submit]');
        Utils.setDisabled($submit, !isValid);
    };

    var init = function (form) {
        var $form = $(form);
        $form
            .find('[data-validate]')
            .on('blur', function() {
                validateInput(this);
            });

        if ($form.data('never-disabled') !== 'true') {
            $form
                .ready(setSubmittable)
                .on('focus change', setSubmittable)
        }
        $form
            .on('submit',
                function(event) {
                    if (!formIsValid(form)) {
                        event.preventDefault();
                    }
                });

    };

    var initAll = function(selector) {
        $(selector)
            .map(function() {
                init(this);
            });
    };

    return {
        VALIDATORS: VALIDATORS,
        STATES: STATES,
        validateInput: validateInput,
        formIsValid: formIsValid,
        init: init,
        initAll: initAll
    }
})(jQuery);

(function($) {
    $.fn.ezForm = EzForms;
})(jQuery);