# Motivation

Easy create forms with complex validation behaviour.
Reduce an amount of boilerplate code.
Easy integrate external validators.

# Concepts

* Configure object for form and use it anywhere in application
* Form Object provides action creators, reducers and selectors.
* Mount form state at place at app state you like.
* App state stores minimal data. All derived data obtained with selector.
* Parses form to an object with data type conversion.
  Provides parsing errors for each field.
* No built-in validation. 
  Instead catch VALIDATE action in middleware, call your own (either sync or async) validaiton 
  and then dispatch SET_ERRORS action.
  Validation errors (if any) will be displayed in form.

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


