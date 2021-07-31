import React from 'react';

import { 
    getProductImages, 
    getProducts, 
    getImage, 
    updateProduct,
    getCategories,
    deleteProduct,
    getOrders,
  } from './api';

import OperationButtons from './OperationButtons';
import EventBus from 'eventing-bus';
import { withRouter } from 'react-router';
import GridifyQueryBuilder from './GridifyQueryBuilder';

class ProductListItem extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this); 
      this.state = {
        product: this.props.product,
        readonly: false
      }
    }
  
    async componentDidMount() {
      const queryBuilder = new GridifyQueryBuilder();
      const query = queryBuilder.setFilterEquals("productId", this.state.product.id).build();
      const ordersWithOurProduct = await getOrders(query);
      if(ordersWithOurProduct.length > 0) {
        this.setState({readonly: true});
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
    }
  
    render() {
      const { product, readonly } = this.state;

      return (
        <li className="list-group-item listItem m-2">
          <div className="p-1 mb-2">
            <b>Product Id: {product.id}</b> 
            { readonly ? (<div class="text-warning">There are pending orders for this product so it can't be modified now.</div>) : ("")}

            <div className="float-right">
              <button className="btn btn-danger btn-sm" onClick={() => this.props.onItemRemove(product.id)} disabled={readonly}>Remove</button>
            </div>
          </div>
          <div className="d-flex flex-row justify-content-between">
            <div className="d-flex">
              <div className="pictureCol">
                <img src={product.image} className="pictmp"></img>
              </div>
              <div className="d-flex flex-column pl-4">
                <div className="py-1">
                  Name: 
                  <input 
                    className="form-control" 
                    type="text" 
                    onChange={this.handleChange} 
                    name="name" 
                    defaultValue={product.name} 
                    disabled={readonly}>
                  </input>
                </div>
                
                <label htmlFor="category_dropdown">Category:</label>
                <div className="dropdown" id="category_dropdown">
                  <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled={readonly}>
                    {
                      this.props.categories[product.categoryId-1].name
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
                    defaultValue={product.price} 
                    disabled={readonly}>
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
                    defaultValue={product.count} 
                    disabled={readonly}>
                  </input>
                </div>
              </div>  
            </div>
          </div>
        </li>
      );
    }
  }
  
class ProductsList extends React.Component {
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
      this.filterBusEvent = undefined;
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
      this.filterBusEvent = EventBus.on("applyFilterToProductsList", async (query) => await this.loadItems(query));

      const lastStrAfterSlash = window.location.href.substr(window.location.href.lastIndexOf("/")+1);
      if(!isNaN(lastStrAfterSlash)) {
        const query = new GridifyQueryBuilder().setFilterEquals("id", lastStrAfterSlash).build();
        await this.loadItems(query);
      }
      else {
        await this.loadItems("");
      }
    }

    async componentWillUnmount() {
      this.filterBusEvent(); //unregister global event
    }
    
    async loadItems(query) {
      this.setState({
        isLoaded: false,
        items: []
      });

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
          <div className="container mt-5">
            <div className="text-center">
              <div className="spinner-border" style={{width: "4rem", height: "4rem"}} role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
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

  export default withRouter(ProductsList);