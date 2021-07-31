import React from 'react';

import { 
    createProduct, 
    uploadImage,
    addProductImage,
    getCategories
} from './api';

import { Link } from 'react-router-dom';

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export default class NewProductForm extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            fields: { "categoryId": 1 },
            errors: {},
            picture: undefined,
            categories: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.onAddBtnClick = this.onAddBtnClick.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.onPictureSelect = this.onPictureSelect.bind(this);
    }

    handleChange({target}) {
        const fields = this.state.fields;
        fields[target.name] = target.value;
        this.setState({fields});
    }

    onPictureSelect({target}) {
        this.setState({picture: target.files[0]});
    }

    async componentDidMount() {
        const categories = await getCategories();
        if(!categories)
            return;

        console.log(categories);

        this.setState({categories: categories})
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

        if(!fields["name"]) {
            errors["name"] = "Cannot be empty";
            formIsValid = false;
        }

        if(!fields["price"]) {
            errors["price"] = "Cannot be empty";
            formIsValid = false;
        } else if(!isNumeric(fields["price"])) {
            errors["price"] = "Not a valid price";
            formIsValid = false;
        }

        if(!fields["count"]) {
            errors["count"] = "Cannot be empty";
            formIsValid = false;
        } else if(!isNumeric(fields["count"])) {
            errors["count"] = "Not a valid count";
            formIsValid = false;
        }

        this.setState({fields, errors});

        return formIsValid;
    }

    async onAddBtnClick() {
        if(this.validateForm()) {
            //create product
            const fields = this.state.fields;           
            const product = {
                name: fields["name"],
                price: parseFloat(fields["price"]),
                count: parseInt(fields["count"]),
                categoryId: fields["categoryId"],
            }
            const resultProduct = await createProduct(product);
            console.log(resultProduct);

            //upload image
            const picture = this.state.picture;
            const image64 = await toBase64(picture).catch(e => Error(e));
            if(image64 instanceof Error) {
                console.error(`There was an error during image convert: ${image64.message}`);
            } else {
                const image = {
                    file: image64.split("base64,")[1], //skip data:image part
                    extension: picture.name.substr(picture.name.lastIndexOf(".")+1)
                };

                const uploadResult = await uploadImage(image);
                if(!uploadResult) return;

                //add image to product
                console.log(uploadResult);
                await addProductImage(resultProduct.id, uploadResult);
            }

            window.location.href = window.location.href.substr(0, window.location.href.lastIndexOf("/"));
        }
    }
    
    render() {
        const categoryText = this.state.categories.length > 0 ? this.state.categories[this.state.fields["categoryId"]-1].name : "Loading...";

        return (
        <div className="container">
            <Link to="/products" style={{ textDecoration: 'none', color: 'white', width:"100%"  }}>
              <div className="btn btn-secondary active">
                &lt;&lt; Back
              </div>
            </Link> 
            <hr></hr>

            <h2>New Product</h2>
            <div className="form-row">
                Name: 
                <input 
                    className="form-control" 
                    type="text" 
                    onChange={this.handleChange} 
                    name="name" 
                    placeholder="product name" 
                >
                </input>
            </div>
            <div className="text-danger">{this.state.errors["name"]}</div>
            <div className="form-row mt-2">
                <div className="form-group col">
                    Price: 
                    <input 
                        className="form-control" 
                        type="text" 
                        onChange={this.handleChange} 
                        name="price" 
                        placeholder="0"
                    >
                    </input>
                    <div className="text-danger">{this.state.errors["price"]}</div>    
                </div>    
                <div className="form-group col">
                    Count: 
                    <input 
                        className="form-control" 
                        type="text"
                        onChange={this.handleChange} 
                        name="count" 
                        placeholder="1"
                    >
                    </input>
                    <div className="text-danger">{this.state.errors["count"]}</div>
                </div>   
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label htmlFor="picture_input">Picture:</label>
                    <input id="picture_input" className="form-control" type="file" onChange={this.onPictureSelect}></input>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label htmlFor="category_dropdown">Category:</label>
                        <div className="dropdown" id="category_dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled={this.props.readonly}>
                            {categoryText}
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <button className="dropdown-item" onClick={this.handleChange} name="categoryId" value="1">Sport</button>
                            <button className="dropdown-item" onClick={this.handleChange} name="categoryId" value="2">Clothes</button>
                            <button className="dropdown-item" onClick={this.handleChange} name="categoryId" value="3">Household</button>
                            <button className="dropdown-item" onClick={this.handleChange} name="categoryId" value="4">Car Accessories</button>
                            <button className="dropdown-item" onClick={this.handleChange} name="categoryId" value="5">Kitchen Accessories</button>
                        </div>
                    </div>  
                </div>                     
            </div>  
            <div className="form-row mt-3">
                <button className="btn btn-primary btn-lg btn-block" onClick={this.onAddBtnClick}>Add Product</button>
            </div>
        </div>
        );
    }
}