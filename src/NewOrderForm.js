import React, { useState } from 'react';

import { 
    createOrder,
    createProduct
} from './api';

import { Link } from 'react-router-dom';
import { FormValidator, ValidationConstraintBuilder } from './FormValidator';
import { TextInput } from './Inputs';

const NewOrderForm = (props) => {
    const [fields, setFields] = useState({});
    const [errors, setErrors] = useState({ buyerId: "", count: "", productId: "" });

    const handleChange = ({target}) => {
        const _fields = Object.assign({}, fields);
        _fields[target.id] = target.value;
        setFields(_fields);
    }

    const validateForm = () => {
        const constraintBuilder = new ValidationConstraintBuilder();
        const formValidator = new FormValidator();
        const fieldsToFilter = [fields["buyerId"], fields["count"], fields["productId"]];
        const _errors = { buyerId: "", count: "", productId: "" };

        const countConstraints = constraintBuilder.reset().setNotEmpty().setNumbersOnly().build();
        const idConstraints = constraintBuilder.reset().setNotEmpty().setNumbersOnly().setMinNumericValue(1).build();

        const result = formValidator.validate([
            { fieldName: "buyerId", constraints: idConstraints },
            { fieldName: "count", constraints: countConstraints },
            { fieldName: "productId", constraints: idConstraints },
        ], fieldsToFilter, _errors);

        setErrors(Object.assign({}, _errors));
        return result;
    }

    const onAddBtnClick = async () => {
        if(validateForm()) {
            const order = {
                buyerId: fields["buyerId"],
                count: fields["count"],
                orderStatus: 0,
                productId: fields["productId"],
            };

            const resultOrder = await createOrder(order);
            if(resultOrder instanceof Error) {
                const _errors = [];
                _errors["post"] = "Wrong id or count exceeds available products count";
                setErrors(_errors);
                return;
            }

            window.location.href = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
        }
    }

    return (
        <div className="container">
            <Link to="/orders" style={{ textDecoration: 'none', color: 'white', width:"100%"  }}>
              <div className="btn btn-secondary active">
                &lt;&lt; Back
              </div>
            </Link> 
            <hr></hr>

            <h2>New Order</h2>
            <div className="form-row">
                <div className="form-group col">
                    <TextInput id="buyerId" text="Buyer Id" handleChange={handleChange} errors={errors} placeholder="Buyer Id" />
                </div>
                <div className="form-group col">
                    <TextInput id="count" text="Count" handleChange={handleChange} errors={errors} placeholder="Count" />  
                </div>  
                <div className="form-group col">
                    <TextInput id="productId" text="Product Id" handleChange={handleChange} errors={errors} placeholder="0" />    
                </div>  
            </div>
            <div className="form-row mt-3">
                <button className="btn btn-primary btn-lg btn-block" onClick={onAddBtnClick}>Add Order</button>
                <div className="text-danger mt-2">{errors["post"]}</div>    
            </div>
        </div>
    );
}

export default NewOrderForm;