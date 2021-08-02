import React, { useCallback, useEffect, useState } from 'react';

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
import { useParams, withRouter } from 'react-router';
import GridifyQueryBuilder from './GridifyQueryBuilder';

import { TextInput, CategorySelectInput } from './Inputs';

const ProductListItem = (props) => {
  const [readonly, setReadonly] = useState(false);
  const [product, setProduct] = useState({});

  useEffect(() => {
    async function queryItem() {
      // check whether there are some pending orders with this product, if yes, dont allow to modify it.
      const queryBuilder = new GridifyQueryBuilder();
      const query = queryBuilder.setFilterEquals("productId", props.product.id).build();
      const ordersWithOurProduct = await getOrders(query);
      if(ordersWithOurProduct.length > 0) {
        setReadonly(true);
      }
    }

    queryItem();
  }, []);

  const handleChange = ({target}) => {
    const _product = Object.assign({}, product);
    _product.modified = true;
    _product[target.id] = target.value;
    setProduct(_product);
    props.onAnyItemModify();
  }

  return (
    <li className="list-group-item listItem m-2">
      <div className="p-1 mb-2">
        <b>Product Id: {product.id}</b> 
        { readonly ? (<div className="text-warning">There are pending orders for this product so it can't be modified now.</div>) : ("")}

        <div className="float-right">
          <button className="btn btn-danger btn-sm" onClick={() => props.onItemRemove(props.product.id)} disabled={readonly}>Remove</button>
        </div>
      </div>
      <div className="d-flex flex-row justify-content-between">
        <div className="d-flex">
          <div className="pictureCol">
            <img src={props.product.image} className="pictmp"></img>
          </div>
          <div className="d-flex flex-column pl-4">
            <div className="py-1">
              <TextInput id="name" text="Name" handleChange={handleChange} defaultValue={props.product.name} disabled={readonly}/>
              <CategorySelectInput handleChange={handleChange} defaultValue={props.categories[props.product.categoryId-1].name} disabled={readonly}/>
            </div>
          </div>
          <div className="d-flex flex-column pl-4">
            <div className="py-2">
              <TextInput id="price" text="Price" handleChange={handleChange} defaultValue={props.product.price} disabled={readonly}/>
            </div>
          </div>        
          <div className="d-flex flex-column pl-4">
            <div className="py-2">
              <TextInput id="count" text="Count" handleChange={handleChange} defaultValue={props.product.count} disabled={readonly}/>
            </div>
          </div>  
        </div>
      </div>
    </li>
  );
}

const ProductsList = (props) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [anyItemModified, setAnyItemModified] = useState(false);
  const [itemModificationError, setItemModificationError] = useState(false);
  const { id } = useParams();

  let filterBusEvent = undefined;

  const confirmChanges = async () => {
    let _items = [...items];

    for(let i in _items) {
      if(_items[i].modified) {
        const updatedItem = {
          id: _items[i].id,
          name: _items[i].name,
          price: _items[i].price,
          count: _items[i].count,
          sellerId: _items[i].sellerId,
          categoryId: _items[i].categoryId,
        };
        _items[i].modified = false;

        if(!updatedItem.name || !updatedItem.price || !updatedItem.count || 
          isNaN(updatedItem.price) || isNaN(updatedItem.count)) {
          setItemModificationError(true);
        } else {
          await updateProduct(updatedItem.id, updatedItem);
          setItemModificationError(false);
        }
      }
    }

    setItems(_items);
    setAnyItemModified(false);
  }

  const fetchItems = async () => {
    if(id) {
      const query = new GridifyQueryBuilder().setFilterEquals("id", id).build();
      await loadItems(query);
    }
    else {
      await loadItems("");
    }
  }

  useEffect(() => {
    filterBusEvent = EventBus.on("applyFilterToProductsList", async (query) => await loadItems(query));

    fetchItems();

    return function cleanup() {
      filterBusEvent(); //unregister global event
    }
  }, []);

  const loadItems = async (query) => {
    setLoaded(false);
    setError(false);

    const categoriesData = await getCategories();
    if (!categoriesData) {
      setError(true);
      return;
    }

    const productsData = await getProducts(query);
    if(!productsData) {
      setError(true);
      return;
    }

    for(let i in productsData) {
      productsData[i].modified = false;
      const productImages = await getProductImages(productsData[i].id);
      if(!productImages) {
        setError(true);
        return;
      }

      if(productImages.length > 0) {
        const image = await getImage(productImages[0].imageURL);
        if(!image) {
          setError(true);
          return;
        }

        //create url and save it to our fetched product
        var file = window.URL.createObjectURL(image);
        productsData[i].image = file;
      }
    }

    setItems(productsData);
    setCategories(categoriesData);
    setLoaded(true);
  }

  const onItemRemove = async (productId) => {
    if (window.confirm('Do you really want to remove this product?')) {
      const products = [...items];
      products.splice(products.indexOf(products => products.id === productId), 1);
      await deleteProduct(productId);
      setItems(products);
    } 
  }

  if(error) {
    return (
      <div className="container">
        <div>There was an error when loading products</div>
      </div>
    );
  }
  else if(!loaded)
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
            <ProductListItem product={item} categories={categories} onAnyItemModify={() => setAnyItemModified(true)} onItemRemove={onItemRemove}/>
            ))}
          </ul>
        </div>
        <OperationButtons onConfirmChangesBtnClick={confirmChanges} anyItemModified={anyItemModified} error={itemModificationError} addNewItemRoute="/products/new"/> 
      </div>
    );
  }
}

export default withRouter(ProductsList);