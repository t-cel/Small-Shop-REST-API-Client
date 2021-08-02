const isNumeric = (str) => {
  if (typeof str != "string") return false;

  if(!isNaN(str)) {
      const asFloat = parseFloat(str);
      return asFloat >= 0.0 && !isNaN(parseFloat(str));
  }
}

// constraint validators

const NotEmptyFieldValidator = (field) => {
  return field ? true : false;
}

const IsNumFieldValidator = (field) => {
  return isNumeric(field);
}

const NotExceedMaxLenValidator = (field, maxLen) => {
  return field.length <= maxLen;
}

const NumericValueBiggerValidator = (field, minVal) => {
  return Number.parseFloat(field) >= minVal;
}

const NumericValueSmallerValidator = (field, maxVal) => {
  return Number.parseFloat(field) <= maxVal;
}

export function FormValidator() {
  this.validators = [
    // constraint name, validate function 
    { name: "notEmpty",    validate: (field, constraints) => NotEmptyFieldValidator(field)                                 },     
    { name: "numbersOnly", validate: (field, constraints) => IsNumFieldValidator(field)                                    },     
    { name: "maxLen",      validate: (field, constraints) => NotExceedMaxLenValidator(field, constraints.maxLen.value)     },     
    { name: "maxVal",      validate: (field, constraints) => NumericValueSmallerValidator(field, constraints.maxVal.value) },     
    { name: "minVal",      validate: (field, constraints) => NumericValueBiggerValidator(field, constraints.minVal.value)  },     
  ];

  this.validate = function(fieldsConstraints, fields, errors) {
    if(fields.length != fieldsConstraints.length)
      throw new Error("Count of fields to validate must be equal to validation rules count");

    let formIsValid = true;
    for(let fieldIndex in fields) {
      const field = fields[fieldIndex];
      const constraints = fieldsConstraints[fieldIndex].constraints;

      if(constraints["allowEmpty"] && !field)
        break;

      for(let validatorIndex in this.validators) {
        const validator = this.validators[validatorIndex];
        if(constraints[validator.name]) { 
          if(!validator.validate(field, constraints)) {
            errors[fieldsConstraints[fieldIndex].fieldName] = constraints[validator.name].errorMessage;
            formIsValid = false;
            break; //break on first error
          }
        }
      }
    }
    return formIsValid;
  }
}

export function ValidationConstraintBuilder() {
  this.constraints = {};
  
  this.setNotEmpty = function(errorMessage = "Cannot be empty") {
    this.constraints.notEmpty = { value: true, errorMessage: errorMessage };
    return this;
  };

  this.setAllowEmpty = function() {
    this.constraints.allowEmpty = { value: true };
    return this;  
  }

  this.setNumbersOnly = function(errorMessage = "Not a number") {
    this.constraints.numbersOnly = { value: true, errorMessage: errorMessage };
    return this;
  };

  this.setMaxLength = function(maxLen, errorMessage="Too long value") {
    this.constraints.maxLen = { value: maxLen, errorMessage: errorMessage };
    return this;
  };

  this.setMaxNumericValue = function(maxVal, errorMessage="Too big value") {
    this.constraints.maxVal = { value: maxVal, errorMessage: errorMessage };
    return this;
  };

  this.setMinNumericValue = function(minVal, errorMessage="Too small value") {
    this.constraints.minVal = { value: minVal, errorMessage: errorMessage };
    return this;
  };

  this.reset = function() {
    this.constraints = {};
    return this;
  };

  this.build = function() {
    return this.constraints;
  };
}