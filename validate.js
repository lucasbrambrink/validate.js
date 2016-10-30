/*
    Easy Form validation
*/

var EzForms = (function ($) {
    var STATES = Utils.STATES;

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
            isValid ? Utils.setValid(element)
                    : Utils.setInvalid(element, validator.message);
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
        Utils.setState(form, formIsValid);
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
        Utils.setSubmittable(this, isValid);
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
    $.fn.ezForm = function () {
        return EzForms;
    }
})(jQuery);