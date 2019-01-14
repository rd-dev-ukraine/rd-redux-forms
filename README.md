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
  due editing value can be entered in most convenient way. If parsing failed it is easy to display visual feedback to the user.

  For example numbers can be displayed with thousands separators and with two decimals
  but edited like a row of digits. _On starting editing value is converted to editable format and converted back to display format on editing end._

* Get a cleaned-up data can be sent to server.

  Usually underlying form data contains not only strings but numbers, dates, boolean values etc.
  `rd-redux-forms` allows to easy get a clean object with converted types.

* Gentle unobtrusive validation.

  Unlike many forms libraries, `rd-redux-forms` doesn't provide many built-in validation rules.
  Library itself only checks if user input can be correctly parsed.
  Validation rules must be attached separately.

  Also it is easy to add own validation errors to the form, for example in response to
  server-side validation errors.

* Add support for complex UX: indicate valid and invalid form field states,
  dismiss error feedback on field editing, hide validation errors until first submit etc.

* Easy binding to the react markup: use property spread syntax to attach event handlers to inputs and form itself.
  _After this form behavior can be changed without changing markup._

* Support editors which works with non-string values: for example date picker may
   use `Date` as type of the value. `rd-redux-forms` can pass that value directly to state.

* Easy to fine tune. Almost all things could be done manually easily, so you could
  programmaticaly control form: edit, validate, format, submit and reset a data on form or individual fields by dispatching an corresponding action.

* Minimalistic state. Prefer computations over storaging, state stores minimal amount of data:
   * Changed field values
   * Set of fields were formatted or validated
   * Server-side errors
   * A flag indicates whether form was submitted.

   All other data are computed: formatted and parsed values, field visual state, form validity etc.

   `rd-redux-forms` doesn't require copying of initial object data into a state before starting editing.
   You would need an original object and library applies you changes over this original object.

* Supports for complex scenarios: editing a set of objects with a single form definition,
  writing custom formatters and parsers, dynamic form behavior etc.

# Terms

* **form definition** - an object configured with fluent interface which represents a form.
  It defines field set, fields parsing and formatting rules.
  Also **form definition** provides a set of methods for getting underlying data, validating form etc.

  Form definition is created using fluent interface.

* **parsed data** - an object with new values of form fields.
  Also values will have a correct data types.
  **parsed data** are available for valid form only.

* **original object** - an object which are mean to be edit by the form.
  `rd-redux-form` stores only changes made in data, **original object** remains untouched.

* _**form binding** - an object defines how **form definition** connects to UI._
  _It defines an events when form value is changed, validated, formatted and when form is attempted to save it data._

* **form state** - a part of redux state which stores the form data.
  `rd-redux-forms` doesn't rely on certain places or conventions etc.,
  you should manually mount a **form definition** to some place at state as a regular reducer.
  Each **form definition** provides `myForm.reducer` method which you should use.

* **form selector** - a method called `myForm.selector` which accepts two parameters:
  * **form state** and object which data are editing.
    Method returns an object which many properties contains full information about a form:
    is form valid, for valid form it will contain **form data**
  * **orignal object** - an object which is editing by form. This object will still untouched due form editing.

  Form selector returns an object which contains full information about the form:
  * if form valid
  * **parsed data** for valid forms
  * a set of form's fields with info about each field: is field valid, visual state of the field, parsed and formatted value, if field was parsed successfully etc.

* **actions** - a regular `redux` actions which controls the form:
  edits, validates and formats fields; submit, reset form; set or remove validation errors etc.
  **actions** are POJO and can be dispatched either by **form binding** or manually.

* **field formatter, parser and _unformatter_** - a set of functions which transforms
  field value.
  * **parser** converts a value entered by user into a value can be send to server,
    usually by parsing it to certain type.
    Parser may return `undefined` if value can't be parsed.
    In this case field will be treated as invalid.
  * **formatter** converts a value into a form convenient for reading.
    Usually value is formatted when user ends editing and leaves the field.
    Only parsed values will be formatted, if value can't be parsed it remains unchanged as user enters it.
    NOTE: formatted value must be correctly parsed, otherwise further editing may require extra actions to get a valid value.
  * **unformatter** - optional function converts a value into a form convenient for editing.
    Usually value is unformatted when user activates a field.
    It may removes extra chars so less actions required for editing.


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


## Supported scenario

* Editing and validating input
    * with begin/end edit
    * immediately
* Editing raw values (pass values from/to editors without changes)
* 'Unformatting' input - convert value right before start editing