# validate.js
Thin jquery plugin for easy form validation. Inspired to be an
alternative to the relatively large client-side validation libraries
available that require loads of customizations to the way you want. 

Based on intuitive UI: validations fire when appropriate. Validating
too early (before the user has finished typing) is offensive;
validating too late (on submit) can annoyingly
reveal hidden surprises. Propagating the change from invalid to valid
immediately provides a nicer user experience.

It can be loaded asynchronously without a hitch.


## Implementation
Simply enumerate validation types in the element's "validate" data attribute.
They are processed in order. 

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
