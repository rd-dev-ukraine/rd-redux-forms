# Motivation

Easy create forms with complex validation behaviour.
Reduce an amount of boilerplate code.
Easy integrate external validators.

# Concepts

* Configure object for form and use it anywhere in application
* Form object provides action creators, reducers and selectors.
* Mount form state at place at app state you like.
* App state stores minimal data. All derived data obtained with selector.
* Parses form to an object with data type conversion.
  Provides parsing errors for each field.
* No built-in validation. 
  Instead catch VALIDATE action in middleware, call your own (either sync or async) validaiton 
  and then dispatch SET_ERRORS action.
  Validation errors (if any) will be displayed in form.

# Main concepts

`rd-redux-forms` library is created for perform these tasks:

* Creates a form definition object describes a shape of data and use it for 
  link a form with state and with UI.

* Support value formatting and input parsing:
  
  Usually a values edit as strings but needs to be converted into different types:
  numbers, dates, etc. 
  `rd-redux-forms` library supports value parsing and formatting:
  value is parsed on certain conditions (for example, on blur) and if parsing is successfull,
  value then formatted back to string and input updated.

  This supports user-friendly UX: value is displayed in conveniend easy-readable way but
  due editing value can be entered in most convenient way.

  For example numbers can be displayed with thousands separators and with two decimals 
  but edited like a row of digits.

* Get a cleaned-up data can be sent to server.

  Usually underlying form data contains not only strings but numbers, dates, boolean values etc.
  `rd-redux-forms` allows to easy get a clean object with converted types.

* Gentle unobtrusive validation.

  Unlike many forms libraries, `rd-redux-forms` doesn't provide many built-in validation rules.
  Library itself only validates if user input can be correctly parsed. 
  Validation rules must be attached separately.

  Also it is easy to add own validation errors to the form, for example in response to 
  server-side validation errors.

* Add support for complex UX: indicate valid and invalid form field states, 
  dismiss error feedback on field editing, hide validation errors until first submit etc.

* Easy binding to the react markup: use property spread syntax to attach event handlers to inputs and form itself.
  After this form behavior can be changed without changing markup.

* Support editors which works with objects: for example date picker may 
   use `Date` as type of the value. `rd-redux-forms` can work with that value directly 
   without changing it from/to string.

* Easy to fine tune. Almost all things could be done manually easily, so you could 
  programmaticaly control form; edit, validate, format, submit and reset a data.

* Minimalistic state. Prefer computations over storaging, state stores 
   * Changed field values
   * Set of fields were formatted or validated
   * Server-side errors
   * A flag indicates whether form was submitted.

   All other data are computed: formatted and parsed values, field visual state, form validity etc.

   `rd-redux-forms` doesn't require copying of initial object data into a state before starting editing.
   You would need an original object and library applies you changes over this original object.

* Supports for complex scenarios: editing a set of objects with a single form definition, 
  writing custom formatters and parsers, dynamic form behavior etc.

  

# Structure

Configuration <-> Usage

Configuration:

```
/** Create a form. Title will be shown in redux tools */
const myForm = createForm("my form title", formConfig);
```

Usage

```
    combineReducers({
        ...
        myForm: myForm.reducer
    })
```



```
connect(s => {
    const formData = myForm.selectors.editInfo( s.myForm);

    return formData;
}, {
    onSubmit: myForm.actions.validate,
    onFieldEdit: fieldaName => myForm.actions.fieldEdit(fieldName)
})(<form onSubmit={this.props.onSubmit}><input onChange={e => this.props.onFieldEdit("name")} value={this.props.formData.data.name.value} />
<button type="submit" disabled={!this.props.formData.isValid}>Save</button> </form>)
```


