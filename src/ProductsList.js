import React from 'react';

import { 
    getProductImages, 
    getProducts, 
    getImage, 
    updateProduct,
    getCategories,
    deleteProduct,
  } from './api';

import OperationButtons from './OperationButtons';
import ProductFilterPanel from './ProductsFilterPanel';
import GridifyQueryBuilder from './GridifyQueryBuilder';

class ProductListItem extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this); 
      this.state = {
        product: this.props.product
      }
    }
  
    handleChange({target}) {
      const updated = this.state.product;
      updated.modified = true;
      updated[target.name] = target.value;
      this.setState({
        product: updated
      });
      this.props.onAnyItemModify();
      //console.log(this.props.product);
      //console.log(`${target.name}: ${target.value}`);
    }
  
    render() {
      return (
        <li className="list-group-item listItem m-2">
          <div className="p-1 mb-2">
            <b>Product Id: {this.props.product.id}</b>
            <div className="float-right">
              <button className="btn btn-danger btn-sm" onClick={() => this.props.onItemRemove(this.props.product.id)}>Remove</button>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex">
              <div className="pictureCol">
                <img src={this.props.product.image} className="pictmp"></img>
              </div>
              <div className="d-flex flex-column pl-4">
                <div className="py-1">
                  Name: 
                  <input 
                    className="form-control" 
                    type="text" 
                    onChange={this.handleChange} 
                    name="name" 
                    defaultValue={this.props.product.name} 
                    disabled={this.props.readonly}>
                  </input>
                </div>
                
                <label htmlFor="category_dropdown">Category:</label>
                <div className="dropdown" id="category_dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled={this.props.readonly}>
                    {
                      this.props.categories[this.props.product.categoryId-1].name
                    }
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
              <div className="d-flex flex-column pl-4">
                <div className="py-2">
                  Price: 
                  <input 
                    className="form-control" 
                    type="text" 
                    onChange={this.handleChange} 
                    name="price" 
                    defaultValue={this.props.product.price} 
                    disabled={this.props.readonly}>
                  </input>
                </div>
              </div>        
              <div className="d-flex flex-column pl-4">
                <div className="py-2">
                  Count: 
                  <input 
                    className="form-control" 
                    type="text"
                    onChange={this.handleChange} 
                    name="count" 
                    defaultValue={this.props.product.count} 
                    disabled={this.props.readonly}>
                  </input>
                </div>
              </div>      
            </div>
          </div>
        </li>
      );
    }
  }
  
export default class ProductsList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: null,
        isLoaded: false,
        items: [],
        categories: [],
        anyItemModified: false,
      }
      this.confirmChanges = this.confirmChanges.bind(this);
      this.onAnyItemModify = this.onAnyItemModify.bind(this);
      this.onItemRemove = this.onItemRemove.bind(this);
      this.loadItems = this.loadItems.bind(this);
      this.onApplyFilter = this.onApplyFilter.bind(this);
    }
  
    // on confirm button click, make a copy without our local data and update product 
    async confirmChanges() {  
      const items = this.state.items;
      for(let i in items) {
        if(items[i].modified) {
          const updatedItem = {
            id: items[i].id,
            name: items[i].name,
            price: items[i].price,
            count: items[i].count,
            sellerId: items[i].sellerId,
            categoryId: items[i].categoryId,
          };
          items[i].modified = false;
          await updateProduct(updatedItem.id, updatedItem);
          console.log(`product with id ${items[i].id} updated`);
        }
      }
      this.setState({
        error: this.state.error,
        isLoaded: this.state.isLoaded,
        items: this.state.items,
        categories: this.state.categories,
        anyItemModified: false
      });
    }
  
    // here we load all products from api, create images for them and save categories for later use.
    async componentDidMount() {
      await this.loadItems("");
    }
    
    async loadItems(query) {
      const categoriesData = await getCategories();
      if(!categoriesData)
        return;
  
      const productsData = await getProducts(query);
      if(!productsData)
        return;
  
      for(let i in productsData) {
        productsData[i].modified = false;
        const productImages = await getProductImages(productsData[i].id);
        if(!productImages)
          return;
  
        if(productImages.length > 0) {
          const image = await getImage(productImages[0].imageURL);
          if(!image)
            return;
  
          //create url and save it to our fetched product
          var file = window.URL.createObjectURL(image);
          productsData[i].image = file;
        }
      }
  
      this.setState({
        error: false,
        isLoaded: true,
        items: productsData,
        categories: categoriesData
      });
    }

    onAnyItemModify() {
      this.setState({
        error: this.state.error,
        isLoaded: this.state.isLoaded,
        items: this.state.items,
        categories: this.state.categories,
        anyItemModified: true
      });
    }
  
    async onItemRemove(productId) {
      //temp solution
      if (window.confirm('Do you really want to remove this product?')) {
        const products = this.state.items;
        products.splice(products.indexOf(products => products.id === productId), 1);
        await deleteProduct(productId);
        this.setState(this.state); //refresh
      } 
    }

    async onApplyFilter(query) {
      this.setState({
        isLoaded: false,
        items: []
      });
      await this.loadItems(query);
    }

    render() {
      const { error, isLoaded, items } = this.state;
      if(error){
        return (
          <div className="container">
            <div>There was an error when loading products</div>
          </div>
        );
      }
      else if(!isLoaded)
      {
        return (
          <div className="container">
            <div>Loading...</div>
          </div>
        ); 
      }
      else {
        return (
          <div className="container">
            <div className="d-flex">
              <ul className="list-group itemsList mt-1 mx-2">      
                {items.map(item =>(
                <ProductListItem product={item} categories={this.state.categories} onAnyItemModify={this.onAnyItemModify} onItemRemove={this.onItemRemove}/>
                ))}
              </ul>
            </div>
            <OperationButtons onConfirmChangesBtnClick={this.confirmChanges} anyItemModified={this.state.anyItemModified} addNewItemRoute="/products/new"/> 
          </div>
        );
      }
    }
  }