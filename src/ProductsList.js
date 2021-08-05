import React, { useEffect, useState } from 'react';

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
import { LoadingSpinner } from './LoadingSpinner';

const ProductListItem = (props) => {
  const [readonly, setReadonly] = useState(false);

  useEffect(() => {
    // check whether there are some pending orders with this product, if yes, dont allow to modify it.
    async function queryOrders() {
      const queryBuilder = new GridifyQueryBuilder();
      const query = queryBuilder.setFilterEquals("productId", props.product.id).build();
      const ordersWithOurProduct = await getOrders(query);
      if(ordersWithOurProduct.length > 0) {
        setReadonly(true);
      }
    }

    queryOrders();
  }, []);

  const handleChange = ({target}) => {
    props.handleChange(target, props.product.id);
  }

  const product = props.product;
  return (
    <li className="list-group-item listItem m-2">
      <div className="p-1 mb-2">
        <b>Product Id: {product.id}</b> 
        { readonly ? (<div className="text-warning">There are pending orders for this product so it can't be modified now.</div>) : ("")}

        <div className="float-right">
          <button className="btn btn-danger btn-sm" onClick={() => props.onItemRemove(product.id)} disabled={readonly}>Remove</button>
        </div>
      </div>
      <div className="d-flex flex-row justify-content-between">
        <div className="d-flex">
          <div className="pictureCol">
            <img src={product.image} alt="" className="pictmp"></img>
          </div>
          <div className="d-flex flex-column pl-4">
            <div className="py-1">
              <TextInput id="name" text="Name" handleChange={handleChange} defaultValue={product.name} disabled={readonly}/>
              <CategorySelectInput handleChange={handleChange} defaultValue={props.categories[product.categoryId-1].name} disabled={readonly}/>
            </div>
          </div>
          <div className="d-flex flex-column pl-4">
            <div className="py-2">
              <TextInput id="price" text="Price" handleChange={handleChange} defaultValue={product.price} disabled={readonly}/>
            </div>
          </div>        
          <div className="d-flex flex-column pl-4">
            <div className="py-2">
              <TextInput id="count" text="Count" handleChange={handleChange} defaultValue={product.count} disabled={readonly}/>
            </div>
          </div>  
        </div>
      </div>
    </li>
  );
}

const ProductsList = (props) => {
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [anyItemModified, setAnyItemModified] = useState(false);
  const [itemModificationError, setItemModificationError] = useState(false);
  const { id } = useParams();

  const confirmChanges = async () => {
    let _items = [...items];
    let _error = "";
    const wasError = () => _error.length > 0;

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
          await updateProduct(updatedItem.id, updatedItem).catch(e => {
            _error = "There was an error during products update"; 
          });
          if(wasError()) { alert(_error); return; }
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
    const filterBusEvent = EventBus.on("applyFilterToProductsList", async (query) => await loadItems(query));

    fetchItems();

    return function cleanup() {
      filterBusEvent(); //unregister global event
    }
  }, []);

  const loadItems = async (query) => {
    setLoaded(false);
    setError("");
    let _error = "";
    const wasError = () => _error.length > 0;

    const categoriesData = await getCategories().catch(e => { 
      _error = "There was an error during categories fetch"; 
    });
    if(wasError()) { setError(_error); return; }

    const productsData = await getProducts(query).catch(e => { 
      _error = "There was an error during products fetch"; 
    });
    if(wasError()) { setError(_error); return; }

    for(let i in productsData) {
      productsData[i].modified = false;
      const productImages = 
        await getProductImages(productsData[i].id).catch(e => { 
          _error = "There was an error during product images fetch, product id: " + productsData[i].id;
        });
      if(wasError()) { setError(_error); return; }

      if(productImages.length > 0) {
        const image = await getImage(productImages[0].imageURL).catch(e => { 
          _error = "There was an error when downloading product image, product id: " + productsData[i].id;
        });
        if(wasError()) { setError(_error); return; }

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
      let _error = "";
      const wasError = () => _error.length > 0;
      const _items = [...items];

      _items.splice(_items.findIndex(products => products.id === productId), 1);
      await deleteProduct(productId).catch(e => _error = "There was an error during removing product");
      if(wasError()) { alert(_error); return; }
      setItems(_items);
    } 
  }

  const handleChange = (target, productId) => {
    const _items = [...items];
    const item = _items[_items.findIndex(item => item.id == productId)];
    item.modified = true;
    item[target.id] = target.value;
    setItems(_items);
    setAnyItemModified(true);
  }

  if(error.length > 0) {
    return (
      <div className="container">
        <div>{error}</div>
      </div>
    );
  }
  else if(!loaded)
  {
    return (
      <div className="container mt-5">
        <LoadingSpinner />
      </div>
    ); 
  }
  else {

    return (
      <div className="container">
        <div className="d-flex">
          <ul className="list-group itemsList mt-1 mx-2">      
            {items.map((item, index) =>(
            <ProductListItem key={index} product={item} categories={categories} handleChange={handleChange} onItemRemove={onItemRemove}/>
            ))}
          </ul>
        </div>
        <OperationButtons onConfirmChangesBtnClick={confirmChanges} anyItemModified={anyItemModified} error={itemModificationError} addNewItemRoute="/products/new"/> 
      </div>
    );
  }
}

export default withRouter(ProductsList);