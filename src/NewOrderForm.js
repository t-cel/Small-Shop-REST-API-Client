import React from 'react';

import { 
    createOrder,
    createProduct
} from './api';

import { Link } from 'react-router-dom';

export default class NewOrderForm extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            errors: {},
        }
        this.handleChange = this.handleChange.bind(this);
        this.onAddBtnClick = this.onAddBtnClick.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    handleChange({target}) {
        const fields = this.state.fields;
        fields[target.name] = target.value;
        this.setState({fields});
    }

    validateForm() {
        const fields = this.state.fields;
        let formIsValid = true;
        let errors = [];

        //https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
        const isNumeric = (str) => {
            if (typeof str != "string") return false;

            if(!isNaN(str)) {
                const asFloat = parseFloat(str);
                return asFloat > 0.0 && !isNaN(parseFloat(str));
            }
        }

        if(!fields["buyerId"]) {
            errors["buyerId"] = "Cannot be empty";
            formIsValid = false;
        } else if(!isNumeric(fields["buyerId"])) {
            errors["buyerId"] = "Not a valid id";
            formIsValid = false;
        }

        if(!fields["count"]) {
            errors["count"] = "Cannot be empty";
            formIsValid = false;
        } else if(!isNumeric(fields["count"])) {
            errors["count"] = "Not a valid count";
            formIsValid = false;
        }
        
        if(!fields["productId"]) {
            errors["productId"] = "Cannot be empty";
            formIsValid = false;
        } else if(!isNumeric(fields["productId"])) {
            errors["productId"] = "Not a valid id";
            formIsValid = false;
        }

        this.setState({fields, errors});
        return formIsValid;
    }

    async onAddBtnClick() {
        if(this.validateForm()) {
            const fields = this.state.fields;
            const order = {
                buyerId: fields["buyerId"],
                count: fields["count"],
                orderStatus: 0,
                productId: fields["productId"],
            };
            
            const resultOrder = await createOrder(order);
            if(!resultOrder) {
                let errors = [];
                errors["post"] = "Wrong id or count exceeds available products count";
                this.setState({
                    errors: errors
                });
                return;
            }
            console.log(resultOrder);

            window.location.href = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
        }
    }
    
    render() {
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
                    Buyer Id: 
                    <input 
                        className="form-control" 
                        type="text" 
                        onChange={this.handleChange} 
                        name="buyerId" 
                        placeholder="buyer id" 
                    >
                    </input>
                    <div className="text-danger">{this.state.errors["buyerId"]}</div>
                </div>
                <div className="form-group col">
                    Count: 
                    <input 
                        className="form-control" 
                        type="text" 
                        onChange={this.handleChange} 
                        name="count" 
                        placeholder="0"
                    >
                    </input>
                    <div className="text-danger">{this.state.errors["count"]}</div>    
                </div>  
                <div className="form-group col">
                    Product Id: 
                    <input 
                        className="form-control" 
                        type="text" 
                        onChange={this.handleChange} 
                        name="productId" 
                        placeholder="0"
                    >
                    </input>
                    <div className="text-danger">{this.state.errors["productId"]}</div>    
                </div>  
            </div>
            <div className="form-row mt-3">
                <button className="btn btn-primary btn-lg btn-block" onClick={this.onAddBtnClick}>Add Order</button>
                <div className="text-danger mt-2">{this.state.errors["post"]}</div>    
            </div>
        </div>
        );
    }
}