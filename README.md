# validate.js
Thin jquery plugin for easy form validation. It is inspired to be small,
intuitive and extensible. 


## Implementation
Simply enumerate validation types in the element's "validate" data attribute.
They are processed in order. It will toggle `valid`, `invalid` classes,
so CSS can target with appropriate styles. On error, the error message will
appear as `<label class="error">Message</label>`.

```
<form>
    <input type="text" data-validate="required,email" />
</form>

<script>
    $('form').ezForms.init();
</script>
```

Custom error messages can be added as a separate data attribute.
`data-error-message="Custom message here"`

Toggle disabled on the submit button is turned-on by default. To disable,
simply add the data attribute.
`data-never-disabled="true"`


## Validations
- required
- digits
- phoneNumber
- email
- credit-card
- cvv
- zipcode
- date
- alphanumeric
- mustBeOlderThan (checks age in `data-older-than` to be past threshold)
- matchTo (validates equality to `data-match-to` DOM node)

## Extensibility
This plugin was designed to ship with bare necessities while being
easily extensible. Simply add a new validation rule to the VALIDATORS
object, and add it to the DOM node's data attribute. That's it!
<script>
    var key = "new-rule";
    EzForms.VALIDATORS[key] = function(value) {
        return value === 'new-rule';
    };
</script>
```
