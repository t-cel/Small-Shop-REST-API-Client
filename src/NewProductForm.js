import React, { useEffect, useState } from 'react';

import { 
    createProduct, 
    uploadImage,
    addProductImage,
    getCategories
} from './api';

import { FormValidator, ValidationConstraintBuilder } from './FormValidator';
import { TextInput, CategorySelectInput } from './Inputs';
import { Link } from 'react-router-dom';

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const NewProductForm = (props) => {
    const [fields, setFields] = useState({ categoryId: 1 });
    const [errors, setErrors] = useState({ name: "", price: "", count: "" });
    const [picture, setPicture] = useState({});
    const [categories, setCategories] = useState([]);

    const handleChange = ({target}) => {
        const _fields = Object.assign({}, fields);
        _fields[target.id] = target.value;
        setFields(_fields);
    }

    const validateForm = () => {
        const constraintBuilder = new ValidationConstraintBuilder();
        const formValidator = new FormValidator();
        const fieldsToFilter = [fields["name"], fields["price"], fields["count"]];
        const _errors = { name: "", price: "", count: "" };

        const result = formValidator.validate([
            { fieldName: "name", constraints: constraintBuilder.reset().setNotEmpty().build() },
            { fieldName: "price", constraints: constraintBuilder.reset().setNotEmpty().setNumbersOnly().setMinNumericValue(0).build() },
            { fieldName: "count", constraints: constraintBuilder.reset().setNotEmpty().setNumbersOnly().setMinNumericValue(0).build() },
        ], fieldsToFilter, _errors);

        setErrors(Object.assign({}, _errors));
        return result;
    }

    const onAddBtnClick = async () => {
        if (validateForm()) {
            // create product
            const product = {
                name: fields["name"],
                price: parseFloat(fields["price"]),
                count: parseInt(fields["count"]),
                categoryId: fields["categoryId"]
            };
            const resultProduct = await createProduct(product);

            //upload image
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

    const onPictureSelect = ({target}) => {
        setPicture(target.files[0]);
    }

    useEffect(() => {
        async function loadCategories() {
            const _categories = await getCategories();
            if(!_categories)
                return;
            setCategories(_categories);
        }

        loadCategories();
    }, []);

    const categoryText = categories.length > 0 ? categories[fields["categoryId"]-1].name : "Loading...";

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
                <TextInput id="name" text="Name" handleChange={handleChange} errors={errors} placeholder={"Product Name"} />
            </div>
            <div className="form-row mt-2">
                <div className="form-group col">
                    <TextInput id="price" text="Price" handleChange={handleChange} errors={errors} placeholder={"9.99"} />
                </div>    
                <div className="form-group col">
                    <TextInput id="count" text="Count" handleChange={handleChange} errors={errors} placeholder={"10"} />
                </div>   
            </div>
            <div className="form-row">
                <div className="form-group col">
                    <label htmlFor="picture_input">Picture:</label>
                    <input id="picture_input" className="form-control" type="file" onChange={onPictureSelect}></input>
                </div>
            </div>
            <div className="form-row">
                <CategorySelectInput handleChange={handleChange} defaultValue={categoryText}/>
            </div>  
            <div className="form-row mt-3">
                <button className="btn btn-primary btn-lg btn-block" onClick={onAddBtnClick}>Add Product</button>
            </div>
        </div>
    );
}

export default NewProductForm;